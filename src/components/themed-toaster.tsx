"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

/**
 * Toaster qui suit le thème next-themes + styles explicites
 * pour éviter "texte blanc sur fond blanc" (bug par défaut sonner
 * quand on est en dark mode sans theme="dark" passé).
 */
export function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme === "dark" ? "dark" : "light") as "light" | "dark";

  return (
    <Toaster
      position="top-right"
      theme={theme}
      richColors
      closeButton
      toastOptions={{
        // Force bg + text + border opaques, plus de transparence problématique
        style: {
          background: theme === "dark" ? "rgba(15, 19, 32, 0.96)" : "rgba(255, 255, 255, 0.98)",
          color: theme === "dark" ? "#E6EEF9" : "#0F172A",
          border: theme === "dark"
            ? "1px solid rgba(255, 255, 255, 0.12)"
            : "1px solid rgba(15, 23, 42, 0.10)",
          backdropFilter: "blur(20px)",
        },
        className: "shadow-2xl",
      }}
    />
  );
}
