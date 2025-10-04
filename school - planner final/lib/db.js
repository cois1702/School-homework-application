import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'db.json');

export function readDB() {
  if (!fs.existsSync(DB_FILE)) return { teachers: [], tasks: [], announcements: [] };
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

export function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}
