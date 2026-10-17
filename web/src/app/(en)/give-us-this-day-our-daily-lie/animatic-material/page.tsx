import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader } from "next/font/google";
import { ENGLISH_STORY } from "../../../_shared/faithStory";
import { PortaoMaterial } from "../../../pt/enquanto-durar-a-fe/animatic-material/PortaoMaterial";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: "500", display: "swap" });

const SITE_URL = "https://enquantodurarafe.com.br";
const PATH = "/give-us-this-day-our-daily-lie/animatic-material";
const PORTUGUESE_PATH = "/pt/enquanto-durar-a-fe/animatic-material";
const TITLE = "Give Us This Day Our Daily Lie — A novel by Deiver Brito";
const DESCRIPTION = "Jota goes door to door selling Bibles. He knows exactly what to say — but there are things about himself he would rather keep in silence.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}${PATH}`,
    languages: {
      "pt-BR": `${SITE_URL}${PORTUGUESE_PATH}`,
      en: `${SITE_URL}${PATH}`,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    siteName: "Give Us This Day Our Daily Lie",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function GiveUsThisDayOurDailyLiePage() {
  return (
    <div className={newsreader.variable}>
      <PortaoMaterial creditFont={plexMono.style.fontFamily} story={ENGLISH_STORY} />
    </div>
  );
}
