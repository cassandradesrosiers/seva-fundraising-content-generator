import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SEVA Content Generator",
  description: "South End Village Academy — Internal Fundraising Tool",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={nunito.variable}>
      <body style={{ margin: 0, padding: 0, fontFamily: "var(--font-nunito), DM Sans, system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
