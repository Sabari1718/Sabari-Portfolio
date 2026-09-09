"use client";

import React, { useRef } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Loader2, CheckCircle, AlertCircle } from "lucide-react";

/* ── Admin Page Header ─────────────────────────────────────────── */
interface AdminPageHeaderProps {
  badge?: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function AdminPageHeader({
  badge,
  title,
  titleAccent,
  subtitle,
  action,
  icon,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
      <div className="space-y-2">
        {badge && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-[var(--primary)] text-xs font-mono font-semibold tracking-wider uppercase">
            {icon}
            <span>{badge}</span>
          </div>
        )}
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          {title}{" "}
          {titleAccent && (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[#F5C542]">
              {titleAccent}
            </span>
          )}
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/* ── Admin Card Container ───────────────────────────────────────── */
export function AdminCard({
  children,
  className = "",
  title,
  subtitle,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-[#0c101a]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.36)] transition-all duration-300 ${className}`}
    >
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 md:p-8 border-b border-white/[0.08]">
          <div>
            {title && <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs md:text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6 md:p-8">{children}</div>
    </div>
  );
}

/* ── Admin Modal ────────────────────────────────────────────────── */
interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  isSaving?: boolean;
  maxWidth?: "2xl" | "3xl" | "4xl";
  saveStatus?: "idle" | "saving" | "success" | "error";
  errorMsg?: string;
}

export function AdminModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  submitLabel = "Save Changes",
  isSaving = false,
  maxWidth = "3xl",
  saveStatus = "idle",
  errorMsg,
}: AdminModalProps) {
  if (!open || typeof window === "undefined") return null;

  const maxWMap = {
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className={`relative w-full ${maxWMap[maxWidth]} bg-[#0c101a] border border-[var(--primary)]/30 rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.8),0_0_40px_rgba(0,229,255,0.12)] flex flex-col my-auto max-h-[92vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.08] bg-white/[0.02]">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs md:text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all border border-white/10 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Wrap */}
        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {children}

            {/* Status alerts */}
            {saveStatus === "error" && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/25 rounded-2xl text-red-400 text-sm">
                <AlertCircle size={18} className="shrink-0" />
                <span>{errorMsg || "Failed to save. Please check your inputs."}</span>
              </div>
            )}
            {saveStatus === "success" && (
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400 text-sm">
                <CheckCircle size={18} className="shrink-0" />
                <span>Successfully saved to database!</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 px-8 py-5 border-t border-white/[0.08] bg-white/[0.02] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-sm transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[#00B8D4] text-black font-bold text-sm shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_28px_rgba(0,229,255,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
              <span>{isSaving ? "Saving..." : submitLabel}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

/* ── Admin Form Field ───────────────────────────────────────────── */
interface AdminFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: any) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
}

export function AdminField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  helperText,
  disabled,
}: AdminFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-xs md:text-sm font-semibold text-slate-200 tracking-wide">
          {label} {required && <span className="text-[var(--primary)]">*</span>}
        </label>
        {helperText && <span className="text-[11px] text-slate-400">{helperText}</span>}
      </div>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all disabled:opacity-40"
      />
    </div>
  );
}

/* ── Admin Date Field with Click-to-Open Calendar ───────────────── */
interface AdminDateFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
}

export function AdminDateField({
  label,
  name,
  value,
  onChange,
  required,
  disabled,
  helperText,
}: AdminDateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openCalendar = () => {
    if (disabled) return;
    try {
      inputRef.current?.showPicker?.();
    } catch {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-xs md:text-sm font-semibold text-slate-200 tracking-wide">
          {label} {required && <span className="text-[var(--primary)]">*</span>}
        </label>
        {helperText ? (
          <span className="text-[11px] text-slate-400">{helperText}</span>
        ) : !disabled ? (
          <span
            onClick={openCalendar}
            className="text-[11px] text-[#F5C542] hover:underline cursor-pointer flex items-center gap-1 font-medium select-none"
          >
            📅 Open Calendar
          </span>
        ) : null}
      </div>

      <div
        onClick={openCalendar}
        className={`relative flex items-center w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:border-[var(--primary)]/50 hover:bg-white/[0.07] transition-all group ${
          disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""
        }`}
      >
        <input
          ref={inputRef}
          type="date"
          name={name}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            try {
              (e.currentTarget as any).showPicker?.();
            } catch {}
          }}
          className="w-full bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer [color-scheme:dark]"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            openCalendar();
          }}
          className="p-1 text-slate-400 group-hover:text-[#F5C542] hover:bg-white/10 rounded-lg transition-all ml-2 shrink-0 cursor-pointer"
          title="Open Calendar"
        >
          <Calendar size={18} />
        </button>
      </div>
    </div>
  );
}
