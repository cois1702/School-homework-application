import { readDB, writeDB } from '../../utils/db';

export default function handler(req, res) {
  const database = readDB();

  if (req.method === 'GET') {
    return res.json(database.announcements);
  }

  if (req.method === 'POST') {
    const { grade, classLetter, message, teacher } = req.body;
    if (!message || !grade || !classLetter || !teacher) {
      return res.json({ error: 'Fill all fields' });
    }

    const newAnnouncement = {
      id: Date.now().toString(),
      grade,
      classLetter,
      message,
      teacher,
      createdAt: new Date().toISOString()
    };

    database.announcements.push(newAnnouncement);
    writeDB(database);
    return res.json({ message: 'Announcement added!' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
