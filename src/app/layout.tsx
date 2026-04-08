import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "OnMind — Que tus clientes piensen en vos",
  description:
    "OnMind envía mensajes por WhatsApp por vos, con tu número real, en el momento justo. Comunicación inteligente para negocios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn("antialiased", GeistSans.variable, "font-sans", geist.variable)}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
