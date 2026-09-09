"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PortfolioAPI } from "@/services/api";
import { Skill } from "@/types";
import {
  Plus, Edit2, Trash2, Loader2, CheckCircle, AlertCircle,
  X, Award
} from "lucide-react";
import { AdminPageHeader, AdminModal, AdminField } from "@/components/admin/admin-ui";

const SKILL_CATEGORIES = [
  "Web Development", "Frontend", "Backend", "Mobile", "Database", "DevOps",
  "Cloud", "Tools", "Languages", "Design", "Other"
];

const EMPTY_SKILL = {
  name: "",
  category: "Mobile",
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
        if (res.status === 401 || res.message?.includes("401") || res.message?.includes("expired")) {
          setErrorMsg("Your session expired. Redirecting to login...");
          setTimeout(() => {
            window.location.href = "/login?expired=true";
          }, 1200);
        } else {
          setErrorMsg(res.message || "Failed to save skill.");
        }
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
    <div className="space-y-10 animate-fade-in">
      <AdminPageHeader
        badge="Technical Arsenal"
        title="Technical"
        titleAccent="Skills"
        subtitle={`Configure languages, frameworks, developer tools and proficiency percentages. (${items.length} skills)`}
        icon={<Award size={13} />}
        action={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[#00B8D4] text-black font-bold text-sm shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Skill</span>
          </button>
        }
      />

      {/* Category Filter Pills */}
      {!loading && items.length > 0 && (
        <div className="flex flex-wrap gap-2.5 p-1.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] w-fit">
          {categories.map((cat) => {
            const isSelected = filterCategory === cat;
            const count = cat === "All" ? items.length : items.filter(s => (s.category || "Other") === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[var(--primary)] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isSelected ? "bg-black/20 text-black font-bold" : "bg-white/5 text-slate-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Skills Grid */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-[var(--primary)]" size={36} />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400 bg-white/[0.02] border border-white/[0.08] rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
              <Award size={28} />
            </div>
            <p className="text-base font-semibold text-white">No skills added yet</p>
            <p className="text-sm text-slate-400 max-w-sm text-center">Add technologies you use like Flutter, React, Next.js, and Node.js.</p>
            <button
              onClick={openAdd}
              className="mt-2 text-[var(--primary)] hover:underline text-sm font-bold cursor-pointer"
            >
              + Add First Skill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((skill) => (
              <div
                key={skill.id}
                className="rounded-2xl border border-white/[0.08] bg-[#0c101a]/80 backdrop-blur-xl p-6 hover:border-[var(--primary)]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-[var(--primary)] transition-colors">{skill.name}</h3>
                      <span className="inline-block text-[11px] font-medium text-slate-400 mt-0.5">
                        {skill.category || "General"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(skill)}
                        className="p-2 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        title="Edit Skill"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id, skill.name)}
                        disabled={deletingId === skill.id}
                        className="p-2 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-40 cursor-pointer"
                        title="Delete Skill"
                      >
                        {deletingId === skill.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Meter Bar */}
                  <div className="space-y-1.5 mt-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-slate-400">Proficiency</span>
                      <span className="font-bold text-[var(--primary)]">{skill.proficiency}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full border border-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--primary)]/80 to-[var(--primary)] rounded-full transition-all duration-500"
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Roomy Modal */}
      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? "Edit Skill" : "Add Technical Skill"}
        subtitle="Set skill name, technology category domain, and proficiency rating percentage."
        onSubmit={handleSave}
        submitLabel={editing ? "Save Skill" : "Add Skill"}
        isSaving={saveStatus === "saving"}
        saveStatus={saveStatus}
        errorMsg={errorMsg}
        maxWidth="2xl"
      >
        <AdminField
          label="Skill Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Flutter, React, Next.js, MySQL"
          required
        />

        <div className="space-y-2">
          <label className="block text-xs md:text-sm font-semibold text-slate-200 tracking-wide">
            Domain Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all cursor-pointer [color-scheme:dark]"
          >
            {SKILL_CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#0c101a] text-white py-2">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Proficiency Slider */}
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-xs md:text-sm font-semibold text-slate-200 tracking-wide">
              Proficiency Rating
            </label>
            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-[var(--primary)]/15 border border-[var(--primary)]/30 text-[var(--primary)]">
              {form.proficiency}%
            </span>
          </div>
          <input
            type="range"
            name="proficiency"
            min="10"
            max="100"
            value={form.proficiency}
            onChange={handleChange}
            className="w-full accent-[var(--primary)] cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Beginner (20%)</span>
            <span>Intermediate (50%)</span>
            <span>Expert (90%+)</span>
          </div>
        </div>

        <AdminField
          label="Display Order"
          name="display_order"
          value={String(form.display_order)}
          onChange={handleChange}
          type="number"
          placeholder="0"
          helperText="Lower numbers appear first within category"
        />
      </AdminModal>
    </div>
  );
}
