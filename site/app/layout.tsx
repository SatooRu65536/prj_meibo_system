import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/components/firebase/client';
import Header from './_components/base/Header';
import Footer from './_components/base/Footer';
import RecoilProvider from './recoilProvider';
import LoginCheck from './_components/base/LoginCheck';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '名簿システム | シス研',
  description: '愛工大システム工学研究会の名簿システム',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RecoilProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          <LoginCheck>{children}</LoginCheck>
          <Footer />
        </body>
      </html>
    </RecoilProvider>
  );
}
