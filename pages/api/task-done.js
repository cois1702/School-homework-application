import { readDB, writeDB } from "./_db.js";

export default function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.query;
  const database = readDB();
  const task = database.tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.done = !task.done;
  writeDB(database);

  res.status(200).json({ message: "Task updated!" });
}
