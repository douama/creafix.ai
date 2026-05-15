import Link from "next/link";
import { PageShell, PageHero } from "@/components/marketing/page-shell";
import { ScrollText } from "lucide-react";

export function LegalShell({
  title,
  updatedAt,
  slug,
  children,
}: {
  title: string;
  updatedAt: string;
  slug: "terms" | "privacy" | "cookies" | "legal";
  children: React.ReactNode;
}) {
  const labels: Record<typeof slug, string> = {
    terms: "CGU",
    privacy: "Confidentialité",
    cookies: "Cookies",
    legal: "Mentions légales",
  };

  return (
    <PageShell
      breadcrumb={[
        { label: "Accueil", href: "/" },
        { label: "Légal", href: `/legal/${slug}` },
        { label: labels[slug], href: `/legal/${slug}` },
      ]}
      hero={
        <PageHero
          eyebrow={
            <>
              <ScrollText className="h-3 w-3" /> Mise à jour : {updatedAt}
            </>
          }
          title={title}
          subtitle="Pour toute question concernant ce document, écris à legal@monetiq.ai."
        />
      }
    >
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Nav latérale */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="rounded-2xl border border-border bg-card/40 p-2 backdrop-blur">
            {(["terms", "privacy", "cookies", "legal"] as const).map((s) => (
              <Link
                key={s}
                href={`/legal/${s}`}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  s === slug
                    ? "bg-card/80 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                }`}
              >
                {labels[s]}
              </Link>
            ))}
          </nav>
          <p className="mt-4 px-2 text-xs text-muted-foreground">
            Document légal officiel. Toute version traduite est fournie à titre informatif —
            la version française fait foi.
          </p>
        </aside>

        {/* Contenu */}
        <article className="prose prose-invert max-w-none rounded-2xl border border-border bg-card/40 p-6 backdrop-blur md:p-10 [&_h2]:font-display [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_li]:text-sm [&_li]:text-muted-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-violet-400 [&_a]:underline [&_strong]:text-foreground">
          {children}
        </article>
      </div>
    </PageShell>
  );
}
