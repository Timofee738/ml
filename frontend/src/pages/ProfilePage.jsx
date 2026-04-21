import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function formatDate(rawDate) {
  if (!rawDate) return "just now";
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return "just now";
  return date.toLocaleString();
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [postLoading, setPostLoading] = useState(true);
  const [postError, setPostError] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await fetch(`${API_URL}/users/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (profileResponse.status === 401) {
          navigate("/login");
          return;
        }
        if (!profileResponse.ok) {
          throw new Error("failed to load profile");
        }

        const profileData = await profileResponse.json();
        setUser(profileData);

        setPostLoading(true);
        const postsResponse = await fetch(`${API_URL}/posts/user_posts`, {
          method: "GET",
          credentials: "include",
        });

        if (postsResponse.status === 401) {
          navigate("/login");
          return;
        }
        if (!postsResponse.ok) {
          throw new Error("failed to load your posts");
        }

        const postsData = await postsResponse.json();
        setMyPosts(Array.isArray(postsData) ? postsData : []);
      } catch (err) {
        if (err.message === "failed to load profile") {
          setError(err.message);
        } else {
          setPostError(err.message || "failed to load your posts");
        }
      } finally {
        setLoading(false);
        setPostLoading(false);
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

  const openDeleteConfirm = (postId) => {
    setDeleteTargetId(postId);
  };

  const closeDeleteConfirm = () => {
    if (isDeleting) return;
    setDeleteTargetId(null);
  };

  const handleDeletePost = async () => {
    if (!deleteTargetId) return;
    setPostError(null);
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/posts/${deleteTargetId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "failed to delete post");
      }

      setMyPosts((prev) => prev.filter((post) => post.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (err) {
      setPostError(err.message || "failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="feed-bg min-h-screen p-8 text-center text-slate-200">loading profile...</div>;
  if (error) return <div className="feed-bg min-h-screen p-8 text-center text-red-300">{error}</div>;
  if (!user) return <div className="feed-bg min-h-screen p-8 text-center text-slate-200">loading profile...</div>;

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

        <div className="mt-6 border-t border-slate-700/50 pt-5">
          <h2 className="mb-3 text-sm font-semibold text-slate-200">my posts</h2>

          {postLoading ? (
            <p className="text-sm text-slate-400">loading posts...</p>
          ) : postError ? (
            <p className="text-sm text-red-300">{postError}</p>
          ) : myPosts.length === 0 ? (
            <p className="text-sm text-slate-400">you have no posts yet.</p>
          ) : (
            <div className="space-y-3">
              {myPosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl border border-slate-700/45 bg-slate-950/40 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs text-slate-400">{formatDate(post.created_at)}</p>
                    <button
                      type="button"
                      onClick={() => openDeleteConfirm(post.id)}
                      className="rounded-lg border border-red-900/60 bg-red-900/20 p-1.5 text-red-300 transition hover:bg-red-900/40"
                      aria-label="delete post"
                      title="delete post"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                    {post.content}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {deleteTargetId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700/70 bg-slate-900/95 p-5 shadow-2xl">
            <h3 className="mb-2 text-base font-semibold text-slate-100">delete post?</h3>
            <p className="mb-4 text-sm text-slate-300">this action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-slate-700/70 bg-slate-950/80 py-2 text-sm text-slate-200 hover:border-slate-500/70 disabled:opacity-60"
              >
                cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-red-900/60 bg-red-900/30 py-2 text-sm font-semibold text-red-200 hover:bg-red-900/50 disabled:opacity-60"
              >
                {isDeleting ? "deleting..." : "delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
