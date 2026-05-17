import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckCircle2, AlertTriangle, ExternalLink, Search, Globe2, FileText } from "lucide-react";

export const metadata = {
  title: "SEO Audit · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://creafix-ai.vercel.app";

type Check = {
  id: string;
  label: string;
  description: string;
  status: "ok" | "warn" | "missing";
  hint?: string;
};

/** Audit en lecture seule de la conf SEO de l'app (côté serveur). */
async function runSeoChecks(): Promise<Check[]> {
  const checks: Check[] = [];

  // 1. Sitemap
  try {
    const r = await fetch(`${SITE_URL}/sitemap.xml`, { cache: "no-store" });
    checks.push({
      id: "sitemap",
      label: "Sitemap.xml",
      description: "Crawlable + valide",
      status: r.ok ? "ok" : "missing",
      hint: r.ok ? `${SITE_URL}/sitemap.xml` : "Vérifier app/sitemap.ts",
    });
  } catch {
    checks.push({ id: "sitemap", label: "Sitemap.xml", description: "Crawlable", status: "missing" });
  }

  // 2. Robots.txt
  try {
    const r = await fetch(`${SITE_URL}/robots.txt`, { cache: "no-store" });
    const text = r.ok ? await r.text() : "";
    const hasDisallow = text.includes("Disallow:");
    const hasSitemap = text.includes("Sitemap:");
    checks.push({
      id: "robots",
      label: "robots.txt",
      description: hasSitemap && hasDisallow ? "Disallow + Sitemap pointer présents" : "Manque Sitemap ou Disallow",
      status: r.ok && hasSitemap && hasDisallow ? "ok" : "warn",
    });
  } catch {
    checks.push({ id: "robots", label: "robots.txt", description: "Manquant", status: "missing" });
  }

  // 3. OG image dynamique
  try {
    const r = await fetch(`${SITE_URL}/og?title=Test`, { cache: "no-store" });
    checks.push({
      id: "og",
      label: "OG image dynamique",
      description: r.ok ? "Edge route /og opérationnelle (1200×630)" : "Erreur",
      status: r.ok ? "ok" : "missing",
    });
  } catch {
    checks.push({ id: "og", label: "OG image", description: "Edge function down", status: "missing" });
  }

  // 4. JSON-LD Organization (vérif côté HTML home)
  try {
    const r = await fetch(SITE_URL, { cache: "no-store" });
    const html = r.ok ? await r.text() : "";
    const hasOrg = html.includes('"@type":"Organization"');
    const hasWebsite = html.includes('"@type":"WebSite"');
    const hasSoftware = html.includes('"@type":"SoftwareApplication"');
    checks.push({
      id: "ld-org",
      label: "JSON-LD Organization",
      description: hasOrg ? "Présent dans le HTML" : "Absent",
      status: hasOrg ? "ok" : "missing",
    });
    checks.push({
      id: "ld-website",
      label: "JSON-LD WebSite",
      description: hasWebsite ? "Présent dans le HTML" : "Absent",
      status: hasWebsite ? "ok" : "missing",
    });
    checks.push({
      id: "ld-software",
      label: "JSON-LD SoftwareApplication",
      description: hasSoftware ? "Présent (offres + ratings)" : "Absent",
      status: hasSoftware ? "ok" : "missing",
    });

    // 5. Meta tags critiques sur la home
    const hasTitle = /<title>[^<]+<\/title>/.test(html);
    const hasDesc = /<meta\s+name="description"\s+content="[^"]+"/.test(html);
    const hasOG = /<meta\s+property="og:title"/.test(html);
    const hasTwitter = /<meta\s+name="twitter:card"/.test(html);
    const hasCanonical = /<link\s+rel="canonical"/.test(html);

    checks.push({ id: "title", label: "<title>", description: "Tag présent", status: hasTitle ? "ok" : "missing" });
    checks.push({ id: "desc", label: 'meta description', description: "Tag présent", status: hasDesc ? "ok" : "missing" });
    checks.push({ id: "og-tags", label: "Open Graph tags", description: "og:title, og:image, og:url", status: hasOG ? "ok" : "missing" });
    checks.push({ id: "tw-tags", label: "Twitter Card", description: "summary_large_image", status: hasTwitter ? "ok" : "missing" });
    checks.push({ id: "canonical", label: "Canonical URL", description: "<link rel='canonical'>", status: hasCanonical ? "ok" : "warn" });
  } catch {
    checks.push({ id: "html", label: "HTML home", description: "Échec fetch", status: "missing" });
  }

  return checks;
}

export default async function AdminSeoPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login/admin");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: isAdmin } = await (supabase.rpc as any)("is_admin", { p_user_id: user.id });
  if (!isAdmin) redirect("/dashboard");

  const checks = await runSeoChecks();
  const ok = checks.filter((c) => c.status === "ok").length;
  const warn = checks.filter((c) => c.status === "warn").length;
  const missing = checks.filter((c) => c.status === "missing").length;
  const score = Math.round((ok / checks.length) * 100);

  return (
    <div className="space-y-6">
      <header>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            SEO Audit
          </h1>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
              score >= 90
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                : score >= 70
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-300 border border-rose-500/30"
            }`}
          >
            Score : {score}/100
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Audit en temps réel des fondations SEO du site (sitemap, robots, JSON-LD, OG, meta tags).
          Rafraîchis pour ré-auditer.
        </p>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard label="OK" value={ok} color="emerald" icon={CheckCircle2} />
        <SummaryCard label="Warnings" value={warn} color="amber" icon={AlertTriangle} />
        <SummaryCard label="Manquants" value={missing} color="rose" icon={AlertTriangle} />
      </div>

      {/* Checks list */}
      <div className="rounded-2xl border border-border bg-card/40">
        <div className="divide-y divide-border">
          {checks.map((c) => (
            <CheckRow key={c.id} check={c} />
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="rounded-2xl border border-border bg-card/40 p-5">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Outils externes
        </h2>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <ExternalToolLink
            label="Google Search Console"
            href="https://search.google.com/search-console"
            icon={Search}
          />
          <ExternalToolLink
            label="Rich Results Test"
            href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(SITE_URL)}`}
            icon={FileText}
          />
          <ExternalToolLink
            label="PageSpeed Insights"
            href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL)}`}
            icon={Globe2}
          />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label, value, color, icon: Icon,
}: {
  label: string;
  value: number;
  color: "emerald" | "amber" | "rose";
  icon: React.ComponentType<{ className?: string }>;
}) {
  const palette = {
    emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-300",
    amber:   "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-300",
    rose:    "border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-300",
  }[color];
  return (
    <div className={`rounded-2xl border ${palette} p-4`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
        <Icon className="h-4 w-4" />
      </div>
      <div className="mt-2 font-display text-3xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function CheckRow({ check }: { check: Check }) {
  const config = {
    ok:      { Icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/5" },
    warn:    { Icon: AlertTriangle, color: "text-amber-500",  bg: "bg-amber-500/5" },
    missing: { Icon: AlertTriangle, color: "text-rose-500",   bg: "bg-rose-500/5" },
  }[check.status];
  return (
    <div className={`flex items-start gap-3 p-4 ${config.bg}`}>
      <config.Icon className={`mt-0.5 h-4 w-4 shrink-0 ${config.color}`} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-bold">{check.label}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
            {check.status === "ok" ? "OK" : check.status === "warn" ? "Warn" : "Manquant"}
          </span>
        </div>
        <div className="mt-0.5 text-[12px] text-muted-foreground">{check.description}</div>
        {check.hint && (
          <div className="mt-1 text-[10.5px] font-mono text-muted-foreground/80">{check.hint}</div>
        )}
      </div>
    </div>
  );
}

function ExternalToolLink({
  label, href, icon: Icon,
}: {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-xl border border-border bg-background/40 px-3 py-2.5 text-[12.5px] font-semibold transition-colors hover:bg-background/70"
    >
      <span className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        {label}
      </span>
      <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
    </a>
  );
}
