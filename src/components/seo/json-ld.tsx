/**
 * Composant utilitaire pour injecter du JSON-LD structured data dans
 * le DOM. Utilise <script type="application/ld+json"> ; sera lu par
 * Google, Bing, DuckDuckGo, ChatGPT, etc.
 *
 * Usage :
 *   import { JsonLd } from "@/components/seo/json-ld";
 *   import { organizationLd } from "@/lib/seo/structured-data";
 *   ...
 *   <JsonLd data={organizationLd()} />
 *
 * Multi : <JsonLd data={[organizationLd(), websiteLd()]} />
 */

export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <>
      {payload.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
        />
      ))}
    </>
  );
}
