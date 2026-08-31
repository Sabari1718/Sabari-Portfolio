"use client";

import { useEffect, useState } from "react";
import { PortfolioAPI } from "@/services/api";
import { Skill } from "@/types";
import {
  Plus, Edit2, Trash2, Loader2, CheckCircle, AlertCircle,
  X, Award
} from "lucide-react";

const SKILL_CATEGORIES = [
  "Frontend", "Backend", "Mobile", "Database", "DevOps",
  "Cloud", "Tools", "Languages", "Design", "Other"
];

const EMPTY_SKILL = {
  name: "",
  category: "",
  proficiency: 80,
  icon: "",
  display_order: 0,
};

type SaveStatus = "idle" | "saving" | "success" | "error";

export default function AdminSkills() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState<any>(EMPTY_SKILL);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await PortfolioAPI.getSkills();
      if (res.success) setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  // Group skills by category
  const categories = ["All", ...Array.from(new Set(items.map((s) => s.category || "Other")))];
  const filtered = filterCategory === "All" ? items : items.filter((s) => (s.category || "Other") === filterCategory);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_SKILL });
    setSaveStatus("idle");
    setErrorMsg("");
    setModalOpen(true);
  };

  const openEdit = (item: Skill) => {
    setEditing(item);
    setForm({
      name: item.name || "",
      category: item.category || "",
      proficiency: item.proficiency ?? 80,
      icon: item.icon || "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      setSaveStatus("error"); setErrorMsg("Skill name is required."); return;
    }
    setSaveStatus("saving");
    setErrorMsg("");

    const payload = {
      ...form,
      proficiency: Math.min(100, Math.max(0, Number(form.proficiency) || 80)),
      display_order: Number(form.display_order) || 0,
    };

    try {
      const res = editing
        ? await PortfolioAPI.updateSkill(editing.id, payload)
        : await PortfolioAPI.createSkill(payload);

      if (res.success) {
        setSaveStatus("success");
        await fetchItems();
        setTimeout(closeModal, 1200);
      } else {
        setSaveStatus("error");
        setErrorMsg(res.message || "Failed to save skill.");
      }
    } catch {
      setSaveStatus("error");
      setErrorMsg("Network error. Could not reach the server.");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete skill "${name}"?`)) return;
    setDeletingId(id);
    try {
      const res = await PortfolioAPI.deleteSkill(id);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      } else {
        alert(res.message || "Failed to delete.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-1">Skills</h1>
          <p className="text-[var(--text-secondary)]">
            {items.length} skill{items.length !== 1 ? "s" : ""} · Saved to MySQL
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#FDE047] text-black font-bold rounded-xl hover:bg-[#FDE047]/90 hover:shadow-[0_0_20px_rgba(253,224,71,0.4)] transition-all">
          <Plus size={18} /> Add Skill
        </button>
      </div>

      {/* Category filter tabs */}
      {!loading && items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterCategory === cat
                  ? "bg-[#FDE047] text-black"
                  : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Skills Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-[var(--text-secondary)] bg-white/[0.03] border border-white/10 rounded-2xl">
          <Award size={48} className="opacity-30" />
          <p className="text-lg">No skills yet.</p>
          <button onClick={openAdd} className="text-[#FDE047] hover:underline text-sm">Add your first skill →</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill) => (
            <div key={skill.id}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors group relative">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-semibold text-white">{skill.name}</h3>
                  {skill.category && (
                    <span className="text-xs text-white/50 mt-0.5">{skill.category}</span>
                  )}
                </div>
                <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(skill)}
                    className="p-1.5 text-white/40 hover:text-[#FDE047] hover:bg-[#FDE047]/10 rounded-lg transition-all">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(skill.id, skill.name)}
                    disabled={deletingId === skill.id}
                    className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50">
                    {deletingId === skill.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>

              {/* Proficiency bar */}
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-white/40">Proficiency</span>
                  <span className="text-xs font-semibold text-[#FDE047]">{skill.proficiency}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FDE047] to-[var(--primary)] rounded-full transition-all duration-500"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{editing ? "Edit Skill" : "Add Skill"}</h2>
              <button onClick={closeModal} className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <SField label="Skill Name *" name="name" value={form.name} onChange={handleChange} placeholder="React" required />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Category</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--primary)] transition-all">
                  <option value="">Select category...</option>
                  {SKILL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Proficiency slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-white/80">Proficiency</label>
                  <span className="text-[#FDE047] font-bold text-sm">{form.proficiency}%</span>
                </div>
                <input
                  type="range" name="proficiency" min="0" max="100" step="5"
                  value={form.proficiency}
                  onChange={handleChange}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#FDE047]"
                />
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#FDE047] to-[var(--primary)] rounded-full transition-all"
                    style={{ width: `${form.proficiency}%` }} />
                </div>
              </div>

              <SField label="Icon / Emoji (optional)" name="icon" value={form.icon} onChange={handleChange} placeholder="⚛️ or icon class name" />
              <SField label="Display Order" name="display_order" value={String(form.display_order)} onChange={handleChange} type="number" placeholder="0" />

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
                  {saveStatus === "saving" ? "Saving..." : editing ? "Save Changes" : "Add Skill"}
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

function SField({ label, name, value, onChange, placeholder, type = "text", required }: {
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
