import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yume Creative Lab",
  description: "2D piksel art otonom ajans simülasyonu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
