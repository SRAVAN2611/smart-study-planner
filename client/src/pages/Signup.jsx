import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {

    await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    alert("Account created!");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600">

      <div className="bg-white p-8 rounded-xl shadow-lg w-80">

        <h2 className="text-2xl font-bold mb-4 text-center">
          Signup
        </h2>

        <input
          placeholder="Name"
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setName(e.target.value)}
        />

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
          onClick={handleSignup}
          className="w-full bg-purple-600 text-white py-2 rounded"
        >
          Signup
        </button>

        <p className="text-center mt-3">
          Already have account? <a href="/" className="text-purple-600">Login</a>
        </p>

      </div>
    </div>
  );
}

export default Signup;