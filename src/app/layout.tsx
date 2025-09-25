import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import ParticlesBackground from "@/components/ParticlesBackground";
import "./globals.css";
import { CornProvider } from "@/context/CornContext";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bob's corn",
  description: "Buy corn from Bob",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <div id="particles-js"></div>
        <ParticlesBackground />
        <AuthProvider>
          <CornProvider>{children}</CornProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
