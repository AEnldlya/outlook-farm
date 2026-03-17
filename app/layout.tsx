import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Outlook Farm | Premium Horse Show Transportation | Norwich, VT",
  description: "Professional horse show transportation across the Northeast. Serving Vermont Summer Festival, Lake Placid, HITS Saugerties, and more since 1998.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
      </head>
      <body className="overflow-x-hidden bg-[var(--color-light)] text-[var(--color-dark)]">
        {children}
      </body>
    </html>
  );
}
