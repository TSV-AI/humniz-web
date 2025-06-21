
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { SessionProvider } from '@/components/session-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'humniz - AI Text Humanizer',
  description: 'Turn AI-generated text into reliably humanized writing—trusted by students, professionals, and creators.',
  keywords: ['AI humanizer', 'text humanization', 'AI detection', 'content creation'],
  authors: [{ name: 'humniz' }],
  creator: 'humniz',
  publisher: 'humniz',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://humniz.io',
    title: 'humniz - AI Text Humanizer',
    description: 'Turn AI-generated text into reliably humanized writing—trusted by students, professionals, and creators.',
    siteName: 'humniz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'humniz - AI Text Humanizer',
    description: 'Turn AI-generated text into reliably humanized writing—trusted by students, professionals, and creators.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
