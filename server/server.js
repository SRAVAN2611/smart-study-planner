import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ================= MONGODB CONNECTION ================= */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ================= AUTH ROUTES ================= */

// Signup
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ message: "User registered" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (user) res.json(user);
  else res.json({ error: "Invalid credentials" });
});

/* ================= TASK MODEL ================= */

const taskSchema = new mongoose.Schema({
  userId: String,
  text: String,
  completed: { type: Boolean, default: false },
  date: String
});

const Task = mongoose.model("Task", taskSchema);

/* ================= TASK ROUTES ================= */

// Tasks for selected date
app.get("/tasks/:userId/:date", async (req, res) => {
  const { userId, date } = req.params;

  const tasks = await Task.find({ userId, date });
  res.json(tasks);
});

// Add task
app.post("/tasks", async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

// Toggle completion
app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);

  task.completed = !task.completed;
  await task.save();

  res.json(task);
});

// Delete task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

/* ⭐ NEW — ALL PENDING TASKS */
app.get("/pending/:userId", async (req, res) => {
  const tasks = await Task.find({
    userId: req.params.userId,
    completed: false
  });

  res.json(tasks);
});

/* ================= START SERVER ================= */

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});