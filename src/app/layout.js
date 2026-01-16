import './globals.css';

export const metadata = {
  title: 'SPORE FALL - Admin Console',
  description: 'Administrative dashboard for system management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
