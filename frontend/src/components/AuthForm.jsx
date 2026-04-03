import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function AuthForm() {
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(authData),
      });

      if (response.ok) {
        navigate("/feed");
      } else {
        const data = await response.json();
        throw new Error(data.detail || "login error");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleAuth} className="flex flex-col gap-4">
      {error && <p className="rounded-xl border border-red-900 bg-red-950/40 p-2 text-sm text-red-300">{error}</p>}

      <input
        type="email"
        placeholder="email"
        className="rounded-xl border border-slate-700/70 bg-slate-950/80 p-3 text-slate-100 outline-none transition focus:border-emerald-400/70"
        value={authData.email}
        onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="password"
        className="rounded-xl border border-slate-700/70 bg-slate-950/80 p-3 text-slate-100 outline-none transition focus:border-emerald-400/70"
        value={authData.password}
        onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
      />

      <button
        type="submit"
        className="rounded-xl bg-emerald-400 py-2 font-semibold text-slate-950 transition hover:bg-emerald-300"
      >
        login
      </button>

      <p className="mt-2 text-center text-sm text-slate-400">
        first time here?{" "}
        <Link to="/register" className="text-emerald-300 hover:underline">
          register
        </Link>
      </p>
    </form>
  );
}
