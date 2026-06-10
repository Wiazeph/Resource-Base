import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of Resource Base.",
};

export default function TermsPage() {
  return <LegalPage kind="terms" />;
}
