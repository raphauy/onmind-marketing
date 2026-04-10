import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://marketing.onmindcrm.com"),
  title: {
    default: "OnMind — Que tus clientes piensen en vos",
    template: "%s | OnMind",
  },
  description:
    "OnMind envía mensajes por WhatsApp por vos, con tu número real, en el momento justo. Comunicación inteligente para negocios.",
  keywords: [
    "WhatsApp",
    "CRM",
    "seguimiento de clientes",
    "mensajes programados",
    "inmobiliaria",
    "fidelización",
  ],
  authors: [{ name: "OnMind" }],
  openGraph: {
    type: "website",
    siteName: "OnMind",
    url: "https://www.onmindcrm.com",
    title: "OnMind — Que tus clientes piensen en vos",
    description:
      "Enviá mensajes por WhatsApp con tu número real, en el momento justo. Seguimiento automático para negocios que viven de sus clientes.",
    locale: "es_UY",
    images: [
      {
        url: "/brand/logo-OnMind-fondo-blanco.png",
        alt: "OnMind CRM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OnMind — Que tus clientes piensen en vos",
    description:
      "Enviá mensajes por WhatsApp con tu número real, en el momento justo. Seguimiento automático para negocios que viven de sus clientes.",
    images: ["/brand/logo-OnMind-fondo-blanco.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#080F0D" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn("antialiased", geist.variable)} suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
