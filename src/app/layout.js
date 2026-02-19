import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ui/toast';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata = {
  title: 'SPORE FALL - Admin Console',
  description: 'Administrative dashboard for system management',
  icons: {
    icon: '/assets/images/sporefall.jpeg',
    shortcut: '/assets/images/sporefall.jpeg',
    apple: '/assets/images/sporefall.jpeg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${spaceGrotesk.variable}`}>
      <body>
        <GoogleAnalytics />
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
