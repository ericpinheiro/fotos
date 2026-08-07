import type { Metadata } from "next";
import { Archivo, Space_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eric Pinheiro",
  description: "Portfólio de fotografia analógica de Eric Pinheiro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${spaceMono.variable}`}>
      <head>
        <script
          defer
          src="https://umami.ericpinheiro.com/script.js"
          data-website-id="0dd639e3-014c-4230-aef7-33c163d286ce"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
