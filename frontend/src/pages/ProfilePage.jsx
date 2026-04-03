import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/users/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else if (response.status === 401) {
          navigate("/login");
        } else {
          throw new Error("failed to load profile");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await fetch(`${API_URL}/users/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  if (loading) return <div className="feed-bg min-h-screen p-8 text-center text-slate-200">loading profile...</div>;
  if (error) return <div className="feed-bg min-h-screen p-8 text-center text-red-300">{error}</div>;

  return (
    <div className="feed-bg noise-layer relative min-h-screen p-4 text-slate-100">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-700/40 bg-slate-900/55 p-7 backdrop-blur-xl">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/20 text-2xl font-semibold text-emerald-200">
            {user.username?.[0] || "u"}
          </div>

          <h1 className="text-xl font-semibold">{user.username}</h1>
          <p className="mb-5 text-sm text-slate-400">{user.email}</p>

          {!user.is_active && (
            <div className="mb-5 w-full rounded-xl border border-yellow-700/60 bg-yellow-900/20 p-3 text-center text-sm text-yellow-300">
              email is not verified.
              <button onClick={() => navigate("/confirm")} className="ml-1 underline">
                verify now
              </button>
            </div>
          )}

          <button
            onClick={() => navigate("/feed")}
            className="mb-3 w-full rounded-xl border border-emerald-700/40 bg-emerald-500/15 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25"
          >
            open feed
          </button>

          <button
            onClick={handleLogout}
            className="w-full rounded-xl border border-red-900/50 bg-red-500/10 py-2 text-sm font-medium text-red-300 hover:bg-red-500/20"
          >
            logout
          </button>
        </div>
      </div>
    </div>
  );
}
