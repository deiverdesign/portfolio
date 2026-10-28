"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// O Three.js, os modelos e os shaders ficam em um pacote separado. Assim o HTML e
// o loader conseguem aparecer antes de o navegador começar o trabalho pesado da cena.
const PortaoMaterial = dynamic(
  () => import("./animatic-material/PortaoMaterial").then((module) => module.PortaoMaterial),
  { ssr: false, loading: () => null },
);

export function BookExperience({ creditFont }: { creditFont: string }) {
  const [startScene, setStartScene] = useState(false);

  useEffect(() => {
    // Dois frames garantem que a cortina do loader tenha sido realmente pintada antes
    // de iniciar a importação, a compilação de shaders e a montagem dos modelos 3D.
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setStartScene(true));
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, []);

  return startScene ? <PortaoMaterial creditFont={creditFont} /> : null;
}
