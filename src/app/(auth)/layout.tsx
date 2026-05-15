import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg" />
      <div className="absolute -top-32 left-1/2 -z-10 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-radial-fade blur-3xl" />

      <header className="container py-6">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      <main className="container flex min-h-[calc(100vh-120px)] items-center justify-center py-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
