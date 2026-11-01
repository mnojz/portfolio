import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mosswood — A Living, Multiplayer 3D Developer Portfolio",
  description:
    "An interactive multiplayer 3D countryside world and developer portfolio for Manoj. Explore locations, inspect projects, and meet fellow visitors in real time.",
  keywords: ["portfolio", "3d portfolio", "threejs", "react three fiber", "multiplayer", "low poly", "manoj"],
  authors: [{ name: "Manoj" }],
  openGraph: {
    title: "Mosswood — A Living, Multiplayer 3D Developer Portfolio",
    description: "Step into my little world. Explore, discover projects, and connect with other visitors.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased w-screen h-screen overflow-hidden bg-slate-950 font-sans">
        {children}
      </body>
    </html>
  );
}

