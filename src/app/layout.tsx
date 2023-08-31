import { inconsolata, inter } from "./fonts";
import { Container, Theme } from "@radix-ui/themes";
import type { Metadata } from "next";

import "./globals.css";
import "@radix-ui/themes/styles.css";

export const metadata: Metadata = {
  title: "xs.codes",
  description: "xs.codes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${inconsolata.variable} overscroll-none`}
      >
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
