"use client";

import { useEffect, useState } from "react";
import { PortfolioAPI } from "@/services/api";
import { Experience } from "@/types";
import {
  Plus, Edit2, Trash2, Loader2, CheckCircle, AlertCircle,
  X, Briefcase, MapPin, Calendar
} from "lucide-react";

const EMPTY_EXP = {
  company: "",
  logo_url: "",
  role: "",
  description: "",
  technologies: "",
  start_date: "",
  end_date: "",
  currently_working: false,
  location: "",
  display_order: 0,
};

type SaveStatus = "idle" | "saving" | "success" | "error";

export default function AdminExperience() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<any>(EMPTY_EXP);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await PortfolioAPI.getExperience();
      if (res.success) setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_EXP });
    setSaveStatus("idle");
    setErrorMsg("");
    setModalOpen(true);
  };

  const openEdit = (item: Experience) => {
    setEditing(item);
    setForm({
      company: item.company || "",
      logo_url: item.logo_url || "",
      role: item.role || "",
      description: item.description || "",
      technologies: item.technologies || "",
      start_date: item.start_date ? item.start_date.substring(0, 10) : "",
      end_date: item.end_date ? item.end_date.substring(0, 10) : "",
      currently_working: item.currently_working,
      location: item.location || "",
      display_order: item.display_order || 0,
    });
    setSaveStatus("idle");
    setErrorMsg("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setSaveStatus("idle");
    setErrorMsg("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company?.trim()) {
      setSaveStatus("error"); setErrorMsg("Company name is required."); return;
    }
    if (!form.role?.trim()) {
      setSaveStatus("error"); setErrorMsg("Role is required."); return;
    }
    if (!form.start_date) {
      setSaveStatus("error"); setErrorMsg("Start date is required."); return;
    }
    setSaveStatus("saving");
    setErrorMsg("");

    const payload = {
      ...form,
      currently_working: form.currently_working ? true : false,
      display_order: Number(form.display_order) || 0,
      end_date: form.currently_working ? null : (form.end_date || null),
    };

    try {
      const res = editing
        ? await PortfolioAPI.updateExperience(editing.id, payload)
        : await PortfolioAPI.createExperience(payload);

      if (res.success) {
        setSaveStatus("success");
        await fetchItems();
        setTimeout(closeModal, 1200);
      } else {
        setSaveStatus("error");
        setErrorMsg(res.message || "Failed to save experience.");
      }
    } catch {
      setSaveStatus("error");
      setErrorMsg("Network error. Could not reach the server.");
    }
  };

  const handleDelete = async (id: number, company: string) => {
    if (!confirm(`Delete experience at "${company}"?`)) return;
    setDeletingId(id);
    try {
      const res = await PortfolioAPI.deleteExperience(id);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        alert(res.message || "Failed to delete.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-1">Experience</h1>
          <p className="text-[var(--text-secondary)]">
            {items.length} position{items.length !== 1 ? "s" : ""} · Saved to MySQL
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#FDE047] text-black font-bold rounded-xl hover:bg-[#FDE047]/90 hover:shadow-[0_0_20px_rgba(253,224,71,0.4)] transition-all">
          <Plus size={18} /> Add Experience
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-[var(--text-secondary)] bg-white/[0.03] border border-white/10 rounded-2xl">
            <Briefcase size={48} className="opacity-30" />
            <p className="text-lg">No experience records yet.</p>
            <button onClick={openAdd} className="text-[#FDE047] hover:underline text-sm">Add your first position →</button>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-4 hover:border-white/20 transition-colors group">
              <div className="flex-1">
                <div className="flex flex-wrap items-start gap-3 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{item.role}</h3>
                    <p className="text-[#FDE047] font-medium">{item.company}</p>
                  </div>
                  {item.currently_working && (
                    <span className="px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-semibold">
                      Current
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-white/50 mb-3">
                  {item.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} /> {item.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {formatDate(item.start_date)} — {item.currently_working ? "Present" : formatDate(item.end_date)}
                  </span>
                </div>
                {item.description && (
                  <p className="text-sm text-white/60 line-clamp-2">{item.description}</p>
                )}
                {item.technologies && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.technologies.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                      <span key={t} className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/60">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex md:flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)}
                  className="p-2.5 text-white/40 hover:text-[#FDE047] hover:bg-[#FDE047]/10 rounded-xl transition-all" title="Edit">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(item.id, item.company)}
                  disabled={deletingId === item.id}
                  className="p-2.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50" title="Delete">
                  {deletingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{editing ? "Edit Experience" : "Add Experience"}</h2>
              <button onClick={closeModal} className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <MField label="Company *" name="company" value={form.company} onChange={handleChange} placeholder="Google" required />
                <MField label="Role *" name="role" value={form.role} onChange={handleChange} placeholder="Software Engineer" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <MField label="Location" name="location" value={form.location} onChange={handleChange} placeholder="Bangalore, India" />
                <MField label="Company Logo URL" name="logo_url" value={form.logo_url} onChange={handleChange} placeholder="https://..." type="url" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <MField label="Start Date *" name="start_date" value={form.start_date} onChange={handleChange} type="date" required />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80">End Date</label>
                  <input type="date" name="end_date" value={form.end_date} onChange={handleChange}
                    disabled={form.currently_working}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white disabled:opacity-30 focus:outline-none focus:border-[var(--primary)] transition-all" />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="currently_working" checked={form.currently_working} onChange={handleChange} className="w-4 h-4 accent-[#FDE047]" />
                <span className="text-sm text-white/80">Currently working here</span>
              </label>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                  placeholder="What did you work on? Key responsibilities..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)] transition-all resize-none" />
              </div>

              <MField label="Technologies (comma separated)" name="technologies" value={form.technologies} onChange={handleChange} placeholder="React, Node.js, MySQL" />
              <MField label="Display Order" name="display_order" value={String(form.display_order)} onChange={handleChange} type="number" placeholder="0" />

              {saveStatus === "error" && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}
              {saveStatus === "success" && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                  <CheckCircle size={16} /> Saved to MySQL!
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saveStatus === "saving"}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#FDE047] text-black font-bold rounded-xl hover:bg-[#FDE047]/90 transition-all disabled:opacity-60">
                  {saveStatus === "saving" ? <Loader2 size={17} className="animate-spin" /> : <CheckCircle size={17} />}
                  {saveStatus === "saving" ? "Saving..." : editing ? "Save Changes" : "Add Experience"}
                </button>
                <button type="button" onClick={closeModal}
                  className="flex-1 py-3 border border-white/10 text-white/60 rounded-xl hover:bg-white/5 hover:text-white transition-all">
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

function MField({ label, name, value, onChange, placeholder, type = "text", required }: {
  label: string; name: string; value: string; onChange: (e: any) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/80">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)] focus:shadow-[0_0_0_2px_rgba(0,229,255,0.1)] transition-all" />
    </div>
  );
}
