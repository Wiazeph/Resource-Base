import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Resource Base collects, uses and protects your data.",
};

export default function PrivacyPage() {
  return <LegalPage kind="privacy" />;
}
