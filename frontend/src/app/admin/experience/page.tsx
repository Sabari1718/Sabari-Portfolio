"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { PortfolioAPI } from "@/services/api";
import { Experience } from "@/types";
import {
  Plus, Edit2, Trash2, Loader2, CheckCircle, AlertCircle,
  X, Briefcase, MapPin, Calendar
} from "lucide-react";
import { AdminPageHeader, AdminModal, AdminField, AdminDateField } from "@/components/admin/admin-ui";

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
      ...(name === "currently_working" && checked ? { end_date: "" } : {}),
    }));
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
    if (!form.company?.trim()) {
      setSaveStatus("error"); setErrorMsg("Company name is required."); return;
    }
    if (!form.role?.trim()) {
      setSaveStatus("error"); setErrorMsg("Role is required."); return;
    }
    
    const validStartDate = cleanDate(form.start_date);
    if (!validStartDate) {
      setSaveStatus("error");
      setErrorMsg("Please select a valid Start Date from the calendar.");
      return;
    }

    const isCurrently = form.currently_working ? true : false;
    const validEndDate = isCurrently ? null : cleanDate(form.end_date);

    setSaveStatus("saving");
    setErrorMsg("");

    const payload = {
      ...form,
      start_date: validStartDate,
      end_date: validEndDate,
      currently_working: isCurrently,
      display_order: Number(form.display_order) || 0,
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
    <div className="space-y-10 animate-fade-in">
      <AdminPageHeader
        badge="Career Milestones"
        title="Work"
        titleAccent="Experience"
        subtitle={`Track and manage professional positions, production achievements, and technologies. (${items.length} recorded)`}
        icon={<Briefcase size={13} />}
        action={
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[#00B8D4] text-black font-bold text-sm shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] transition-all cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Experience</span>
          </button>
        }
      />

      {/* List */}
      <div className="space-y-5">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-[var(--primary)]" size={36} />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400 bg-white/[0.02] border border-white/[0.08] rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500">
              <Briefcase size={28} />
            </div>
            <p className="text-base font-semibold text-white">No experience entries found</p>
            <p className="text-sm text-slate-400 max-w-sm text-center">Add your professional work history so clients and recruiters can review your achievements.</p>
            <button
              onClick={openAdd}
              className="mt-2 text-[var(--primary)] hover:underline text-sm font-bold cursor-pointer"
            >
              + Create First Position
            </button>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/[0.08] bg-[#0c101a]/80 backdrop-blur-xl p-6 md:p-8 hover:border-[var(--primary)]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-all duration-200 group flex flex-col md:flex-row items-start justify-between gap-6"
            >
              <div className="flex items-start gap-5 flex-1 min-w-0">
                {/* Logo Avatar */}
                <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/25 flex items-center justify-center text-[var(--primary)] shrink-0 overflow-hidden mt-1">
                  {item.logo_url ? (
                    <img src={item.logo_url} alt={item.company} className="w-full h-full object-cover" />
                  ) : (
                    <Briefcase size={20} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <h3 className="text-xl font-bold text-white tracking-tight">{item.role}</h3>
                    {Boolean(item.currently_working) ? (
                      <span className="px-3 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 rounded-full text-xs font-bold tracking-wide">
                        ● Current Role
                      </span>
                    ) : null}
                  </div>

                  <p className="text-base font-semibold text-[var(--primary)] mb-3">{item.company}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-400 mb-4 font-mono">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} className="text-[var(--primary)]" />
                      {formatDate(item.start_date)} — {item.currently_working ? "Present" : formatDate(item.end_date)}
                    </span>
                    {item.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#F5C542]" />
                        {item.location}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-sm text-slate-300 leading-relaxed max-w-4xl mb-4 whitespace-pre-line">
                      {item.description}
                    </p>
                  )}

                  {item.technologies && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                      {item.technologies.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-start shrink-0 pt-2 md:pt-0">
                <button
                  onClick={() => openEdit(item)}
                  className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                  title="Edit Experience"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.company)}
                  disabled={deletingId === item.id}
                  className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all disabled:opacity-40 cursor-pointer"
                  title="Delete Experience"
                >
                  {deletingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Spacious Modal */}
      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? "Edit Position" : "Add Experience Milestone"}
        subtitle="Fill in company, role, dates and achievements. Dates support instant click-to-calendar selection."
        onSubmit={handleSave}
        submitLabel={editing ? "Save Position" : "Add Position"}
        isSaving={saveStatus === "saving"}
        saveStatus={saveStatus}
        errorMsg={errorMsg}
        maxWidth="3xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminField
            label="Company Name"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="e.g. Google, Rabbit QR, Freelance"
            required
          />
          <AdminField
            label="Role / Title"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="e.g. Flutter Developer, Tech Lead"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Coimbatore, Tamil Nadu, Remote"
          />
          <AdminField
            label="Company Logo URL"
            name="logo_url"
            value={form.logo_url}
            onChange={handleChange}
            placeholder="https://... logo.png"
            type="url"
          />
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AdminDateField
              label="Start Date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
            />
            <AdminDateField
              label="End Date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              disabled={form.currently_working}
              helperText={form.currently_working ? "Disabled (currently working here)" : undefined}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer pt-2 select-none">
            <input
              type="checkbox"
              name="currently_working"
              checked={form.currently_working}
              onChange={handleChange}
              className="w-4 h-4 accent-[var(--primary)] cursor-pointer"
            />
            <span className="text-sm font-medium text-slate-200">I am currently working in this role</span>
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-xs md:text-sm font-semibold text-slate-200 tracking-wide">
            Responsibilities & Impact
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Highlight key responsibilities, features shipped, API integrations, and outcomes..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all resize-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <AdminField
              label="Technologies"
              name="technologies"
              value={form.technologies}
              onChange={handleChange}
              placeholder="e.g. Flutter, Dart, REST API, Postman"
              helperText="Comma-separated skills"
            />
          </div>
          <div>
            <AdminField
              label="Display Order"
              name="display_order"
              value={String(form.display_order)}
              onChange={handleChange}
              type="number"
              placeholder="0"
              helperText="Lower numbers show first"
            />
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
