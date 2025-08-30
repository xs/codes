import { Gentium_Book_Plus, Inconsolata, Inter } from "next/font/google";

export const gentium = Gentium_Book_Plus({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const inconsolata = Inconsolata({
  subsets: ["latin"],
  variable: "--m-plus-1",
  display: "swap",
});
