import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { GoogleAnalytics } from '@next/third-parties/google'



const inter = Inter({ subsets: ["latin"] });
 

export const metadata = {
  title: "ResumeLint",
  description: "ResumeLint is a smart ATS resume reviewer powered by AI that helps you get past the ATS by giving you a detailed analysis of your resume and job description.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
        <Toaster />
      </body>
      <GoogleAnalytics gaId="G-KZZBKD9EH6" />
    </html>
  );
}
