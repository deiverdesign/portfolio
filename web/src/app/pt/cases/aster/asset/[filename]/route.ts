import { NextResponse, type NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { isAsterUnlocked } from "@/app/_shared/aster/session";

// Fica FORA de web/public — arquivos aqui não têm URL pública própria.
// Só existem pra quem passar por essa rota, que confere a sessão antes
// de ler o arquivo do disco. Rota única, compartilhada pelas duas
// versões de idioma do case (as imagens não são localizadas).
const PROTECTED_DIR = path.join(process.cwd(), "src/app/_shared/aster/protected-assets");

const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".svg": "image/svg+xml",
};

// Nome de arquivo simples só (letras, números, _, -, um ponto e extensão)
// — impede pedir "../../../.env" ou qualquer caminho fora da pasta.
const SAFE_FILENAME = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const unlocked = await isAsterUnlocked();
  if (!unlocked) {
    // 404 em vez de 401/403: não confirma nem nega que o arquivo existe
    // pra quem não passou pela senha.
    return new NextResponse(null, { status: 404 });
  }

  const { filename } = await params;
  if (!SAFE_FILENAME.test(filename)) {
    return new NextResponse(null, { status: 404 });
  }

  const contentType = CONTENT_TYPES[path.extname(filename).toLowerCase()];
  if (!contentType) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const file = await readFile(path.join(PROTECTED_DIR, filename));
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "content-type": contentType,
        "cache-control": "private, no-store",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
