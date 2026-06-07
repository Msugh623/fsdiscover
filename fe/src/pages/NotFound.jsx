import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBomb, FaHome, FaSearch } from "react-icons/fa";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <main className="bg-black min-h-screen text-white antialiased selection:bg-white/20">
      <style></style>
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center w-40 h-40 ">
            <image src="/icon.png" className="w-40 h-40" />
          </div>

          {/* floating shards */}
          <div className="pointer-events-none">
            <div
              className="shard"
              style={{
                top: "18%",
                left: "-5%",
                background: "rgba(255,235,59,0.15)",
                animation: "slideShard 6s linear infinite",
              }}
            />
            <div
              className="shard"
              style={{
                top: "35%",
                left: "-10%",
                width: 10,
                height: 10,
                background: "rgba(255,99,132,0.12)",
                animation: "slideShard 7s linear infinite",
                animationDelay: "0.8s",
              }}
            />
            <div
              className="shard"
              style={{
                top: "60%",
                left: "-8%",
                width: 6,
                height: 6,
                background: "rgba(255,255,255,0.06)",
                animation: "slideShard 5.5s linear infinite",
                animationDelay: "0.3s",
              }}
            />
            <div
              className="shard"
              style={{
                top: "80%",
                left: "-6%",
                width: 14,
                height: 14,
                background: "rgba(99,102,241,0.08)",
                animation: "slideShard 8s linear infinite",
                animationDelay: "1.2s",
              }}
            />
          </div>

          <h1 className="text-6xl sm:text-7xl font-bold mb-4">404</h1>
          <p className="text-lg text-white/70 mb-6">
            Oops — we couldn't find that page. It may have been moved or never
            existed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl transition"
            >
              Go back
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl font-medium"
            >
              <FaHome /> Home
            </Link>

            <Link
              to="/fsexplorer"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-xl transition"
            >
              <FaSearch /> Explore files
            </Link>
          </div>

          <div className="mt-8 text-sm text-white/50">
            If you think this is an error, try refreshing or head back to the
            homepage.
          </div>
        </div>
      </section>
    </main>
  );
}
