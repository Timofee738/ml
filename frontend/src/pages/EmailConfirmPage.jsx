import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function EmailConfirmPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [tokenInput, setTokenInput] = useState("");
  const [emailInput, setEmailInput] = useState(
    location.state?.email || localStorage.getItem("pending_confirm_email") || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("enter 6-digit code from your email");

  const confirmEmail = async (e) => {
    e.preventDefault();
    setStatus("idle");
    setMessage("");

    if (!/^\d{6}$/.test(tokenInput)) {
      setStatus("error");
      setMessage("please enter 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/confirm?token=${tokenInput}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setStatus("success");
        setMessage("email confirmed, redirecting...");
        localStorage.removeItem("pending_confirm_email");
        setTimeout(() => navigate("/profile"), 1200);
        return;
      }

      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || "confirmation failed");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "confirmation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resendEmail = async () => {
    setStatus("idle");
    setMessage("");

    if (!emailInput.trim()) {
      setStatus("error");
      setMessage("enter your email for resend");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/users/resend-confirmation?email=${encodeURIComponent(emailInput.trim())}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        setStatus("success");
        setMessage("code sent, check your email");
        localStorage.setItem("pending_confirm_email", emailInput.trim());
        return;
      }

      const data = await response.json().catch(() => ({}));
      throw new Error(data.detail || "resend failed");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "resend failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="feed-bg noise-layer relative flex min-h-screen items-center justify-center p-4 text-slate-100">
      <div className="w-full max-w-sm rounded-3xl border border-slate-700/40 bg-slate-900/55 p-8 backdrop-blur-xl">
        <h1 className="mb-4 text-center text-xl font-semibold">email confirmation</h1>

        <form onSubmit={confirmEmail} className="space-y-3">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="email for resend"
            className="w-full rounded-xl border border-slate-700/70 bg-slate-950/80 p-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/70"
          />
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-digit code"
            className="w-full rounded-xl border border-slate-700/70 bg-slate-950/80 p-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400/70"
          />

          <button
            type="submit"
            disabled={isLoading || tokenInput.length !== 6}
            className="w-full rounded-xl bg-emerald-400 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "checking..." : "confirm email"}
          </button>
        </form>

        <button
          onClick={resendEmail}
          disabled={isLoading}
          className="mt-3 w-full rounded-xl border border-slate-700/70 bg-slate-950/80 py-2 text-sm text-slate-200 transition hover:border-emerald-400/70 disabled:opacity-60"
        >
          resend code
        </button>

        <p
          className={`mt-4 text-center text-sm ${
            status === "error" ? "text-red-300" : status === "success" ? "text-emerald-300" : "text-slate-300"
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
}
