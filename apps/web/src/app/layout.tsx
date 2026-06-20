import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ClientLayout } from "@/app/client-layout";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Code Hammer",
  description: "A modular AI desk assistant for SMEs and professionals.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
