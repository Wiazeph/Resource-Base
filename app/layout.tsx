import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { siteName, siteDescription, siteUrl } from "@/lib/site";

// Inter for body text (crisp, neutral), Plus Jakarta Sans for headings
// (modern, geometric, distinctive). Geist Mono for code/kbd.
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Resource Base — Resources for everything",
    template: "%s · Resource Base",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName,
    title: "Resource Base — Resources for everything",
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resource Base — Resources for everything",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
