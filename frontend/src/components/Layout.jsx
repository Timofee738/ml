export default function Layout({ children }) {
  return (
    <div className="feed-bg noise-layer relative min-h-screen w-full px-4 py-8 text-slate-100">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-700/40 bg-slate-900/55 p-6 backdrop-blur-xl md:p-8">
        {children}
      </div>
    </div>
  );
}
