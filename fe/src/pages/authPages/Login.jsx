import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../../axios/api";
import { Link, useNavigate } from "react-router-dom";
import PlaceHolder from "../../components/PlaceHolder";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useStateContext } from "../../state/StateContext";

const Login = () => {
  const navigate = useNavigate();
  const { hostname } = useStateContext();

  const [data, setData] = useState({
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInput = ({ target }) => {
    setError("");
    setData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Logging in...");
    try {
     const cred = (await api.post("/rq/login", data))?.data;
     localStorage.access = cred.token;
     api.defaults.headers.common["Authorization"] = cred.token;
     const state = localStorage.go;
     localStorage.go = "";
     state ? location.replace(state) : location.replace("/");
    } catch (err) {
      const message = err?.response?.data || err.message || "Login failed";
      setError(message);
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
      <form
        onSubmit={login}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#070808] p-8 shadow-2xl shadow-black/60"
      >
        <div className="flex flex-col items-center gap-4 mb-6 text-center">
          <LazyLoadImage
            effect="opacity"
            placeholder={<PlaceHolder />}
            src="/icon.png"
            className="h-16 w-16 rounded-2xl bg-white/5 p-2"
            alt="SprintET Logo"
          />
          <div>
            <h1 className="text-xl font-semibold text-white">
              Login to {hostname || "FSdiscover"}
            </h1>
            <p className="text-sm text-white/60">
              Enter your FSdiscover password to continue.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleInput}
              required
              autoFocus
              className="w-full rounded-2xl border border-white/10 bg-black/80 px-4 py-3 text-white outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10"
              placeholder="Password"
            />
          </div>
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {typeof error === "string"
                ? error
                : "Login failed. Please try again."}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-5 text-center text-sm text-white/50">
          To check your FSdiscover password, open the terminal and type
          <span className="block mt-2 rounded-2xl bg-white/5 px-3 py-2 text-xs text-white/80">
            fsdiscover --config
          </span>
        </p>

        <div className="mt-6 text-center text-sm text-white/50">
          <Link to="/" className="text-white/80 hover:text-white">
            Back to home
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
