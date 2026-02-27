import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { FirebaseClientProvider } from "@/firebase/client-provider";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "DevSphere | Tarun Portfolio",
    template: "%s | Tarun Portfolio",
  },
  description:
    "Tarun Kumar – Full Stack Developer specializing in MERN, Next.js, AI & scalable web applications.",

  keywords: [
    "Tarun Kumar",
    "Full Stack Developer",
    "Next.js Developer",
    "MERN Stack Developer",
    "AI Developer",
    "Portfolio",
  ],

  authors: [{ name: "Tarun Kumar" }],

  creator: "Tarun Kumar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="ko9ypSIypcGzrpAotQZJH37kWlF1T9CV1YoBfue31Z4" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Source+Code+Pro:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-accent selection:text-accent-foreground" suppressHydrationWarning>
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
