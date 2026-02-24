import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Dashboard() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [dark, setDark] = useState(false);
  const [date, setDate] = useState(new Date());
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [goal, setGoal] = useState("");
  const [saved, setSaved] = useState(false);

  const selectedDate = date.toISOString().split("T")[0];

  // Load tasks for selected date
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/tasks/${user._id}/${selectedDate}`)
      .then(res => res.json())
      .then(data => setTasks(data));
  }, [date]);

  // Load all pending tasks
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5000/pending/${user._id}`)
      .then(res => res.json())
      .then(data => setPendingTasks(data));
  }, [tasks]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const addTask = async () => {
    if (!task) return;

    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user._id,
        text: task,
        date: selectedDate
      })
    });

    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTask("");
  };

  const toggleTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT"
    });

    const updated = await res.json();
    setTasks(tasks.map(t => t._id === id ? updated : t));
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE"
    });

    setTasks(tasks.filter(t => t._id !== id));
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const chartData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        label: "Tasks",
        data: [completed, pending],
        backgroundColor: ["#4ade80", "#f87171"]
      }
    ]
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

        {/* SIDEBAR */}
        <aside className="w-64 bg-indigo-700 p-6 text-white">

          <h1 className="text-2xl font-bold mb-8">📘 Planner</h1>

          <button
            onClick={() => setDark(!dark)}
            className="bg-black/30 px-3 py-1 rounded mb-6"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>

          <nav className="space-y-3">
            <p>👤 Profile</p>
            <p>📅 Tasks</p>
            <p>📊 Analytics</p>
            <p>🗓️ Calendar</p>
          </nav>

        </aside>

        {/* MAIN */}
        <main className="flex-1 p-8">

          {/* HEADER */}
          <div className="flex justify-between mb-8">
            <h1 className="text-3xl font-bold">
              Welcome {user?.name}
            </h1>

            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded text-white"
            >
              Logout
            </button>
          </div>

          {/* PROFILE + REPORT */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* PROFILE */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h2 className="font-bold mb-3">👤 Profile</h2>

              {!saved ? (
                <>
                  <input
                    placeholder="Study Goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full p-2 border rounded mb-2 text-black"
                  />

                  <button
                    onClick={() => setSaved(true)}
                    className="bg-green-500 text-white px-4 py-1 rounded"
                  >
                    Save
                  </button>
                </>
              ) : (
                <p>Goal: {goal}</p>
              )}
            </div>

            {/* REPORT */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
              <h2 className="font-bold mb-3">📊 Report</h2>

              <p>Total: {total}</p>
              <p>Completed: {completed}</p>
              <p>Pending: {pending}</p>
              <p>Completion: {percent}%</p>

              <div className="w-full bg-gray-300 h-4 mt-2 rounded">
                <div
                  className="bg-green-500 h-4 rounded"
                  style={{ width: percent + "%" }}
                ></div>
              </div>
            </div>

          </div>

          {/* CALENDAR */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mt-6 max-w-xl">
            <h2 className="font-bold mb-4">🗓️ Select Study Date</h2>

            <Calendar onChange={setDate} value={date} />

            <p className="mt-3">Selected: {selectedDate}</p>
          </div>

          {/* TASKS */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mt-6 max-w-3xl">
            <h2 className="font-bold mb-4">
              📅 Tasks for {selectedDate}
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="New task"
                className="flex-1 p-2 border rounded text-black"
              />

              <button
                onClick={addTask}
                className="bg-indigo-600 text-white px-4 rounded"
              >
                Add
              </button>
            </div>

            <ul className="space-y-2">
              {tasks.map(t => (
                <li
                  key={t._id}
                  className="flex justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded"
                >
                  <div>
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTask(t._id)}
                    />
                    <span className="ml-2">{t.text}</span>
                  </div>

                  <button
                    onClick={() => deleteTask(t._id)}
                    className="text-red-500"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ANALYTICS */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mt-6 max-w-xl">
            <h2 className="font-bold mb-4">📊 Analytics</h2>
            <Bar data={chartData} />
          </div>

          {/* ⭐ ALL PENDING TASKS */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mt-6 max-w-3xl">

            <h2 className="font-bold mb-4">
              ⏳ All Pending Tasks
            </h2>

            {pendingTasks.length === 0 ? (
              <p>No pending tasks 🎉</p>
            ) : (
              <ul className="space-y-2">
                {pendingTasks.map(t => (
                  <li
                    key={t._id}
                    className="p-3 bg-gray-100 dark:bg-gray-700 rounded"
                  >
                    <p className="font-medium">{t.text}</p>
                    <p className="text-sm opacity-70">
                      📅 {t.date}
                    </p>
                  </li>
                ))}
              </ul>
            )}

          </div>

        </main>

      </div>
    </div>
  );
}

export default Dashboard;