import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ToastProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/context/AuthContext";
import { Space_Grotesk } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: "SPORE FALL - Admin Console",
  description: "Administrative dashboard for system management",
  icons: {
    icon: "/assets/favicon_io/favicon-32x32.png",
    shortcut: "/assets/favicon_io/favicon-16x16.png",
    apple: "/assets/favicon_io/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable}`}>
      <body>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
