import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.error) {
      alert("Invalid credentials");
    } else {
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">

      <div className="bg-white p-8 rounded-xl shadow-lg w-80">

        <h2 className="text-2xl font-bold mb-4 text-center">
          Login
        </h2>

        <input
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          Login
        </button>

        <p className="text-center mt-3">
          New user? <a href="/signup" className="text-indigo-600">Signup</a>
        </p>

      </div>
    </div>
  );
}

export default Login;