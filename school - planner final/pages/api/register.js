import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'db.json');

function readDB() {
  if (!fs.existsSync(DB_FILE)) return { teachers: [], tasks: [], announcements: [] };
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.json({ error: 'Fill all fields' });

  const db = readDB();
  if (db.teachers.find(t => t.email === email)) return res.json({ error: 'Email already exists' });

  const newTeacher = { id: Date.now().toString(), name, email, password };
  db.teachers.push(newTeacher);
  writeDB(db);

  res.json({ message: 'Teacher registered!' });
}
