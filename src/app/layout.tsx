import type { Metadata } from 'next';
import { Newsreader, Inter, Geist } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/components/SmoothScrollProvider';
import { AuthProvider } from '@/components/AuthProvider';
import { SmoothCursor } from '@/components/ui/smooth-cursor';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-gelica',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

export const metadata: Metadata = {
  title: 'Shelfly — your personal reading shelf',
  description: 'A calm, personal book-tracking sanctuary to capture, read, and finish your favorite books.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(newsreader.variable, inter.variable, "font-sans", geist.variable)}>
      <body className="bg-cream-paper text-charcoal min-h-screen antialiased selection:bg-[#ff6f1e]/20 selection:text-[#2b1a07]">
        <SmoothScrollProvider>
          <AuthProvider>
            <SmoothCursor />
            {children}
          </AuthProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
