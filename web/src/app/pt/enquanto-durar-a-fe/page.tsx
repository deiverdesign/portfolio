import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Newsreader } from "next/font/google";
import { BookExperience } from "./BookExperience";
import { HotsiteLoader } from "./loader/HotsiteLoader";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: "500", display: "swap" });
// Só para o "Loading..." do loader (Figma: Inter Regular 14).
const inter = Inter({ subsets: ["latin"], weight: "400", display: "swap" });

const SITE_URL = "https://enquantodurarafe.com.br";
const TITLE = "Enquanto durar a fé — Um romance de Deiver Brito";
const DESCRIPTION = "Jota vende Bíblias de porta em porta. Enquanto sua mãe guarda um segredo, uma história volta no tempo para revelar o que o presente esconde.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
    languages: {
      "pt-BR": SITE_URL,
      en: `${SITE_URL}/give-us-this-day-our-daily-lie`,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: TITLE,
    locale: "pt_BR",
    type: "website",
    images: [{ url: `${SITE_URL}/enquanto-durar-a-fe/og-cover.jpg`, width: 1200, height: 630, alt: "" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE_URL}/enquanto-durar-a-fe/og-cover.jpg`],
  },
};

export default function EnquantoDurarAFePage() {
  return (
    <div className={newsreader.variable}>
      <HotsiteLoader fontFamily={inter.style.fontFamily} />
      <BookExperience creditFont={plexMono.style.fontFamily} />
    </div>
  );
}
