import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AccountClient } from "./account-client";

export const metadata = {
  title: "Mon compte · CreaFix AI",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  // Fetch profile via admin (bypass RLS, robust)
  const sb = supabaseAdmin();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (sb.from("user_profiles") as any)
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/login?error=no_profile");

  // Détermine où revenir selon rôle
  const isAdmin = ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT", "ANALYST"].includes(profile.role);
  const backHref = isAdmin ? "/admin/dashboard" : "/creators/dashboard";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl py-8 md:py-12">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour au dashboard
        </Link>

        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Mon compte
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Édite tes informations personnelles, ton avatar et ton mot de passe.
        </p>

        <AccountClient
          initial={{
            id: profile.id,
            email: user.email ?? "",
            full_name: profile.full_name,
            phone: profile.phone,
            country: profile.country,
            preferred_lang: profile.preferred_lang,
            avatar_url: profile.avatar_url,
            role: profile.role,
            plan: profile.plan,
            credits: profile.credits,
            created_at: profile.created_at,
          }}
        />
      </div>
    </div>
  );
}
