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
  const { id } = req.query;
  const db = readDB();
  const task = db.tasks.find(t => t.id === id);
  if (!task) return res.json({ error: 'Task not found' });

  if (req.method === 'DELETE') {
    db.tasks = db.tasks.filter(t => t.id !== id);
    writeDB(db);
    return res.json({ message: 'Task deleted!' });
  }

  if (req.method === 'PUT') {
    task.done = !task.done;
    writeDB(db);
    return res.json({ message: 'Task updated!' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
