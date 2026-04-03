import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function formatDate(rawDate) {
  if (!rawDate) return "just now";
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return "just now";
  return date.toLocaleString();
}

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setError("");
    try {
      const response = await fetch(`${API_URL}/posts/all`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("failed to load feed");
      }
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "failed to load feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async (event) => {
    event.preventDefault();
    setError("");
    if (!content.trim()) {
      setError("post text cannot be empty");
      return;
    }

    setIsPublishing(true);
    try {
      const response = await fetch(`${API_URL}/posts/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content: content.trim(),
          image_url: imageUrl.trim() || null,
        }),
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "failed to create post");
      }

      setContent("");
      setImageUrl("");
      await fetchPosts();
    } catch (err) {
      setError(err.message || "failed to create post");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="feed-bg noise-layer relative min-h-screen text-slate-100">
      <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 md:px-8 md:pb-16">
        <header className="mb-7 flex items-center justify-between">
          <div className="rounded-full border border-emerald-400/40 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur">
            frl feed + ai
          </div>
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/profile" className="rounded-full border border-slate-700/70 bg-slate-900/50 px-4 py-2 hover:border-emerald-400/40 hover:text-emerald-200">
              profile
            </Link>
            <Link to="/login" className="rounded-full border border-slate-700/70 bg-slate-900/50 px-4 py-2 hover:border-emerald-400/40 hover:text-emerald-200">
              login
            </Link>
          </nav>
        </header>

        <section className="mb-7">
          <div className="mb-2 inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs tracking-wide text-emerald-300">
            your media stream
          </div>
          <h1 className="mb-2 max-w-2xl text-2xl font-semibold leading-tight text-slate-100 md:text-3xl">
            feed posts
          </h1>
          <p className="max-w-2xl text-sm text-slate-300/90 md:text-base">
            publish content, read fresh posts and grow your media project with transparent ai moderation.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.35fr]">
          <section className="rounded-3xl border border-slate-700/40 bg-slate-900/50 p-5 backdrop-blur-xl">
            <h2 className="mb-4 text-lg font-semibold text-slate-100">create post</h2>
            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="what do you want to share?"
                className="min-h-32 w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 p-4 text-sm outline-none transition focus:border-emerald-400/70"
                maxLength={5000}
              />
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="image url (optional)"
                className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 p-4 text-sm outline-none transition focus:border-emerald-400/70"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">{content.length}/5000</p>
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="rounded-xl bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
                >
                  {isPublishing ? "publishing..." : "publish"}
                </button>
              </div>
            </form>

            <div className="mt-5 rounded-2xl border border-slate-700/50 bg-slate-950/60 p-4 text-sm text-slate-300">
              ai moderation checks every post. if spam score is high, send it to manual review.
            </div>
          </section>

          <section className="space-y-4">
            {error && (
              <div className="rounded-2xl border border-red-900 bg-red-950/40 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {loading ? (
              <p className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 text-sm text-slate-300">
                loading feed...
              </p>
            ) : posts.length === 0 ? (
              <div className="rounded-3xl border border-slate-700/40 bg-slate-900/50 p-6 text-center text-sm text-slate-300">
                no posts yet. create your first post.
              </div>
            ) : (
              posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-3xl border border-slate-700/45 bg-slate-900/55 p-5 backdrop-blur-xl"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20 text-sm font-semibold text-emerald-200">
                        {(post.author?.username || "u").slice(0, 1)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-100">
                          {post.author?.username || `user #${post.user_id}`}
                        </p>
                        <p className="text-xs text-slate-400">{formatDate(post.created_at)}</p>
                      </div>
                    </div>
                    {typeof post.spam_score === "number" && (
                      <div className="rounded-full border border-slate-600/70 bg-slate-950/70 px-3 py-1 text-xs text-slate-300">
                        spam score: {post.spam_score.toFixed(2)}
                      </div>
                    )}
                  </div>

                  <p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{post.content}</p>
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt="post visual"
                      className="max-h-[28rem] w-full rounded-2xl border border-slate-700/60 object-cover"
                      loading="lazy"
                    />
                  )}
                </article>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
