#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const OUTPUT_DIRECTORY = fileURLToPath(
  new URL("../public/images/noise", import.meta.url)
);

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  const masks = await page.evaluate(() => {
    function mulberry32(seed) {
      return function random() {
        let value = (seed += 0x6d2b79f5);
        value = Math.imul(value ^ (value >>> 15), value | 1);
        value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
        return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
      };
    }

    function createSparseNoiseTile({ seed, particleCount }) {
      const size = 1024;
      const random = mulberry32(seed);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas 2D indisponível.");

      canvas.width = size;
      canvas.height = size;
      context.clearRect(0, 0, size, size);
      context.fillStyle = "#fff";

      for (let index = 0; index < particleCount; index += 1) {
        const x = random() * size;
        const y = random() * size;
        const alpha = 0.16 + Math.pow(random(), 2.1) * 0.84;
        const radius = 0.26 + Math.pow(random(), 2.7) * 0.92;
        const stretch = 0.7 + random() * 1.8;
        const angle = random() * Math.PI;

        context.save();
        context.translate(x, y);
        context.rotate(angle);
        context.globalAlpha = alpha;
        context.beginPath();
        context.ellipse(0, 0, radius * stretch, radius, 0, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }

      return canvas.toDataURL("image/webp", 0.92).split(",")[1];
    }

    const baseParticleCount = 29_500;
    return {
      base: createSparseNoiseTile({ seed: 2026, particleCount: baseParticleCount }),
      boost: createSparseNoiseTile({
        seed: 8128,
        particleCount: Math.round(baseParticleCount * 0.85),
      }),
    };
  });

  mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
  for (const [name, data] of Object.entries(masks)) {
    const path = resolve(OUTPUT_DIRECTORY, `case-hero-${name}.webp`);
    writeFileSync(path, Buffer.from(data, "base64"));
    console.log(`✓ ${path}`);
  }
} finally {
  await browser.close();
}
