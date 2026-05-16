"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  MessageSquare, Plus, Trash2, Save, Loader2, X, Upload, Eye, EyeOff,
  Star, GripVertical, AlertTriangle,
} from "lucide-react";

export type TestimonialRow = {
  id: string;
  name: string;
  role: string;
  country: string;
  avatar_url: string | null;
  quote: string;
  rating: number;
  platforms: string[];
  metric: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

const PLATFORM_OPTIONS = ["TIKTOK", "INSTAGRAM", "YOUTUBE", "FACEBOOK", "X", "SNAPCHAT", "TWITCH", "PINTEREST", "LINKEDIN"];

type Draft = Omit<TestimonialRow, "id" | "created_at" | "updated_at"> & { id?: string };

const EMPTY_DRAFT: Draft = {
  name: "",
  role: "",
  country: "🇸🇳 Dakar",
  avatar_url: null,
  quote: "",
  rating: 5,
  platforms: ["TIKTOK"],
  metric: "",
  sort_order: 100,
  active: true,
};

export function TestimonialsClient({ initial }: { initial: TestimonialRow[] }) {
  const [rows, setRows] = useState<TestimonialRow[]>(initial);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [pending, startTransition] = useTransition();

  function startNew() {
    setDraft({ ...EMPTY_DRAFT, sort_order: (rows.at(-1)?.sort_order ?? 0) + 10 });
    setEditing("new");
  }

  function startEdit(r: TestimonialRow) {
    setDraft({ ...r });
    setEditing(r.id);
  }

  function cancel() {
    setEditing(null);
    setDraft(EMPTY_DRAFT);
  }

  async function save() {
    if (!draft.name || !draft.role || !draft.country || !draft.quote || !draft.metric) {
      toast.error("Tous les champs requis doivent être remplis");
      return;
    }
    startTransition(async () => {
      try {
        const isNew = editing === "new";
        const url = isNew
          ? "/api/admin/testimonials"
          : `/api/admin/testimonials/${draft.id}`;
        const method = isNew ? "POST" : "PATCH";
        const res = await fetch(url, {
          method,
          headers: { "content-type": "application/json" },
          body: JSON.stringify(draft),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error ?? `HTTP ${res.status}`);
        }

        if (isNew) {
          const { id } = await res.json();
          setRows([...rows, { ...(draft as TestimonialRow), id, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }].sort((a, b) => a.sort_order - b.sort_order));
        } else {
          setRows(rows.map((r) => (r.id === draft.id ? { ...r, ...draft } : r)).sort((a, b) => a.sort_order - b.sort_order));
        }
        toast.success(isNew ? "Témoignage créé ✓" : "Témoignage mis à jour ✓");
        cancel();
      } catch (e: unknown) {
        toast.error((e as Error)?.message ?? "Échec");
      }
    });
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Supprimer le témoignage de "${name}" ?\n\nCette action est irréversible.`)) return;
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error ?? `HTTP ${res.status}`);
        }
        setRows(rows.filter((r) => r.id !== id));
        toast.success("Témoignage supprimé");
      } catch (e: unknown) {
        toast.error((e as Error)?.message ?? "Échec");
      }
    });
  }

  async function toggleActive(r: TestimonialRow) {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/testimonials/${r.id}`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ active: !r.active }),
        });
        if (!res.ok) throw new Error("Échec");
        setRows(rows.map((x) => (x.id === r.id ? { ...x, active: !r.active } : x)));
        toast.success(r.active ? "Désactivé" : "Activé");
      } catch (e: unknown) {
        toast.error((e as Error)?.message ?? "Échec");
      }
    });
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Témoignages landing
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-300">
              Live editable
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {rows.length} témoignage{rows.length > 1 ? "s" : ""} ·{" "}
            <b className="text-foreground">{rows.filter((r) => r.active).length}</b> actifs sur la landing.
            <a href="/" target="_blank" className="ml-2 text-[#f15522] hover:underline">
              Voir la landing →
            </a>
          </p>
        </div>
        <button
          onClick={startNew}
          disabled={editing !== null || pending}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f92c2c] to-[#f15b25] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#f15522]/30 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Nouveau témoignage
        </button>
      </header>

      {/* Form (new or edit) */}
      {editing && (
        <TestimonialForm
          draft={draft}
          setDraft={setDraft}
          onSave={save}
          onCancel={cancel}
          pending={pending}
          isNew={editing === "new"}
        />
      )}

      {/* List */}
      <div className="grid gap-3">
        {rows.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card/40 p-12 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Aucun témoignage pour l'instant.</p>
            <button onClick={startNew} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#f15522] px-4 py-2 text-sm font-semibold text-white">
              <Plus className="h-4 w-4" /> Ajouter le premier
            </button>
          </div>
        )}

        {rows.map((r) => (
          <article
            key={r.id}
            className={`flex items-start gap-4 rounded-2xl border border-border bg-card/40 p-4 transition-all ${
              r.active ? "" : "opacity-50"
            }`}
          >
            <GripVertical className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />

            {/* Avatar */}
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
              {r.avatar_url ? (
                <Image
                  src={r.avatar_url}
                  alt={r.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="grid h-full place-items-center font-display text-lg font-bold text-muted-foreground">
                  {r.name[0]}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold">{r.name}</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[12px] text-muted-foreground">{r.role}</span>
                    <span className="text-[10px] text-muted-foreground">·</span>
                    <span className="text-[12px]">{r.country}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-2 text-[10px] text-muted-foreground">sort #{r.sort_order}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleActive(r)}
                    disabled={pending}
                    title={r.active ? "Désactiver" : "Réactiver"}
                    className="rounded-lg border border-border bg-background/40 p-2 text-muted-foreground hover:bg-background/70 hover:text-foreground disabled:opacity-50"
                  >
                    {r.active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => startEdit(r)}
                    disabled={pending || editing !== null}
                    className="rounded-lg border border-border bg-background/40 px-3 py-1.5 text-[11px] font-semibold text-foreground hover:bg-background/70 disabled:opacity-50"
                  >
                    Éditer
                  </button>
                  <button
                    onClick={() => remove(r.id, r.name)}
                    disabled={pending}
                    className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-500 hover:bg-rose-500/20 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="mt-2 text-[12.5px] italic leading-relaxed text-foreground/80">
                “{r.quote}”
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
                  ↗ {r.metric}
                </span>
                {r.platforms.map((p) => (
                  <span key={p} className="rounded-md border border-border bg-background/40 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Sub-component : Form
 * ────────────────────────────────────────────────────────────────── */

function TestimonialForm({
  draft, setDraft, onSave, onCancel, pending, isNew,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
  onSave: () => void;
  onCancel: () => void;
  pending: boolean;
  isNew: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/testimonials/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      const { url } = await res.json();
      setDraft({ ...draft, avatar_url: url });
      toast.success("Photo uploadée ✓");
    } catch (e: unknown) {
      toast.error((e as Error)?.message ?? "Échec upload");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function togglePlatform(p: string) {
    if (draft.platforms.includes(p)) {
      setDraft({ ...draft, platforms: draft.platforms.filter((x) => x !== p) });
    } else {
      setDraft({ ...draft, platforms: [...draft.platforms, p] });
    }
  }

  return (
    <div className="rounded-2xl border border-[#f15522]/40 bg-gradient-to-br from-[#f15522]/[0.04] to-card p-5 shadow-lg shadow-[#f15522]/10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">
          {isNew ? "Nouveau témoignage" : `Éditer : ${draft.name || "..."}`}
        </h2>
        <button onClick={onCancel} disabled={pending} className="rounded-lg p-1.5 text-muted-foreground hover:bg-background/40 hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[120px_1fr]">
        {/* Avatar uploader */}
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Photo</label>
          <div className="relative h-28 w-28 overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/40">
            {draft.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={draft.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-xs text-muted-foreground">
                {draft.name ? draft.name[0] : "?"}
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={pending || uploading}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background/40 px-2 py-1.5 text-[11px] font-semibold hover:bg-background/70 disabled:opacity-50"
          >
            <Upload className="h-3 w-3" /> Upload
          </button>
          <div className="text-[10px] text-muted-foreground">JPG/PNG/WebP · max 2 MB</div>
          {draft.avatar_url && (
            <button
              type="button"
              onClick={() => setDraft({ ...draft, avatar_url: null })}
              className="text-[10px] text-rose-500 hover:underline"
            >
              Retirer
            </button>
          )}
        </div>

        {/* Right column : fields */}
        <div className="grid gap-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Nom" required>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Aïssata Diop"
                className="input"
              />
            </Field>
            <Field label="Rôle / niche" required>
              <input
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                placeholder="TikTokeuse cuisine"
                className="input"
              />
            </Field>
            <Field label="Pays + ville" required hint="ex: 🇸🇳 Dakar">
              <input
                value={draft.country}
                onChange={(e) => setDraft({ ...draft, country: e.target.value })}
                placeholder="🇸🇳 Dakar"
                className="input"
              />
            </Field>
            <Field label="Metric mise en avant" required hint="ex: RPM ×3 en 14 j">
              <input
                value={draft.metric}
                onChange={(e) => setDraft({ ...draft, metric: e.target.value })}
                placeholder="RPM ×3 en 14 j"
                className="input"
              />
            </Field>
          </div>

          <Field label="Témoignage (quote)" required>
            <textarea
              value={draft.quote}
              onChange={(e) => setDraft({ ...draft, quote: e.target.value })}
              rows={3}
              placeholder="En 2 semaines, mon RPM a triplé…"
              className="input resize-y"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Field label="Note (1-5)">
              <select
                value={draft.rating}
                onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
                className="input"
              >
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} étoile{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </Field>
            <Field label="Ordre d'affichage" hint="bas = en premier">
              <input
                type="number"
                value={draft.sort_order}
                onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
                className="input"
              />
            </Field>
            <Field label="Status">
              <label className="flex h-9 items-center gap-2 rounded-lg border border-border bg-background/40 px-3 text-sm">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                />
                {draft.active ? "Actif" : "Inactif"}
              </label>
            </Field>
          </div>

          <Field label="Plateformes (badges affichés)" hint="sélectionne celles utilisées par ce créateur">
            <div className="flex flex-wrap gap-1.5">
              {PLATFORM_OPTIONS.map((p) => {
                const active = draft.platforms.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`rounded-md border px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider transition-colors ${
                      active
                        ? "border-[#f15522] bg-[#f15522]/10 text-[#f15522]"
                        : "border-border bg-background/40 text-muted-foreground hover:bg-background/70"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </Field>

          {draft.platforms.length === 0 && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-3.5 w-3.5" />
              Aucune plateforme sélectionnée — les badges ne s'afficheront pas sur la landing.
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={onSave}
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f92c2c] to-[#f15b25] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#f15522]/30 disabled:opacity-50"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isNew ? "Créer" : "Sauvegarder"}
            </button>
            <button
              onClick={onCancel}
              disabled={pending}
              className="rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm font-semibold hover:bg-background/70 disabled:opacity-50"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.input) {
          height: 2.25rem;
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--border));
          background-color: hsl(var(--background) / 0.4);
          padding: 0 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        :global(.input:focus) {
          border-color: #f15522;
          box-shadow: 0 0 0 3px rgba(241, 85, 34, 0.15);
        }
        :global(textarea.input) {
          height: auto;
          min-height: 4.5rem;
          padding: 0.5rem 0.75rem;
        }
      `}</style>
    </div>
  );
}

function Field({
  label, hint, required, children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="text-rose-500">*</span>}
        {hint && <span className="ml-1 normal-case opacity-70">· {hint}</span>}
      </label>
      {children}
    </div>
  );
}
