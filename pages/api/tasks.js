import { readDB, writeDB } from "./_db.js";

export default function handler(req, res) {
  const database = readDB();

  if (req.method === "GET") {
    return res.status(200).json(database.tasks);
  }

  if (req.method === "POST") {
    const { grade, classLetter, subject, description, dueDate, teacher } = req.body;
    if (!grade || !classLetter || !subject || !description || !dueDate || !teacher) {
      return res.status(400).json({ error: "Fill all fields" });
    }

    const newTask = {
      id: Date.now().toString(),
      grade,
      classLetter,
      subject,
      description,
      dueDate,
      done: false,
      teacher,
      createdAt: new Date().toISOString()
    };

    database.tasks.push(newTask);
    writeDB(database);

    return res.status(200).json({ message: "Task added!" });
  }

  res.status(405).json({ error: "Method not allowed" });
}
