import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function EmailConfirmPage() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("confirming email...");
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      const query = new URLSearchParams(window.location.search);
      const token = query.get("token");

      if (!token) {
        setStatus("error");
        setMessage("token not found");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/users/confirm?token=${token}`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          setStatus("success");
          setMessage("email confirmed, opening profile...");
          setTimeout(() => {
            navigate("/profile");
          }, 1500);
        } else {
          const data = await response.json();
          throw new Error(data.detail || "confirmation error");
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.message);
      }
    };

    confirmEmail();
  }, [navigate]);

  return (
    <div className="feed-bg noise-layer relative flex min-h-screen items-center justify-center p-4 text-slate-100">
      <div className="w-full max-w-sm rounded-3xl border border-slate-700/40 bg-slate-900/55 p-8 text-center backdrop-blur-xl">
        <h1 className="mb-4 text-xl font-semibold">email confirmation</h1>

        {status === "loading" && (
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-b-2 border-emerald-400"></div>
        )}

        {status === "success" && <div className="mb-4 text-4xl text-emerald-400">ok</div>}
        {status === "error" && <div className="mb-4 text-4xl text-red-400">x</div>}

        <p className={`text-sm ${status === "error" ? "text-red-300" : "text-slate-300"}`}>{message}</p>
      </div>
    </div>
  );
}
