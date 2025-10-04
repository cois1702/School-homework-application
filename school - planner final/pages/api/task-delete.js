import { readDB, writeDB } from "./_db.js";

export default function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.query;
  const database = readDB();
  const index = database.tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Task not found" });

  database.tasks.splice(index, 1);
  writeDB(database);

  res.status(200).json({ message: "Task deleted!" });
}
