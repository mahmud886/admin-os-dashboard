import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/ui/toast';
import './globals.css';

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
    <html lang="en" className="dark">
      <body>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
