import { readDB, writeDB } from "./_db.js";

export default function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.query;
  const database = readDB();
  const index = database.announcements.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: "Announcement not found" });

  database.announcements.splice(index, 1);
  writeDB(database);

  res.status(200).json({ message: "Announcement deleted!" });
}
