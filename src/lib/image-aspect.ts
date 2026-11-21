import { open, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Width / height of an image in /public, read from the file header (PNG,
 * JPEG, WebP). Pure JS on purpose: native image libraries can't be loaded by
 * Turbopack on this drive. Returns null when the format isn't recognised.
 */
export async function imageAspect(publicPath: string): Promise<number | null> {
  const file = path.join(process.cwd(), "public", publicPath);
  const head = await readHead(file, 64 * 1024);
  const size = parse(head) ?? (isJpeg(head) ? parse(await readFile(file)) : null);
  return size ? size.width / size.height : null;
}

async function readHead(file: string, bytes: number): Promise<Buffer> {
  const handle = await open(file, "r");
  try {
    const buffer = Buffer.alloc(bytes);
    const { bytesRead } = await handle.read(buffer, 0, bytes, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

const isJpeg = (b: Buffer) => b[0] === 0xff && b[1] === 0xd8;

function parse(b: Buffer): { width: number; height: number } | null {
  // PNG: IHDR is always the first chunk.
  if (b.length >= 24 && b.toString("ascii", 1, 4) === "PNG") {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  // WebP: lossy (VP8), lossless (VP8L) or extended (VP8X).
  if (b.length >= 30 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const chunk = b.toString("ascii", 12, 16);
    if (chunk === "VP8 ") return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8X") return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 };
  }
  // JPEG: walk the segments to the first start-of-frame marker.
  if (isJpeg(b)) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) return null;
      const marker = b[i + 1];
      const isFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isFrame) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;
}
