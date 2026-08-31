"use client";

import { useEffect, useState } from "react";
import { PortfolioAPI } from "@/services/api";
import { Project } from "@/types";
import {
  Plus, Edit2, Trash2, Eye, EyeOff, Star, Loader2,
  CheckCircle, AlertCircle, X, Folder, ExternalLink, GitFork
} from "lucide-react";

const EMPTY_PROJECT = {
  title: "",
  category: "",
  slug: "",
  short_description: "",
  description: "",
  image_url: "",
  github_url: "",
  live_url: "",
  featured: false,
  status: "completed",
  type: "web",
  display_order: 0,
  is_visible: true,
};

type SaveStatus = "idle" | "saving" | "success" | "error";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<any>(EMPTY_PROJECT);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await PortfolioAPI.getProjects(true); // adminMode: show all including hidden
      if (res.success) setProjects(res.data || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAdd = () => {
    setEditingProject(null);
    setForm({ ...EMPTY_PROJECT });
    setSaveStatus("idle");
    setErrorMsg("");
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setForm({
      title: p.title || "",
      category: p.category || "",
      slug: p.slug || "",
      short_description: p.short_description || "",
      description: p.description || "",
      image_url: p.image_url || "",
      github_url: p.github_url || "",
      live_url: p.live_url || "",
      featured: p.featured,
      status: p.status || "completed",
      type: p.type || "web",
      display_order: p.display_order || 0,
      is_visible: p.is_visible,
    });
    setSaveStatus("idle");
    setErrorMsg("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProject(null);
    setSaveStatus("idle");
    setErrorMsg("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setForm((prev: any) => ({ ...prev, title, slug: editingProject ? prev.slug : slug }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      setSaveStatus("error");
      setErrorMsg("Project title is required.");
      return;
    }
    if (!form.slug?.trim()) {
      setSaveStatus("error");
      setErrorMsg("Slug is required.");
      return;
    }
    setSaveStatus("saving");
    setErrorMsg("");

    const payload = {
      ...form,
      featured: form.featured ? true : false,
      is_visible: form.is_visible ? true : false,
      display_order: Number(form.display_order) || 0,
    };

    try {
      const res = editingProject
        ? await PortfolioAPI.updateProject(editingProject.id, payload)
        : await PortfolioAPI.createProject(payload);

      if (res.success) {
        setSaveStatus("success");
        await fetchProjects();
        setTimeout(() => {
          closeModal();
        }, 1200);
      } else {
        setSaveStatus("error");
        setErrorMsg(res.message || "Failed to save project.");
      }
    } catch {
      setSaveStatus("error");
      setErrorMsg("Network error. Could not reach the server.");
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    setDeletingId(id);
    try {
      const res = await PortfolioAPI.deleteProject(id);
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(res.message || "Failed to delete project.");
      }
    } catch {
      alert("Network error. Could not delete project.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (p: Project) => {
    const res = await PortfolioAPI.updateProject(p.id, {
      ...p,
      is_visible: !p.is_visible,
    });
    if (res.success) {
      setProjects((prev) =>
        prev.map((proj) => proj.id === p.id ? { ...proj, is_visible: !proj.is_visible } : proj)
      );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-1">Projects</h1>
          <p className="text-[var(--text-secondary)]">
            {projects.length} project{projects.length !== 1 ? "s" : ""} · All saved to MySQL
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#FDE047] text-black font-bold rounded-xl hover:bg-[#FDE047]/90 hover:shadow-[0_0_20px_rgba(253,224,71,0.4)] transition-all"
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-[var(--text-secondary)]">
            <Folder size={48} className="opacity-30" />
            <p className="text-lg">No projects yet.</p>
            <button onClick={openAdd} className="text-[#FDE047] hover:underline text-sm">
              Add your first project →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-white/5 border-b border-white/10 text-white/60">
                <tr>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Visible</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr
                    key={project.id}
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                      !project.is_visible ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{project.title}</div>
                      <div className="text-xs text-white/40 mt-0.5">{project.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-white/60">{project.category || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        project.status === "completed"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/60 capitalize">{project.type}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleVisibility(project)}
                        className={`p-1.5 rounded-lg transition-all ${
                          project.is_visible
                            ? "text-green-400 hover:bg-green-500/10"
                            : "text-white/30 hover:bg-white/5"
                        }`}
                        title={project.is_visible ? "Click to hide" : "Click to show"}
                      >
                        {project.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {project.featured ? (
                        <Star size={16} className="text-[#FDE047] fill-[#FDE047]" />
                      ) : (
                        <Star size={16} className="text-white/20" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noreferrer"
                            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            title="GitHub">
                            <GitFork size={15} />
                          </a>
                        )}
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noreferrer"
                            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            title="Live URL">
                            <ExternalLink size={15} />
                          </a>
                        )}
                        <button
                          onClick={() => openEdit(project)}
                          className="p-2 text-white/40 hover:text-[#FDE047] hover:bg-[#FDE047]/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          disabled={deletingId === project.id}
                          className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === project.id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              <button
                onClick={closeModal}
                className="text-white/40 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ModalField label="Title *" name="title" value={form.title} onChange={handleTitleChange} placeholder="My Awesome Project" required />
                <ModalField label="Category" name="category" value={form.category} onChange={handleChange} placeholder="e.g. Web App, Mobile" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ModalField label="Slug (URL key)" name="slug" value={form.slug} onChange={handleChange} placeholder="my-awesome-project" required />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">Type</label>
                  <select name="type" value={form.type} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] transition-all">
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <ModalField label="Short Description" name="short_description" value={form.short_description} onChange={handleChange} placeholder="One-line summary" />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Full Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                  placeholder="Detailed description of the project..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)] transition-all resize-none" />
              </div>

              <ModalField label="Image URL" name="image_url" value={form.image_url} onChange={handleChange} placeholder="https://..." type="url" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ModalField label="GitHub URL" name="github_url" value={form.github_url} onChange={handleChange} placeholder="https://github.com/..." type="url" />
                <ModalField label="Live URL" name="live_url" value={form.live_url} onChange={handleChange} placeholder="https://..." type="url" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">Status</label>
                  <select name="status" value={form.status} onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] transition-all">
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <ModalField label="Display Order" name="display_order" value={String(form.display_order)} onChange={handleChange} placeholder="0" type="number" />
              </div>

              {/* Checkboxes */}
              <div className="flex gap-8 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                    className="w-4 h-4 accent-[#FDE047]" />
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">Featured project</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" name="is_visible" checked={form.is_visible} onChange={handleChange}
                    className="w-4 h-4 accent-[#FDE047]" />
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">Visible on portfolio</span>
                </label>
              </div>

              {/* Status Messages */}
              {saveStatus === "error" && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}
              {saveStatus === "success" && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                  <CheckCircle size={16} /> Saved to MySQL successfully!
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saveStatus === "saving"}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FDE047] text-black font-bold rounded-xl hover:bg-[#FDE047]/90 transition-all disabled:opacity-60">
                  {saveStatus === "saving" ? <Loader2 size={17} className="animate-spin" /> : <CheckCircle size={17} />}
                  {saveStatus === "saving" ? "Saving..." : editingProject ? "Save Changes" : "Create Project"}
                </button>
                <button type="button" onClick={closeModal}
                  className="flex-1 py-3 border border-white/10 text-white/60 font-medium rounded-xl hover:bg-white/5 hover:text-white transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ModalField({
  label, name, value, onChange, placeholder, type = "text", required,
}: {
  label: string; name: string; value: string; onChange: (e: any) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30
          focus:outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.1)] transition-all" />
    </div>
  );
}
