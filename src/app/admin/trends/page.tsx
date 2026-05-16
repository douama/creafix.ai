import { StubPage } from "@/components/admin/stub-page";

export default function Page() {
  return (
    <StubPage
      title="African Trend Engine"
      description="Curation manuelle + IA des tendances par pays africain"
      features={[
        "Ajout/validation des sons trending Sénégal, Nigeria, CI, Maroc, ZA…",
        "Hashtags hot par pays + détection niches montantes",
        "Best posting times par fuseau",
        "Scraping APIs + validation IA",
      ]}
    />
  );
}
