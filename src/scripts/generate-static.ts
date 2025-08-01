// Script to generate static files for production

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateAllStaticFiles } from '../lib/static-generator.js';

// Get tools and other data from fallback data
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

// Load data files
const loadData = async () => {
  try {
    const tools = JSON.parse(fs.readFileSync(path.join(dataDir, 'tools.json'), 'utf8'));
    const categories = JSON.parse(fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf8'));
    const tags = JSON.parse(fs.readFileSync(path.join(dataDir, 'tags.json'), 'utf8'));
    const alternatives = JSON.parse(fs.readFileSync(path.join(dataDir, 'alternatives.json'), 'utf8'));
    const vsPairs = JSON.parse(fs.readFileSync(path.join(dataDir, 'vspairs.json'), 'utf8'));
    const deals = JSON.parse(fs.readFileSync(path.join(dataDir, 'deals.json'), 'utf8'));
    
    return { tools, categories, tags, alternatives, vsPairs, deals };
  } catch (error) {
    console.error('Error loading data files:', error);
    return { tools: [], categories: [], tags: [], alternatives: [], vsPairs: [], deals: [] };
  }
};

const main = async () => {
  console.log('🚀 Generating static files...');
  
  const data = await loadData();
  const config = {
    baseUrl: 'https://rect.one',
    ...data,
  };
  
  const staticFiles = await generateAllStaticFiles(config);
  
  // Ensure public directory exists
  const publicDir = path.join(__dirname, '..', '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Write files
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), staticFiles.sitemap);
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), staticFiles.robots);
  fs.writeFileSync(path.join(publicDir, 'feed.xml'), staticFiles.rss);
  fs.writeFileSync(path.join(publicDir, 'feed.json'), staticFiles.json);
  
  console.log('✅ Generated static files:');
  console.log('  - public/sitemap.xml');
  console.log('  - public/robots.txt');
  console.log('  - public/feed.xml');
  console.log('  - public/feed.json');
  
  console.log('\n🌐 Verification URLs:');
  console.log('  - https://rect.one/sitemap.xml');
  console.log('  - https://rect.one/robots.txt');
  console.log('  - https://rect.one/feed.xml');
  console.log('  - https://rect.one/feed.json');
};

main().catch(console.error);