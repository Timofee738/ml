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
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likeInProgressId, setLikeInProgressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const navigate = useNavigate();

  const resolveImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${API_URL}${imagePath}`;
  };

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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${API_URL}/users/profile`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentUserId(data.id);
        }
      } catch {
        setCurrentUserId(null);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleCreatePost = async (event) => {
    event.preventDefault();
    setError("");
    if (!content.trim()) {
      setError("post text cannot be empty");
      return;
    }

    setIsPublishing(true);
    try {
      const formData = new FormData();
      const normalizedContent = content.trim();
      const autoTitle = normalizedContent.length > 80 ? `${normalizedContent.slice(0, 80)}...` : normalizedContent;
      formData.append("title", autoTitle);
      formData.append("content", normalizedContent);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch(`${API_URL}/posts/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
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
      setSelectedImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }
      await fetchPosts();
    } catch (err) {
      setError(err.message || "failed to create post");
    } finally {
      setIsPublishing(false);
    }
  };

  const openDeleteConfirm = (event, postId) => {
    event.stopPropagation();
    setDeleteTargetId(postId);
  };

  const closeDeleteConfirm = () => {
    if (isDeleting) return;
    setDeleteTargetId(null);
  };

  const handleDeletePost = async () => {
    if (!deleteTargetId) return;

    setError("");
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

      setPosts((prev) => prev.filter((post) => post.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (err) {
      setError(err.message || "failed to delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleLike = async (event, post) => {
    event.stopPropagation();
    if (likeInProgressId !== null) return;

    const wasLiked = Boolean(post.liked_by_me);
    const endpoint = wasLiked ? "unlike" : "like";

    setLikeInProgressId(post.id);
    setPosts((prev) =>
      prev.map((item) =>
        item.id === post.id
          ? {
              ...item,
              liked_by_me: !wasLiked,
              likes_count: Math.max(0, (item.likes_count || 0) + (wasLiked ? -1 : 1)),
            }
          : item,
      ),
    );

    try {
      const response = await fetch(`${API_URL}/posts/${post.id}/${endpoint}`, {
        method: "POST",
        credentials: "include",
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "failed to update like");
      }

      const payload = await response.json().catch(() => ({}));
      setPosts((prev) =>
        prev.map((item) =>
          item.id === post.id
            ? {
                ...item,
                liked_by_me: Boolean(payload.liked_by_me),
                likes_count: Number.isFinite(payload.likes_count) ? payload.likes_count : item.likes_count || 0,
              }
            : item,
        ),
      );
    } catch (err) {
      setPosts((prev) =>
        prev.map((item) =>
          item.id === post.id
            ? {
                ...item,
                liked_by_me: wasLiked,
                likes_count: Math.max(0, (item.likes_count || 0) + (wasLiked ? 1 : -1)),
              }
            : item,
        ),
      );
      setError(err.message || "failed to update like");
    } finally {
      setLikeInProgressId(null);
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
              <div className="space-y-2">
                <label className="inline-block cursor-pointer rounded-xl border border-slate-700/70 bg-slate-950/80 px-4 py-2 text-sm text-slate-200 hover:border-emerald-400/60">
                  upload image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setSelectedImage(file);
                      if (previewUrl) {
                        URL.revokeObjectURL(previewUrl);
                      }
                      setPreviewUrl(file ? URL.createObjectURL(file) : "");
                    }}
                  />
                </label>
                {selectedImage && (
                  <p className="text-xs text-slate-400">selected: {selectedImage.name}</p>
                )}
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="max-h-56 w-full rounded-xl border border-slate-700/60 object-cover"
                  />
                )}
              </div>
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
                  onClick={() => navigate(`/posts/${post.id}`)}
                  className="cursor-pointer rounded-3xl border border-slate-700/45 bg-slate-900/55 p-5 backdrop-blur-xl transition hover:border-emerald-400/40"
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
                    {currentUserId === post.user_id && (
                      <button
                        type="button"
                        onClick={(event) => openDeleteConfirm(event, post.id)}
                        className="rounded-lg border border-red-900/60 bg-red-900/20 p-2 text-red-300 transition hover:bg-red-900/40"
                        aria-label="delete post"
                        title="delete post"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <p className="mb-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{post.content}</p>
                  {post.image_url && (
                    <img
                      src={resolveImageUrl(post.image_url)}
                      alt="post visual"
                      className="max-h-[28rem] w-full rounded-2xl border border-slate-700/60 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(event) => handleToggleLike(event, post)}
                      disabled={likeInProgressId === post.id}
                      className={`rounded-xl border px-3 py-1.5 text-sm transition ${
                        post.liked_by_me
                          ? "border-emerald-500/60 bg-emerald-500/20 text-emerald-200"
                          : "border-slate-700/70 bg-slate-950/70 text-slate-300 hover:border-emerald-400/50"
                      } disabled:opacity-60`}
                    >
                      {post.liked_by_me ? "unlike" : "like"}
                    </button>
                    <span className="text-xs text-slate-400">likes: {post.likes_count || 0}</span>
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      </div>

      {deleteTargetId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700/70 bg-slate-900/95 p-5 shadow-2xl">
            <h3 className="mb-2 text-base font-semibold text-slate-100">delete post?</h3>
            <p className="mb-4 text-sm text-slate-300">
              this action cannot be undone.
            </p>
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
