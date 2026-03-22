import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gym-X Control',
  description: 'Sistema de gestión para gimnasios',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-zinc-950 text-slate-50 antialiased">
        {children}
      </body>
    </html>
  );
}
