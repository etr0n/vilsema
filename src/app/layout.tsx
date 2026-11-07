import type { Metadata, Viewport } from "next";
import { Mulish, Raleway } from "next/font/google";
import { EnquiryProvider } from "@/components/site/enquiry";
import { Footer, Header } from "@/components/site/layout";
import "./globals.css";

// Same pairing as kastrupvinduet.dk: Mulish for headings, Raleway for everything else.
const mulish = Mulish({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-mulish",
});

const raleway = Raleway({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: {
    default: "Vilsema | vidaus ir lauko durys Kaune",
    template: "%s | Vilsema",
  },
  description: "Vidaus ir lauko durys, konsultacija, matavimas ir montavimas Kaune.",
  authors: [{ name: "Vilsema" }],
  openGraph: {
    title: "Vilsema | durys jūsų namams",
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
    <html lang="lt" data-scroll-behavior="smooth" className={`${mulish.variable} ${raleway.variable}`}>
      <body>
        <EnquiryProvider>
          <div className="flex min-h-screen flex-col overflow-x-clip bg-background text-foreground">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </EnquiryProvider>
      </body>
    </html>
  );
}
