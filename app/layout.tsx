import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cura | Clinical Intelligence & Care Companion',
  description: 'Ambient consultation recording and longitudinal clinical memory.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F9FAFB] text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}