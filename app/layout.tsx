import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyNews",
  description: "パーソナライズドニュースアプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, padding: 0, background: '#0f0f0f', overflowX: 'hidden' }}>
        {children}
      </body>
    </html>
  );
}