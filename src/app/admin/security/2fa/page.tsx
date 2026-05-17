import { TwoFactorClient } from "./two-factor-client";

export const metadata = {
  title: "2FA Admin · CreaFix AI",
  robots: { index: false, follow: false },
};

export default function TwoFactorPage() {
  return <TwoFactorClient />;
}
