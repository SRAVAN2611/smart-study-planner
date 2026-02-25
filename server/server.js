import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// ================= DB CONNECT =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// ================= MODELS =================

// USER
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  goal: String,
});

const User = mongoose.model("User", userSchema);


// TASK
const taskSchema = new mongoose.Schema({
  userId: String,
  text: String,
  date: String,
  completed: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);


// ================= AUTH =================

// REGISTER
app.post("/register", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// LOGIN
app.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  res.json(user);
});


// ================= USER =================

// UPDATE GOAL
app.put("/user/:id", async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    { goal: req.body.goal },
    { new: true }
  );
  res.json(updated);
});


// ================= TASKS =================

// GET USER TASKS
app.get("/tasks/:userId", async (req, res) => {
  const tasks = await Task.find({ userId: req.params.userId });
  res.json(tasks);
});

// ADD TASK
app.post("/tasks", async (req, res) => {
  const task = await Task.create(req.body);
  res.json(task);
});

// TOGGLE TASK
app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

// DELETE TASK
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});


app.listen(5000, () =>
  console.log("Server running on port 5000")
);