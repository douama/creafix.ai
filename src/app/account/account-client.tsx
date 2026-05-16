"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Save, Loader2, Upload, User, Mail, Phone, MapPin, Globe2,
  Shield, CreditCard, KeyRound, Eye, EyeOff,
} from "lucide-react";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  country: string | null;
  preferred_lang: string | null;
  avatar_url: string | null;
  role: string;
  plan: string;
  credits: number;
  created_at: string;
};

export function AccountClient({ initial }: { initial: Profile }) {
  const [profile, setProfile] = useState(initial);
  const [savingProfile, startSavingProfile] = useTransition();
  const [savingPwd, startSavingPwd] = useTransition();

  function updateField<K extends keyof Profile>(k: K, v: Profile[K]) {
    setProfile((p) => ({ ...p, [k]: v }));
  }

  function saveProfile() {
    startSavingProfile(async () => {
      try {
        const res = await fetch("/api/account/profile", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            full_name: profile.full_name,
            phone: profile.phone,
            country: profile.country,
            preferred_lang: profile.preferred_lang,
          }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error ?? `HTTP ${res.status}`);
        toast.success("Profil mis à jour ✓");
      } catch (e: unknown) {
        toast.error((e as Error)?.message ?? "Échec");
      }
    });
  }

  return (
    <div className="mt-8 space-y-6">
      <AvatarSection
        avatarUrl={profile.avatar_url}
        fullName={profile.full_name}
        email={profile.email}
        onChange={(url) => updateField("avatar_url", url)}
      />

      <Card title="Identité" icon={User}>
        <Field label="Nom complet" icon={User}>
          <input
            type="text"
            value={profile.full_name ?? ""}
            onChange={(e) => updateField("full_name", e.target.value)}
            placeholder="Marie Diallo"
            className="input"
          />
        </Field>

        <Field label="Email" icon={Mail} hint="Lecture seule — utilise « Changer email » pour modifier">
          <input
            type="email"
            value={profile.email}
            disabled
            className="input bg-muted/30 text-muted-foreground"
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Téléphone" icon={Phone}>
            <input
              type="tel"
              value={profile.phone ?? ""}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+221 77 123 45 67"
              className="input"
            />
          </Field>

          <Field label="Pays" icon={MapPin}>
            <input
              type="text"
              value={profile.country ?? ""}
              onChange={(e) => updateField("country", e.target.value)}
              placeholder="Sénégal"
              className="input"
            />
          </Field>
        </div>

        <Field label="Langue préférée" icon={Globe2}>
          <select
            value={profile.preferred_lang ?? "fr"}
            onChange={(e) => updateField("preferred_lang", e.target.value)}
            className="input"
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="pt">Português</option>
          </select>
        </Field>

        <button
          type="button"
          onClick={saveProfile}
          disabled={savingProfile}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#EC4899] to-[#FF8A00] px-5 text-sm font-bold text-white shadow-lg shadow-pink-500/30 disabled:opacity-50"
        >
          {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Sauvegarder le profil
        </button>
      </Card>

      <Card title="Compte" icon={Shield}>
        <div className="grid gap-3 sm:grid-cols-2">
          <ReadOnly label="Rôle" value={profile.role} icon={Shield} />
          <ReadOnly label="Plan" value={profile.plan} icon={CreditCard} />
          <ReadOnly label="Crédits restants" value={String(profile.credits)} icon={CreditCard} />
          <ReadOnly
            label="Inscrit le"
            value={new Date(profile.created_at).toLocaleDateString("fr-FR", {
              day: "numeric", month: "long", year: "numeric",
            })}
            icon={User}
          />
        </div>
      </Card>

      <PasswordSection saving={savingPwd} startSaving={startSavingPwd} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Avatar uploader
 * ────────────────────────────────────────────────────────────────── */
function AvatarSection({
  avatarUrl, fullName, email, onChange,
}: {
  avatarUrl: string | null;
  fullName: string | null;
  email: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const initial = (fullName ?? email)[0]?.toUpperCase() ?? "?";

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/account/avatar", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      const { url } = await res.json();
      onChange(url);
      toast.success("Avatar mis à jour ✓");
    } catch (e: unknown) {
      toast.error((e as Error)?.message ?? "Échec upload");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-5 rounded-2xl border border-border bg-card/40 p-5">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-border bg-gradient-to-br from-[#EC4899] to-[#FF8A00]">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Avatar"
            fill
            sizes="80px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="grid h-full place-items-center font-display text-2xl font-bold text-white">
            {initial}
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-display text-base font-bold">{fullName || "Sans nom"}</div>
        <div className="text-[12px] text-muted-foreground">{email}</div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-[11px] font-semibold hover:bg-background/70 disabled:opacity-50"
        >
          <Upload className="h-3 w-3" /> Changer la photo
        </button>
        <span className="ml-2 text-[10px] text-muted-foreground">JPG/PNG/WebP · max 2 MB</span>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Password change
 * ────────────────────────────────────────────────────────────────── */
function PasswordSection({
  saving, startSaving,
}: {
  saving: boolean;
  startSaving: (cb: () => Promise<void>) => void;
}) {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  function save() {
    if (pwd.length < 8) {
      toast.error("Mot de passe min. 8 caractères");
      return;
    }
    if (pwd !== confirm) {
      toast.error("Les deux mots de passe ne correspondent pas");
      return;
    }
    startSaving(async () => {
      try {
        const res = await fetch("/api/account/password", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ new_password: pwd }),
        });
        const j = await res.json();
        if (!res.ok) throw new Error(j.error ?? `HTTP ${res.status}`);
        toast.success("Mot de passe changé ✓");
        setPwd("");
        setConfirm("");
      } catch (e: unknown) {
        toast.error((e as Error)?.message ?? "Échec");
      }
    });
  }

  return (
    <Card title="Sécurité — Changer le mot de passe" icon={KeyRound}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nouveau mot de passe">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Min. 8 caractères"
              className="input pr-9"
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </Field>

        <Field label="Confirmer">
          <input
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-tape le nouveau mot de passe"
            className="input"
          />
        </Field>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving || !pwd || !confirm}
        className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-[#1FBEAF] to-[#EC4899] px-5 text-sm font-bold text-white shadow-lg shadow-teal-500/30 disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
        Changer le mot de passe
      </button>
    </Card>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * Atoms
 * ────────────────────────────────────────────────────────────────── */
function Card({
  title, icon: Icon, children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5 backdrop-blur md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h2 className="font-display text-base font-bold">{title}</h2>
      </div>
      <div className="space-y-3">{children}</div>
      <style jsx>{`
        :global(.input) {
          height: 2.75rem;
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background-color: hsl(var(--background) / 0.4);
          padding: 0 0.875rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        :global(.input:focus) {
          border-color: #EC4899;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.15);
        }
        :global(.input:disabled) {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

function Field({
  label, hint, icon: Icon, children,
}: {
  label: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
        {hint && <span className="normal-case opacity-70">· {hint}</span>}
      </label>
      {children}
    </div>
  );
}

function ReadOnly({
  label, value, icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-2.5 w-2.5" /> {label}
      </div>
      <div className="mt-1 font-mono text-[13px] font-medium">{value}</div>
    </div>
  );
}
