import { Suspense } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { SocialAuthToast } from "@/components/dashboard/social-auth-toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
      {/* Toast feedback pour /api/social/callback/* (success ou erreur OAuth) */}
      <Suspense fallback={null}>
        <SocialAuthToast />
      </Suspense>
    </div>
  );
}
