import { PrismaClient } from "@prisma/client";
import { COUNTRIES } from "../src/lib/africa-cpm";

const prisma = new PrismaClient();

async function main() {
  for (const [code, c] of Object.entries(COUNTRIES)) {
    await prisma.countryCpm.upsert({
      where: { code },
      update: {
        name: c.name,
        currency: c.currency,
        fxToUsd: c.fxToUsd,
        cpmFacebook: c.cpmFacebook,
        cpmTikTok: c.cpmTikTok,
        rpmFacebook: c.rpmFacebook,
        rpmTikTok: c.rpmTikTok,
      },
      create: {
        code,
        name: c.name,
        currency: c.currency,
        fxToUsd: c.fxToUsd,
        cpmFacebook: c.cpmFacebook,
        cpmTikTok: c.cpmTikTok,
        rpmFacebook: c.rpmFacebook,
        rpmTikTok: c.rpmTikTok,
      },
    });
  }
  console.log("✓ CountryCpm seed terminé");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
