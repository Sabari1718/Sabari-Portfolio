"use client";

import { useEffect, useState } from "react";
import { PortfolioAPI } from "@/services/api";
import { Education } from "@/types";
import {
  Plus, Edit2, Trash2, Loader2, CheckCircle, AlertCircle,
  X, GraduationCap, Calendar
} from "lucide-react";

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.institution?.trim()) {
      setSaveStatus("error"); setErrorMsg("Institution name is required."); return;
    }
    setSaveStatus("saving");
    setErrorMsg("");

    const payload = {
      ...form,
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-1">Education</h1>
          <p className="text-[var(--text-secondary)]">
            {items.length} record{items.length !== 1 ? "s" : ""} · Saved to MySQL
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-6 py-3 bg-[#FDE047] text-black font-bold rounded-xl hover:bg-[#FDE047]/90 hover:shadow-[0_0_20px_rgba(253,224,71,0.4)] transition-all">
          <Plus size={18} /> Add Education
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-[var(--text-secondary)] bg-white/[0.03] border border-white/10 rounded-2xl">
            <GraduationCap size={48} className="opacity-30" />
            <p className="text-lg">No education records yet.</p>
            <button onClick={openAdd} className="text-[#FDE047] hover:underline text-sm">Add your first record →</button>
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-4 hover:border-white/20 transition-colors group">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{item.institution}</h3>
                {(item.degree || item.field) && (
                  <p className="text-[#FDE047] font-medium mt-0.5">
                    {[item.degree, item.field].filter(Boolean).join(" · ")}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-white/50 mt-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {formatDate(item.start_date)} — {formatDate(item.end_date)}
                  </span>
                  {item.grade && <span>Grade: {item.grade}</span>}
                </div>
                {item.description && (
                  <p className="text-sm text-white/60 mt-3 line-clamp-2">{item.description}</p>
                )}
              </div>
              <div className="flex md:flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(item)}
                  className="p-2.5 text-white/40 hover:text-[#FDE047] hover:bg-[#FDE047]/10 rounded-xl transition-all" title="Edit">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(item.id, item.institution)}
                  disabled={deletingId === item.id}
                  className="p-2.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50" title="Delete">
                  {deletingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">{editing ? "Edit Education" : "Add Education"}</h2>
              <button onClick={closeModal} className="text-white/40 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <EField label="Institution *" name="institution" value={form.institution} onChange={handleChange} placeholder="Anna University" required />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <EField label="Degree" name="degree" value={form.degree} onChange={handleChange} placeholder="B.E. / B.Tech / BSc" />
                <EField label="Field of Study" name="field" value={form.field} onChange={handleChange} placeholder="Computer Science" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <EField label="Start Date" name="start_date" value={form.start_date} onChange={handleChange} type="date" />
                <EField label="End Date" name="end_date" value={form.end_date} onChange={handleChange} type="date" />
                <EField label="Grade / CGPA" name="grade" value={form.grade} onChange={handleChange} placeholder="8.5 CGPA / 85%" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                  placeholder="Activities, achievements, notable courses..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)] transition-all resize-none" />
              </div>

              <EField label="Display Order" name="display_order" value={String(form.display_order)} onChange={handleChange} type="number" placeholder="0" />

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
                  {saveStatus === "saving" ? "Saving..." : editing ? "Save Changes" : "Add Education"}
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

function EField({ label, name, value, onChange, placeholder, type = "text", required }: {
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
