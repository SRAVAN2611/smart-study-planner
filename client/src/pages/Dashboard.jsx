import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import {
  FaUser,
  FaChartBar,
  FaCalendar,
  FaSun,
  FaMoon,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Dashboard() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(storedUser);
  const [tasks, setTasks] = useState([]);
  const [goal, setGoal] = useState(storedUser?.goal || "");
  const [newTask, setNewTask] = useState("");
  const [date, setDate] = useState(new Date());
  const [dark, setDark] = useState(true);

  // ================= LOAD TASKS =================
  useEffect(() => {
    fetch(`http://localhost:5000/tasks/${user._id}`)
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  // ================= ADD TASK =================
  const addTask = async () => {
    if (!newTask.trim()) return;

    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTask,
        date: date.toISOString().split("T")[0],
        userId: user._id,
      }),
    });

    const data = await res.json();
    setTasks([...tasks, data]);
    setNewTask("");
  };

  // ================= TOGGLE TASK =================
  const toggleTask = async id => {
    const res = await fetch(
      `http://localhost:5000/tasks/${id}`,
      { method: "PUT" }
    );
    const updated = await res.json();

    setTasks(tasks.map(t => (t._id === id ? updated : t)));
  };

  // ================= SAVE GOAL =================
  const saveGoal = async () => {
    const res = await fetch(
      `http://localhost:5000/user/${user._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal }),
      }
    );

    const updatedUser = await res.json();

    // UPDATE UI + LOCAL STORAGE
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Goal updated successfully 🎯");
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // ================= FILTER TASKS =================
  const selectedDate = date.toISOString().split("T")[0];
  const tasksForDate = tasks.filter(t => t.date === selectedDate);

  // ================= REPORT =================
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  const percent =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  // Efficiency Rating
  let efficiency = "Poor";
  if (percent >= 80) efficiency = "Excellent 🔥";
  else if (percent >= 50) efficiency = "Good 👍";
  else if (percent >= 30) efficiency = "Average 🙂";

  // ALL PENDING TASKS SORTED BY DATE
  const allPendingTasks = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // CHART DATA
  const chartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [completed, pending],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div
      className={
        dark
          ? "dark bg-slate-900 text-white min-h-screen"
          : "bg-gray-100 min-h-screen"
      }
    >
      <div className="flex">

        {/* SIDEBAR */}
        <aside className="w-60 bg-indigo-700 text-white p-5 space-y-4 min-h-screen">
          <h1 className="text-xl font-bold">📘 Planner</h1>

          <p className="flex items-center gap-2">
            <FaUser /> Profile
          </p>
          <p className="flex items-center gap-2">
            <FaCalendar /> Planner
          </p>
          <p className="flex items-center gap-2">
            <FaChartBar /> Analytics
          </p>

          <button
            onClick={() => setDark(!dark)}
            className="bg-black/30 px-3 py-2 rounded flex items-center gap-2"
          >
            {dark ? <FaSun /> : <FaMoon />} Theme
          </button>

          <button
            onClick={logout}
            className="bg-red-500 px-3 py-2 rounded flex items-center gap-2 mt-4"
          >
            <FaSignOutAlt /> Logout
          </button>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6 space-y-6">

          {/* PROFILE */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow text-black dark:text-white">
            <h2 className="font-bold mb-2">👤 Profile</h2>

            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>

            <input
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="Set study goal"
              className="border px-3 py-2 mt-2 rounded w-full text-black"
            />

            <button
              onClick={saveGoal}
              className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Save Goal
            </button>

            <p className="mt-2">
              🎯 Current Goal:{" "}
              <span className="font-semibold">
                {user.goal || "Not set"}
              </span>
            </p>
          </div>

          {/* REPORT */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow text-black dark:text-white">
            <h2 className="font-bold mb-2">📊 Report</h2>

            <p>Total Tasks: {total}</p>
            <p>Completed: {completed}</p>
            <p>Pending: {pending}</p>

            <p className="font-bold">
              Completion: {percent}%
            </p>

            <p className="mt-2 text-lg">
              Efficiency:{" "}
              <span className="font-bold">
                {efficiency}
              </span>
            </p>
          </div>

          {/* CALENDAR + TASKS */}
          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow">
              <Calendar onChange={setDate} value={date} />
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow text-black dark:text-white">

              <div className="flex gap-2 mb-3">
                <input
                  value={newTask}
                  onChange={e => setNewTask(e.target.value)}
                  placeholder="New task"
                  className="flex-1 border px-3 py-2 rounded text-black"
                />

                <button
                  onClick={addTask}
                  className="bg-indigo-600 text-white px-4 rounded"
                >
                  Add
                </button>
              </div>

              {tasksForDate.map(task => (
                <div
                  key={task._id}
                  className="flex justify-between bg-gray-200 dark:bg-gray-700 p-2 rounded mb-2"
                >
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task._id)}
                    />

                    <span
                      className={task.completed ? "line-through" : ""}
                    >
                      {task.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ALL PENDING TASKS */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow text-black dark:text-white">
            <h2 className="font-bold mb-3">
              ⏳ All Pending Tasks
            </h2>

            {allPendingTasks.length === 0 ? (
              <p>No pending tasks 🎉</p>
            ) : (
              allPendingTasks.map(task => (
                <div
                  key={task._id}
                  className="flex justify-between bg-yellow-100 dark:bg-yellow-900 p-3 rounded mb-2"
                >
                  <span>
                    📌 {task.text} — {task.date}
                  </span>

                  <button
                    onClick={() => toggleTask(task._id)}
                    className="bg-green-500 px-3 rounded text-white"
                  >
                    Done
                  </button>
                </div>
              ))
            )}
          </div>

          {/* ANALYTICS */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow text-black dark:text-white">
            <h2 className="font-bold mb-2">📊 Analytics</h2>
            <Bar data={chartData} />
          </div>

        </main>
      </div>
    </div>
  );
}