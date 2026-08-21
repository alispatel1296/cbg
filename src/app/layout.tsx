import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope, Noto_Sans_Gujarati, Syne } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import { PrefsProvider } from "@/lib/prefs";
import { BookProvider } from "@/lib/book-store";
import { GuDom } from "@/components/GuDom";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Segoe UI", "system-ui", "sans-serif"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Avenir Next", "Segoe UI", "sans-serif"],
});

const notoGu = Noto_Sans_Gujarati({
  variable: "--font-gujarati",
  subsets: ["gujarati"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["ui-monospace", "Consolas", "monospace"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0d6b5c",
};

export const metadata: Metadata = {
  title: "Urja — stop plant money holes",
  description:
    "₹75,000 a month. One stopped day of gas is about ₹49,500. One sour tank is about ₹10 lakh. Look at a sample plant before you pay.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${syne.variable} ${ibmPlexMono.variable} ${notoGu.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans text-foreground">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('urja-theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark');var l=localStorage.getItem('urja-lang');if(l==='gu'||l==='hi')document.documentElement.lang='gu';}catch(e){}`,
          }}
        />
        <PrefsProvider>
          <GuDom>
            <AuthProvider>
              <BookProvider>{children}</BookProvider>
            </AuthProvider>
          </GuDom>
        </PrefsProvider>
      </body>
    </html>
  );
}
