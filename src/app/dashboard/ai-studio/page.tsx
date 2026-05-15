import { redirect } from "next/navigation";

// AI Studio est un alias du Viral Lab pour l'instant.
// On garde une seule implémentation dans /generator.
export default function AIStudioPage() {
  redirect("/dashboard/generator");
}
