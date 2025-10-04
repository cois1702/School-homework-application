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

  const { email, newPassword } = req.body;
  if (!email || !newPassword) return res.json({ error: 'Fill all fields' });

  const db = readDB();
  const teacher = db.teachers.find(t => t.email === email);
  if (!teacher) return res.json({ error: 'Teacher not found' });

  teacher.password = newPassword;
  writeDB(db);
  res.json({ message: 'Password reset successfully!' });
}
