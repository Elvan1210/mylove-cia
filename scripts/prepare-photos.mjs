// ============================================================
// scripts/prepare-photos.mjs
// Memproses foto dari MyLove/foto/ → src/assets/photos/
// Jalankan: npm run prepare:photos
// ============================================================

import sharp from "sharp";
import { readdir, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.resolve(__dirname, "..", "..", "foto");
const OUTPUT_DIR = path.resolve(__dirname, "..", "src", "assets", "photos");
const THUMB_DIR = path.join(OUTPUT_DIR, "thumbs");

const MAX_LONG_SIDE = 1600;
const THUMB_WIDTH = 600;
const JPEG_QUALITY = 82;
const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
]);

async function getExifDate(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    // sharp exposes EXIF as a buffer; try to extract date
    if (metadata.exif) {
      const exifStr = metadata.exif.toString("binary");
      // Look for DateTimeOriginal pattern: YYYY:MM:DD HH:MM:SS
      const match = exifStr.match(
        /(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/
      );
      if (match) {
        return new Date(
          `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}`
        );
      }
    }
  } catch {
    // Ignore EXIF errors
  }
  return null;
}

async function processPhoto(inputPath, outputName, _index) {
  const outputPath = path.join(OUTPUT_DIR, outputName);
  const thumbPath = path.join(THUMB_DIR, outputName);

  try {
    let pipeline = sharp(inputPath).rotate(); // Auto-rotate based on EXIF

    const metadata = await sharp(inputPath).metadata();
    const { width, height } = metadata;

    // Resize if needed (max 1600px on longest side)
    if (width > MAX_LONG_SIDE || height > MAX_LONG_SIDE) {
      if (width >= height) {
        pipeline = pipeline.resize(MAX_LONG_SIDE, null, {
          withoutEnlargement: true,
        });
      } else {
        pipeline = pipeline.resize(null, MAX_LONG_SIDE, {
          withoutEnlargement: true,
        });
      }
    }

    // Output as JPEG
    await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(outputPath);

    // Create thumbnail (600px wide)
    await sharp(inputPath)
      .rotate()
      .resize(THUMB_WIDTH, null, { withoutEnlargement: true })
      .jpeg({ quality: 75, mozjpeg: true })
      .toFile(thumbPath);

    // Get file sizes
    const { size: origSize } = await import("fs").then((fs) =>
      fs.promises.stat(inputPath)
    );
    const { size: newSize } = await import("fs").then((fs) =>
      fs.promises.stat(outputPath)
    );

    console.log(
      `  ✅ ${outputName} — ${(origSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${metadata.width}×${metadata.height})`
    );
    return true;
  } catch (err) {
    console.error(`  ❌ Gagal memproses ${path.basename(inputPath)}: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log("\n🌸 Memproses foto untuk website Patricia...\n");

  // Check source directory
  if (!existsSync(SOURCE_DIR)) {
    console.warn(
      "⚠️  Folder MyLove/foto/ tidak ditemukan. Website akan menampilkan placeholder."
    );
    console.log("   Taruh foto di MyLove/foto/ lalu jalankan ulang script ini.\n");
    return;
  }

  // Ensure output directories exist
  await mkdir(OUTPUT_DIR, { recursive: true });
  await mkdir(THUMB_DIR, { recursive: true });

  // Scan for images
  const entries = await readdir(SOURCE_DIR, { withFileTypes: true });
  const imageFiles = entries
    .filter((e) => {
      if (!e.isFile()) return false;
      if (e.name.startsWith(".")) return false;
      const ext = path.extname(e.name).toLowerCase();
      return IMAGE_EXTENSIONS.has(ext);
    })
    .map((e) => ({
      name: e.name,
      path: path.join(SOURCE_DIR, e.name),
      ext: path.extname(e.name).toLowerCase(),
    }));

  if (imageFiles.length === 0) {
    console.warn("⚠️  Tidak ada file gambar di MyLove/foto/.");
    console.log("   Website akan menampilkan placeholder.\n");
    return;
  }

  console.log(`📷 Ditemukan ${imageFiles.length} foto.\n`);

  // Check for HEIC files
  const heicFiles = imageFiles.filter(
    (f) => f.ext === ".heic" || f.ext === ".heif"
  );
  const processableFiles = imageFiles.filter(
    (f) => f.ext !== ".heic" && f.ext !== ".heif"
  );

  if (heicFiles.length > 0) {
    console.warn(
      `⚠️  ${heicFiles.length} file HEIC/HEIF ditemukan tapi dilewati (tidak didukung di environment ini):`
    );
    heicFiles.forEach((f) => console.warn(`   - ${f.name}`));
    console.log(
      "   Konversi manual ke JPG terlebih dahulu, lalu jalankan ulang script ini.\n"
    );
  }

  // Get EXIF dates for sorting
  const filesWithDates = await Promise.all(
    processableFiles.map(async (f) => ({
      ...f,
      exifDate: await getExifDate(f.path),
    }))
  );

  // Sort by EXIF date first, then filename
  filesWithDates.sort((a, b) => {
    if (a.exifDate && b.exifDate) return a.exifDate - b.exifDate;
    if (a.exifDate && !b.exifDate) return -1;
    if (!a.exifDate && b.exifDate) return 1;
    return a.name.localeCompare(b.name);
  });

  // Process each photo
  let successCount = 0;
  for (let i = 0; i < filesWithDates.length; i++) {
    const file = filesWithDates[i];
    const num = String(i + 1).padStart(2, "0");
    const outputName = `foto-${num}.jpg`;
    const ok = await processPhoto(file.path, outputName, i);
    if (ok) successCount++;
  }

  console.log(
    `\n✨ Selesai! ${successCount}/${filesWithDates.length} foto berhasil diproses.`
  );
  console.log(`   📁 Output: ${OUTPUT_DIR}`);
  console.log(`   📁 Thumbnail: ${THUMB_DIR}\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
