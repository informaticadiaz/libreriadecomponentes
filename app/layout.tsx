// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
//import { ThemeProvider } from 'next-themes'

//import { ThemeToggle } from "@/components/providers/ThemeToggle"
// import ServiciosMenu from "@/components/menu-tres/ResponsiveMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "libreria de componentes",
  description: "Bill Gates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/*<ThemeProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <ServiciosMenu />
           <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>*/}
          {children}
        {/*</ThemeProvider>*/}
      </body>
    </html>
  );
}
