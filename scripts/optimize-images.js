const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public', 'galeria');
const outDir = path.join(publicDir, 'optimized');
const sizes = [320, 640, 1024, 1600];
const formats = ['webp', 'avif'];

if (!fs.existsSync(publicDir)) {
  console.error('No se encontró el directorio:', publicDir);
  process.exit(1);
}
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  const name = path.basename(file, ext).replace(/\s+/g, '-');
  const input = path.join(publicDir, file);

  try {
    for (const width of sizes) {
      const pipeline = sharp(input).resize({ width, withoutEnlargement: true });
      for (const fmt of formats) {
        const outName = `${name}-${width}.${fmt}`;
        const outPath = path.join(outDir, outName);
        if (fmt === 'webp') {
          await pipeline.webp({ quality: 80 }).toFile(outPath);
        } else if (fmt === 'avif') {
          await pipeline.avif({ quality: 50 }).toFile(outPath);
        }
        console.log('Generado:', outPath);
      }
    }
  } catch (err) {
    console.error('Error procesando', input, err);
  }
}

async function run() {
  const files = fs.readdirSync(publicDir).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext);
  });
  if (files.length === 0) {
    console.log('No se encontraron imágenes para optimizar en', publicDir);
    return;
  }

  for (const file of files) {
    console.log('Procesando:', file);
    // eslint-disable-next-line no-await-in-loop
    await processFile(file);
  }

  console.log('Optimización completada. Archivos en:', outDir);
}

run();
