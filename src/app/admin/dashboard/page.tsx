// Alias propre de /admin → /admin/dashboard (URL plus explicite).
// Réexporte la page cockpit existante.
export { default, dynamic, revalidate } from "../page";

export const metadata = {
  title: "Dashboard · Admin",
  robots: { index: false, follow: false },
};
