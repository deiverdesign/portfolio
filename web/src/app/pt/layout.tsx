import type { Metadata } from "next";
import { buildLocaleMetadata, LocaleRootLayout } from "../_shared/LocaleRootLayout";
import "../globals.css";

export const metadata: Metadata = buildLocaleMetadata("pt");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LocaleRootLayout locale="pt">{children}</LocaleRootLayout>;
}
