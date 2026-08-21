import type { Metadata } from "next";
import LandingPage from "./landing-page";

export const metadata: Metadata = {
  title: "Urja — ₹75,000 a month to stop plant money holes",
  description:
    "One stopped day of CBG is about ₹49,500. One sour tank is about ₹10 lakh. Urja is ₹75,000 a month. Open a sample plant before you pay.",
};

export default function Home() {
  return <LandingPage />;
}
