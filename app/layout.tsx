import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blog Writing Agent",
  description: "AI-powered blog writing automation tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
