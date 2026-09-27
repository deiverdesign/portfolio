import type { Metadata } from "next";
import { buildLocaleMetadata, LocaleRootLayout } from "../_shared/LocaleRootLayout";
import "../globals.css";

export const metadata: Metadata = buildLocaleMetadata("en");

export default function EnRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LocaleRootLayout locale="en">{children}</LocaleRootLayout>;
}
