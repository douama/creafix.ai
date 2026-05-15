import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

export function PageShell({
  children,
  hero,
  breadcrumb,
}: {
  children: React.ReactNode;
  hero?: React.ReactNode;
  breadcrumb?: { label: string; href: string }[];
}) {
  return (
    <>
      <Navbar />
      <main className="relative">
        {/* Glow d'ambiance + grid */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px]">
          <div className="absolute inset-0 grid-bg opacity-50" />
          <div className="absolute left-1/2 top-0 h-[500px] w-[1100px] -translate-x-1/2 rounded-full bg-radial-fade blur-3xl" />
        </div>

        <div className="container pt-28 pb-16 md:pt-32 md:pb-20">
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
              {breadcrumb.map((b, i) => (
                <span key={b.href} className="flex items-center gap-1.5">
                  <Link href={b.href} className="hover:text-foreground">
                    {b.label}
                  </Link>
                  {i < breadcrumb.length - 1 && <ChevronRight className="h-3 w-3" />}
                </span>
              ))}
            </nav>
          )}
          {hero}
        </div>

        <div className="container pb-20">{children}</div>
      </main>
      <Footer />
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string | React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          {eyebrow}
        </div>
      )}
      <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance md:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-balance text-sm text-muted-foreground md:text-base">
          {subtitle}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </header>
  );
}

export function PageSection({
  title,
  subtitle,
  children,
  className = "",
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`mt-14 ${className}`}>
      {title && (
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
