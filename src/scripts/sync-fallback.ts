// Script to sync Supabase data to local JSON files

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const syncTable = async (tableName: string): Promise<any[]> => {
  console.log(`📡 Syncing ${tableName}...`);
  
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`❌ Error syncing ${tableName}:`, error);
    return [];
  }
  
  console.log(`✅ Synced ${data.length} records from ${tableName}`);
  return data || [];
};

const main = async () => {
  console.log('🔄 Syncing Supabase data to local JSON files...');
  
  const dataDir = path.join(__dirname, '..', 'data');
  
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  try {
    // Sync all tables
    const [tools, categories, tags, deals, alternatives, vsPairs] = await Promise.all([
      syncTable('tools'),
      syncTable('categories'),
      syncTable('tags'),
      syncTable('deals'),
      syncTable('alternatives'),
      syncTable('vspairs'),
    ]);
    
    // Write to JSON files
    const files = [
      { name: 'tools.json', data: tools },
      { name: 'categories.json', data: categories },
      { name: 'tags.json', data: tags },
      { name: 'deals.json', data: deals },
      { name: 'alternatives.json', data: alternatives },
      { name: 'vspairs.json', data: vsPairs },
    ];
    
    for (const file of files) {
      const filePath = path.join(dataDir, file.name);
      fs.writeFileSync(filePath, JSON.stringify(file.data, null, 2));
      console.log(`📄 Written ${file.name} (${file.data.length} records)`);
    }
    
    console.log('✅ Sync completed successfully!');
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
};

main();