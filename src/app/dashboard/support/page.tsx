"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LifeBuoy, Send, Loader2, CheckCircle2, Clock, AlertCircle, Tag,
  MessageSquare, Plus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Ticket = {
  id: string;
  subject: string;
  body: string;
  status: string;
  priority: string;
  category: string;
  created_at: string;
};

const CATEGORIES = [
  { id: "TECHNICAL", label: "🛠 Problème technique" },
  { id: "BILLING", label: "💳 Facturation" },
  { id: "ACCOUNT", label: "👤 Mon compte" },
  { id: "FEATURE_REQUEST", label: "💡 Suggestion" },
  { id: "OTHER", label: "❓ Autre" },
];

const PRIORITIES = [
  { id: "LOW", label: "Faible" },
  { id: "MEDIUM", label: "Moyenne" },
  { id: "HIGH", label: "Haute" },
  { id: "URGENT", label: "Urgente" },
];

const STATUS_META: Record<string, { color: string; label: string; icon: typeof CheckCircle2 }> = {
  OPEN:          { color: "#FF8A00", label: "Ouvert",      icon: AlertCircle },
  IN_PROGRESS:   { color: "#7B61FF", label: "En cours",    icon: Loader2 },
  WAITING_USER:  { color: "#FBBF24", label: "On attend",   icon: Clock },
  RESOLVED:      { color: "#10B981", label: "Résolu",      icon: CheckCircle2 },
  CLOSED:        { color: "#94A3B8", label: "Fermé",       icon: CheckCircle2 },
};

export default function UserSupportPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    subject: "",
    body: "",
    category: "TECHNICAL",
    priority: "MEDIUM",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from("support_tickets") as any)
        .select("id, subject, body, status, priority, category, created_at")
        .order("created_at", { ascending: false });
      setTickets((data ?? []) as Ticket[]);
      setLoading(false);
    })();
  }, []);

  async function submit() {
    if (!form.subject.trim() || !form.body.trim()) {
      toast.error("Sujet et message requis");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Échec");

      setTickets((prev) => [json.ticket, ...prev]);
      setForm({ subject: "", body: "", category: "TECHNICAL", priority: "MEDIUM" });
      setCreating(false);
      toast.success("Ticket envoyé ✓");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Support
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            On répond à toutes tes questions sous 24h max
          </p>
        </div>
        <Button onClick={() => setCreating(!creating)} variant="brand">
          <Plus className="mr-1 h-3.5 w-3.5" />
          {creating ? "Fermer" : "Nouveau ticket"}
        </Button>
      </div>

      {creating && (
        <Card>
          <CardContent className="p-5 md:p-6">
            <h2 className="flex items-center gap-2 font-display text-base font-bold">
              <Send className="h-4 w-4 text-[#7B61FF]" />
              Nouveau ticket
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Catégorie
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setForm({ ...form, category: c.id })}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                        form.category === c.id
                          ? "border-[#7B61FF]/50 bg-[#7B61FF]/15 text-foreground"
                          : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Priorité
                </label>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setForm({ ...form, priority: p.id })}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                        form.priority === p.id
                          ? "border-[#7B61FF]/50 bg-[#7B61FF]/15 text-foreground"
                          : "border-border bg-card/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Sujet
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="Résume ton problème en 1 phrase"
                  maxLength={120}
                  className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background/40 px-3 text-sm outline-none focus:border-foreground/30"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Décris ton problème
                </label>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  rows={5}
                  placeholder="Le plus de détails possibles : contexte, étapes pour reproduire, screenshots…"
                  maxLength={2000}
                  className="mt-1.5 w-full rounded-lg border border-border bg-background/40 px-3 py-2 text-sm outline-none focus:border-foreground/30"
                />
                <div className="mt-1 text-right text-[10px] text-muted-foreground">
                  {form.body.length}/2000
                </div>
              </div>

              <Button
                onClick={submit}
                disabled={submitting || !form.subject.trim() || !form.body.trim()}
                variant="brand"
              >
                {submitting ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> : <Send className="mr-1 h-3.5 w-3.5" />}
                Envoyer le ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold">
          <LifeBuoy className="h-4 w-4 text-[#7B61FF]" />
          Mes tickets
        </h2>

        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : tickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-12 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Aucun ticket pour l&apos;instant</p>
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-2">
            {tickets.map((t) => {
              const meta = STATUS_META[t.status] ?? STATUS_META.OPEN;
              const Icon = meta.icon;
              return (
                <li
                  key={t.id}
                  className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-bold">{t.subject}</span>
                        <span
                          className="inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                          style={{ color: meta.color, borderColor: `${meta.color}55`, backgroundColor: `${meta.color}1A` }}
                        >
                          <Icon className="h-2.5 w-2.5" />
                          {meta.label}
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded-full border border-border bg-background/60 px-1.5 py-0 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                          <Tag className="h-2.5 w-2.5" />
                          {t.category.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{t.body}</p>
                      <div className="mt-2 text-[10px] text-muted-foreground">
                        Créé {timeAgo(t.created_at)}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function timeAgo(iso: string) {
  const diff = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `le ${new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}`;
}
