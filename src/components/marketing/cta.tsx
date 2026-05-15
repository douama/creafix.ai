"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative py-14 md:py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2rem] border border-border p-10 md:p-16">
          <div className="absolute inset-0 -z-10 gradient-brand opacity-90" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_60%)]" />
          <div className="absolute -bottom-24 -left-24 -z-10 h-72 w-72 rounded-full bg-orange-500/40 blur-3xl" />

          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold leading-tight text-white text-balance md:text-4xl">
                Prêt à débloquer
                <br />
                tes revenus créateur ?
              </h2>
              <p className="mt-4 max-w-md text-white/85">
                Audit IA gratuit en 60 secondes. Sans carte. Sans engagement. Le moyen le
                plus simple de transformer tes vues en FCFA.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Button asChild size="xl" className="group bg-black text-white hover:bg-black/90">
                <Link href="/signup">
                  Lancer mon audit gratuit
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <span className="text-xs text-white/70">
                +2 300 créateurs nous font déjà confiance · 9 pays
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
