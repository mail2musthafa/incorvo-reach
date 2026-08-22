import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { DemoRoleBar } from "@/components/layout/DemoRoleBar";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Incorvo Reach | Verified Actions. Measurable Growth.",
  description: "Enterprise two-sided marketplace where businesses pay for genuine, verifiable customer actions—research, original content, store visits, referrals and qualified leads. Never fake metrics.",
  keywords: ["Incorvo Reach", "Verified Actions", "Customer Outcomes", "UGC Marketplace", "Private Research"],
  authors: [{ name: "ABC Company Private Limited" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="antialiased font-sans text-brand-navy bg-brand-bg">
        <LanguageProvider>
          <AuthProvider>
            <DemoRoleBar />
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
