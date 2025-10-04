import { readDB, writeDB } from '../../../utils/db';

export default function handler(req, res) {
  const database = readDB();
  const { id } = req.query;
  const announcement = database.announcements.find(a => a.id === id);

  if (!announcement) return res.json({ error: 'Announcement not found' });

  if (req.method === 'DELETE') {
    database.announcements = database.announcements.filter(a => a.id !== id);
    writeDB(database);
    return res.json({ message: 'Announcement deleted!' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
