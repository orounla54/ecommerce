import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemins des dossiers
const targetDir = path.join(__dirname, '../public/images');
const categoriesDir = path.join(targetDir, 'categories');
const productsDir = path.join(targetDir, 'products');

// Créer les dossiers s'ils n'existent pas
[targetDir, categoriesDir, productsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Dossier créé : ${dir}`);
  }
});

// Images de démonstration avec leurs URLs
const categoryImages = {
  'smartphones.jpg': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  'computers.jpg': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
  'audio.jpg': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  'tv.jpg': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
  'gaming.jpg': 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
  'tablets.jpg': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
  'drones.jpg': 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9',
  'cameras.jpg': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
  'watches.jpg': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d',
  'smart-home.jpg': 'https://images.unsplash.com/photo-1558002038-1055907df827'
};

const productImages = {
  'iphone.jpg': 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a',
  'samsung.jpg': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf',
  'macbook.jpg': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
  'sony-headphones.jpg': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  'samsung-tv.jpg': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
  'switch.jpg': 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e',
  'ipad.jpg': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
  'drone.jpg': 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9',
  'gopro.jpg': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
  'apple-watch.jpg': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d',
  'sony-camera.jpg': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
  'bose.jpg': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
  'surface.jpg': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
  'ps5.jpg': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db',
  'xbox.jpg': 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d',
  'pixel.jpg': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97',
  'dell.jpg': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45',
  'echo.jpg': 'https://images.unsplash.com/photo-1558002038-1055907df827',
  'fitbit.jpg': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d',
  'lg-tv.jpg': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
  'canon.jpg': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32',
  'razer.jpg': 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45',
  'samsung-watch.jpg': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d',
  'airpods.jpg': 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434',
  'dji-mavic.jpg': 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9'
};

// Fonction pour télécharger une image
async function downloadImage(url, filepath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  const buffer = await response.buffer();
  fs.writeFileSync(filepath, buffer);
  console.log(`Downloaded: ${filepath}`);
}

console.log('Téléchargement des images...');

// Télécharger les images pour les catégories
async function downloadCategoryImages() {
  for (const [filename, url] of Object.entries(categoryImages)) {
    const filePath = path.join(categoriesDir, filename);
    try {
      await downloadImage(url, filePath);
    } catch (error) {
      console.error(`Erreur lors du téléchargement de ${url}: ${error.message}`);
    }
  }
}

// Télécharger les images pour les produits
async function downloadProductImages() {
  for (const [filename, url] of Object.entries(productImages)) {
    const filePath = path.join(productsDir, filename);
    try {
      await downloadImage(url, filePath);
    } catch (error) {
      console.error(`Erreur lors du téléchargement de ${url}: ${error.message}`);
    }
  }
}

// Exécuter les téléchargements
async function runDownloadScript() {
  await downloadCategoryImages();
  await downloadProductImages();
  console.log('Script de téléchargement des images terminé !');
}

runDownloadScript(); 