import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Outlook Farm | Horse Show Transportation | Norwich, VT",
  description: "Professional horse show transportation across the Northeast. Serving Vermont Summer Festival, Lake Placid, HITS Saugerties, and more since 1998.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
