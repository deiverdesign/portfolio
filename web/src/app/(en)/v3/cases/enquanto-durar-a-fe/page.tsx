import type { Metadata } from "next";
import { BookCaseV3 } from "@/components/BookCaseV3/BookCaseV3";
export const metadata: Metadata = {
  title: "Give us This Day Our Daily Lie — Deiver Brito (Preview)",
  robots: { index: false, follow: false },
};
export default function BookCasePreview() {
  return <BookCaseV3 locale="en" />;
}
