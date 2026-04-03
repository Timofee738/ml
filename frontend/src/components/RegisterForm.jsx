import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function RegisterForm() {
  const [regData, setRegData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(regData),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/confirm");
      } else {
        throw new Error(data.detail || "registration error");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
      {error && <p className="rounded-xl border border-red-900 bg-red-950/40 p-2 text-sm text-red-300">{error}</p>}

      <input
        type="text"
        placeholder="username"
        className="rounded-xl border border-slate-700/70 bg-slate-950/80 p-3 text-slate-100 outline-none transition focus:border-emerald-400/70"
        value={regData.username}
        onChange={(e) => setRegData({ ...regData, username: e.target.value })}
      />

      <input
        type="email"
        placeholder="email"
        className="rounded-xl border border-slate-700/70 bg-slate-950/80 p-3 text-slate-100 outline-none transition focus:border-emerald-400/70"
        value={regData.email}
        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="password"
        className="rounded-xl border border-slate-700/70 bg-slate-950/80 p-3 text-slate-100 outline-none transition focus:border-emerald-400/70"
        value={regData.password}
        onChange={(e) => setRegData({ ...regData, password: e.target.value })}
      />

      <button
        type="submit"
        className="rounded-xl bg-emerald-400 py-2 font-semibold text-slate-950 transition hover:bg-emerald-300"
      >
        create account
      </button>

      <p className="mt-2 text-center text-sm text-slate-400">
        already have account?{" "}
        <Link to="/login" className="text-emerald-300 hover:underline">
          login
        </Link>
      </p>
    </form>
  );
}
