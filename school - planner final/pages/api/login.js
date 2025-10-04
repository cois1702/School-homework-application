import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'db.json');

function readDB() {
  if (!fs.existsSync(DB_FILE)) return { teachers: [], tasks: [], announcements: [] };
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;
  const db = readDB();
  const user = db.teachers.find(t => t.email === email && t.password === password);
  if (!user) return res.json({ error: 'Invalid credentials' });

  res.json({ user });
}
