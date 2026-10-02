import type { Metadata, Viewport } from "next";
import { EnquiryProvider } from "@/components/site/enquiry";
import { Footer, Header } from "@/components/site/layout";
import "./globals.css";

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
    <html lang="lt" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap"
        />
      </head>
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
