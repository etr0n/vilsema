import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { EnquiryProvider } from "@/components/site/enquiry";
import { Footer, Header } from "@/components/site/layout";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: {
    default: "Vilsema — vidaus ir lauko durys Kaune",
    template: "%s — Vilsema",
  },
  description: "Vidaus ir lauko durys, konsultacija, matavimas ir montavimas Kaune.",
  authors: [{ name: "Vilsema" }],
  openGraph: {
    title: "Vilsema — durys jūsų namams",
    description: "Durų pasirinkimas, matavimas ir montavimas Kaune.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="lt" data-scroll-behavior="smooth" className={manrope.variable}>
      <body>
        <EnquiryProvider>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </EnquiryProvider>
      </body>
    </html>
  );
}
