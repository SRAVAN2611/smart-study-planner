import { useState, useEffect } from "react";

function App() {

  const [dark, setDark] = useState(false);

  // 👤 PROFILE STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");
  const [saved, setSaved] = useState(false);

  // 📅 TASK STATES
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // 🌙 Dark Mode Toggle
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // 🔥 FETCH TASKS FROM DATABASE
  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  // Save profile
  const saveProfile = () => {
    if (!name || !email) return;
    setSaved(true);
  };

  // Add task (DB)
  const addTask = async () => {
    if (!task) return;

    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: task })
    });

    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setTask("");
  };

  // Toggle task
  const toggleTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT"
    });

    const updated = await res.json();

    setTasks(tasks.map(t => t._id === id ? updated : t));
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE"
    });

    setTasks(tasks.filter(t => t._id !== id));
  };

  // 📊 Stats
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-gray-900 dark:to-black transition">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white/20 backdrop-blur-xl text-white p-6 shadow-2xl">

        <h1 className="text-2xl font-bold mb-8">
          🚀 Study Planner
        </h1>

        <nav className="space-y-3">
          <p>👤 Profile</p>
          <p>📅 Tasks</p>
          <p>📊 Progress</p>
        </nav>

        <button
          onClick={() => setDark(!dark)}
          className="mt-10 w-full bg-black/40 py-2 rounded hover:bg-black/60"
        >
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 text-black dark:text-white">

        <h2 className="text-3xl font-bold mb-8">
          Welcome 👋
        </h2>

        {/* 👤 PROFILE */}
        <div className="bg-white/70 dark:bg-white/20 backdrop-blur-xl p-6 rounded-xl shadow-xl mb-8 max-w-xl">

          <h3 className="text-xl font-semibold mb-4">
            👤 User Profile
          </h3>

          {!saved ? (

            <div className="space-y-3">

              <input
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white placeholder-gray-600 dark:placeholder-gray-300 outline-none"
              />

              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white placeholder-gray-600 dark:placeholder-gray-300 outline-none"
              />

              <input
                type="text"
                placeholder="Study Goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full p-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white placeholder-gray-600 dark:placeholder-gray-300 outline-none"
              />

              <button
                onClick={saveProfile}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save Profile
              </button>

            </div>

          ) : (

            <div className="space-y-2 text-black dark:text-white">

              <p><b>Name:</b> {name}</p>
              <p><b>Email:</b> {email}</p>
              <p><b>Goal:</b> {goal}</p>

              <button
                onClick={() => setSaved(false)}
                className="mt-3 bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-500"
              >
                Edit Profile
              </button>

            </div>

          )}

        </div>

        {/* 📊 REPORT */}
        <div className="bg-white/70 dark:bg-white/20 backdrop-blur-xl p-6 rounded-xl shadow-xl mb-8 max-w-xl">

          <h3 className="text-xl font-semibold mb-4">
            📊 Productivity Report
          </h3>

          <p>Total Tasks: {total}</p>
          <p>Completed: {completed}</p>
          <p>Pending: {pending}</p>
          <p>Completion: {percent}%</p>

          <div className="w-full bg-gray-300 dark:bg-white/30 rounded h-4 mt-3">
            <div
              className="bg-green-500 h-4 rounded transition-all"
              style={{ width: percent + "%" }}
            ></div>
          </div>

        </div>

        {/* 📅 TASKS */}
        <div className="bg-white/70 dark:bg-white/20 backdrop-blur-xl p-6 rounded-xl shadow-xl max-w-3xl">

          <h3 className="text-xl font-semibold mb-4">
            📅 Today's Tasks
          </h3>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              placeholder="Add new task..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="flex-1 p-2 rounded bg-white text-black dark:bg-gray-700 dark:text-white placeholder-gray-600 dark:placeholder-gray-300 outline-none"
            />

            <button
              onClick={addTask}
              className="bg-indigo-700 text-white px-4 rounded hover:bg-indigo-800"
            >
              Add Task
            </button>
          </div>

          <ul className="space-y-2">
            {tasks.map((t) => (
              <li
                key={t._id}
                className="flex justify-between items-center p-3 rounded bg-gray-200 dark:bg-white/30 hover:bg-gray-300 dark:hover:bg-white/40 transition"
              >
                <div>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTask(t._id)}
                    className="accent-indigo-600"
                  />

                  <span className={`ml-2 ${t.completed ? "line-through opacity-60" : ""}`}>
                    {t.text}
                  </span>
                </div>

                <button
                  onClick={() => deleteTask(t._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>

        </div>

      </main>

    </div>
  );
}

export default App;