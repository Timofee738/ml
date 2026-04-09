import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function formatDate(rawDate) {
  if (!rawDate) return "just now";
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return "just now";
  return date.toLocaleString();
}

export default function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const resolveImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${API_URL}${imagePath}`;
  };

  useEffect(() => {
    const fetchPost = async () => {
      setError("");
      try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 404) {
          setError("post not found");
          return;
        }
        if (!response.ok) {
          throw new Error("failed to load post");
        }

        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err.message || "failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <div className="feed-bg noise-layer relative min-h-screen text-slate-100">
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-6 md:px-8">
        <header className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full border border-slate-700/70 bg-slate-900/50 px-4 py-2 text-sm hover:border-emerald-400/40 hover:text-emerald-200"
          >
            back
          </button>
          <Link
            to="/feed"
            className="rounded-full border border-slate-700/70 bg-slate-900/50 px-4 py-2 text-sm hover:border-emerald-400/40 hover:text-emerald-200"
          >
            feed
          </Link>
        </header>

        {loading ? (
          <div className="rounded-3xl border border-slate-700/40 bg-slate-900/55 p-6 text-sm text-slate-300">
            loading post...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-900 bg-red-950/40 p-6 text-sm text-red-300">{error}</div>
        ) : (
          <article className="rounded-3xl border border-slate-700/45 bg-slate-900/55 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400/20 text-base font-semibold text-emerald-200">
                {(post.author?.username || "u").slice(0, 1)}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-100">{post.author?.username || `user #${post.user_id}`}</p>
                <p className="text-xs text-slate-400">{formatDate(post.created_at)}</p>
              </div>
            </div>

            <p className="mb-4 whitespace-pre-wrap text-base leading-relaxed text-slate-200">{post.content}</p>
            {post.image_url && (
              <img
                src={resolveImageUrl(post.image_url)}
                alt="post visual"
                className="max-h-[34rem] w-full rounded-2xl border border-slate-700/60 object-cover"
                loading="lazy"
              />
            )}
          </article>
        )}
      </div>
    </div>
  );
}
