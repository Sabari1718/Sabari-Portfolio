"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { PortfolioAPI } from "@/services/api";
import { Education } from "@/types";
import {
  Plus, Edit2, Trash2, Loader2, CheckCircle, AlertCircle,
  X, GraduationCap, Calendar
} from "lucide-react";
import { AdminPageHeader, AdminModal, AdminField, AdminDateField } from "@/components/admin/admin-ui";

const EMPTY_EDU = {
  institution: "",
  degree: "",
  field: "",
  grade: "",
  start_date: "",
  end_date: "",
  description: "",
  display_order: 0,
};

type SaveStatus = "idle" | "saving" | "success" | "error";

export default function AdminEducation() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState<any>(EMPTY_EDU);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await PortfolioAPI.getEducation();
      if (res.success) setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_EDU });
    setSaveStatus("idle");
    setErrorMsg("");
    setModalOpen(true);
  };

  const openEdit = (item: Education) => {
    setEditing(item);
    setForm({
      institution: item.institution || "",
      degree: item.degree || "",
      field: item.field || "",
      grade: item.grade || "",
      start_date: item.start_date ? item.start_date.substring(0, 10) : "",
      end_date: item.end_date ? item.end_date.substring(0, 10) : "",
      description: item.description || "",
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
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const cleanDate = (d: any): string | null => {
    if (!d || typeof d !== "string") return null;
    const trimmed = d.trim();
    if (!trimmed || trimmed.includes("dd") || trimmed.includes("mm") || trimmed.includes("yyyy")) return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
    return trimmed;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.institution?.trim()) {
      setSaveStatus("error"); setErrorMsg("Institution name is required."); return;
    }
    setSaveStatus("saving");
    setErrorMsg("");

    const payload = {
      ...form,
      start_date: cleanDate(form.start_date),
      end_date: cleanDate(form.end_date),
      display_order: Number(form.display_order) || 0,
    };

    try {
      const res = editing
        ? await PortfolioAPI.updateEducation(editing.id, payload)
        : await PortfolioAPI.createEducation(payload);

      if (res.success) {
        setSaveStatus("success");
        await fetchItems();
        setTimeout(closeModal, 1200);
      } else {
        setSaveStatus("error");
        setErrorMsg(res.message || "Failed to save education.");
      }
    } catch {
      setSaveStatus("error");
      setErrorMsg("Network error. Could not reach the server.");
    }
  };

  const handleDelete = async (id: number, institution: string) => {
    if (!confirm(`Delete education record for "${institution}"?`)) return;
    setDeletingId(id);
    try {
      const res = await PortfolioAPI.deleteEducation(id);
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
    if (!dateStr) return "Present";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <AdminPageHeader
        badge="Academic History"
        title="Education &"
        titleAccent="Qualifications"
        subtitle={`Academic foundations, university degrees, and engineering certifications. (${items.length} records)`}
        icon={<GraduationCap size={13} />}
        action={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[#00B8D4] text-black font-bold text-sm shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Education</span>
          </button>
        }
      />

      {/* List Grid */}
      <div>
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-[var(--primary)]" size={36} />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400 bg-white/[0.02] border border-white/[0.08] rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
              <GraduationCap size={28} />
            </div>
            <p className="text-base font-semibold text-white">No education records yet</p>
            <p className="text-sm text-slate-400 max-w-sm text-center">Add your degree, college, CGPA, and coursework details.</p>
            <button
              onClick={openAdd}
              className="mt-2 text-[var(--primary)] hover:underline text-sm font-bold cursor-pointer"
            >
              + Add First Qualification
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/[0.08] bg-[#0c101a]/80 backdrop-blur-xl p-6 md:p-8 hover:border-[var(--primary)]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/20 flex items-center justify-center text-[var(--primary)] shrink-0">
                      <GraduationCap size={22} />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-2 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        title="Edit Education"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.institution)}
                        disabled={deletingId === item.id}
                        className="p-2 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-40 cursor-pointer"
                        title="Delete Education"
                      >
                        {deletingId === item.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-snug mb-1">
                    {item.degree || "Degree"}
                    {item.field ? ` in ${item.field}` : ""}
                  </h3>
                  <p className="text-sm font-semibold text-[var(--primary)] mb-3">{item.institution}</p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                      <Calendar size={12} className="text-[var(--primary)]" />
                      {formatDate(item.start_date)} — {formatDate(item.end_date)}
                    </span>
                    {item.grade && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-bold">
                        CGPA: {item.grade}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed pt-3 border-t border-white/5">
                      {item.description}
                    </p>
                  )}
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
        title={editing ? "Edit Academic Qualification" : "Add Education Record"}
        subtitle="Specify institution, degree program, graduation dates, and academic grade achievements."
        onSubmit={handleSave}
        submitLabel={editing ? "Save Qualification" : "Add Qualification"}
        isSaving={saveStatus === "saving"}
        saveStatus={saveStatus}
        errorMsg={errorMsg}
        maxWidth="3xl"
      >
        <AdminField
          label="Institution / University Name"
          name="institution"
          value={form.institution}
          onChange={handleChange}
          placeholder="e.g. Anna University, PSG College of Technology"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminField
            label="Degree Program"
            name="degree"
            value={form.degree}
            onChange={handleChange}
            placeholder="e.g. B.Tech / B.E. / BSc"
          />
          <AdminField
            label="Field of Study / Major"
            name="field"
            value={form.field}
            onChange={handleChange}
            placeholder="e.g. Information Technology, Computer Science"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminDateField
            label="Start Date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
          />
          <AdminDateField
            label="End Date (or Expected)"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminField
            label="Grade / CGPA"
            name="grade"
            value={form.grade}
            onChange={handleChange}
            placeholder="e.g. 8.5 CGPA or 85%"
          />
          <AdminField
            label="Display Order"
            name="display_order"
            value={String(form.display_order)}
            onChange={handleChange}
            type="number"
            placeholder="0"
            helperText="Lower order displays higher"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs md:text-sm font-semibold text-slate-200 tracking-wide">
            Description & Honors
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Key subjects, final year projects, leadership activities, club roles..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all resize-none leading-relaxed"
          />
        </div>
      </AdminModal>
    </div>
  );
}
