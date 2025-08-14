import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Fix It",
  description: "Reliable Home Services",
  icons:{
    icon:'/favicon-img.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          {children}
          <ToastProvider/>
        </Providers>
      </body>
    </html>
  );
}
