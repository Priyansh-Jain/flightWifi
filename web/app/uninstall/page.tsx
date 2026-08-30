import type { Metadata } from "next";
import { CHROME_STORE_URL, CONTACT_EMAIL, FEEDBACK_ENDPOINT } from "@/lib/site";
import UninstallFeedback from "./UninstallFeedback";

export const metadata: Metadata = {
  title: "Uninstalled",
  description: "Tell us why you removed the FlightWifi extension.",
  alternates: { canonical: "/uninstall/" },
  robots: { index: false, follow: false }
};

export default function Uninstall() {
  return (
    <UninstallFeedback
      chromeStoreUrl={CHROME_STORE_URL}
      contactEmail={CONTACT_EMAIL}
      feedbackEndpoint={FEEDBACK_ENDPOINT}
      year={new Date().getFullYear()}
    />
  );
}
