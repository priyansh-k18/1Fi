import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FundEMI — Buy smartphones on mutual-fund backed EMI",
  description: "Compare EMI plans across flagship smartphones — 0% interest options and cashback.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased selection:bg-mint/30 selection:text-mint-foreground`}>
        <SiteHeader />
        <main className="min-h-[calc(100vh-14rem)]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
