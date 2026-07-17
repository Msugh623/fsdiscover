import React, { useState, useCallback, useRef, useEffect } from "react";
import api from "../../axios/api";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlaceHolder from "../components/PlaceHolder";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaCloudArrowUp,
  FaFileLines,
  FaXmark,
  FaCheck,
  FaShieldHalved,
} from "react-icons/fa6";
import { useStateContext } from "../state/StateContext";

export default function SafeMode() {
  const { hostname } = useStateContext();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef(null);
  const [safemodeDir, _] = useState("/");

  const handleFile = (f) => {
    setStatus("");
    if (!f) return setFiles([]);
    let list = [];
    if (f instanceof FileList) list = Array.from(f);
    else if (Array.isArray(f)) list = f;
    else list = [f];
    if (list.length > 20) {
      setFiles(list.slice(0, 20));
      setStatus("Limited to 20 files, extra files were ignored");
    } else {
      setFiles(list);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedList = e.dataTransfer?.files;
    if (droppedList && droppedList.length) handleFile(droppedList);
  }, []);


  const handleUpload = async (e) => {
    e && e.preventDefault();
    if (!files || files.length === 0)
      return setStatus("Select at least one file first");

    setIsUploading(true);
    setUploadProgress(0);
    setStatus("Uploading...");

    try {
      const fd = new FormData();
      for (const f of files.slice(0, 20)) {
        fd.append("files", f);
      }
      fd.append("dir", safemodeDir || "/");
      const res = await api.post("/fs/upload", fd, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        },
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(res?.data?.message || "Upload complete");
      setFiles([]);
      setUploadProgress(0);
    } catch (err) {
      setStatus(err?.response?.data || err.message || "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const loggedIn = !!(
    typeof localStorage !== "undefined" && localStorage.access
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 py-12 text-white selection:bg-white/30">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,transparent_100%)]" />

      <button
        onClick={() => navigate("/login")}
        className="fixed top-6 right-6 z-40 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-md transition hover:bg-white/10"
      >
        Sign In
      </button>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 shadow-lg backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
      >
        <FaShieldHalved />
        Safe Mode
      </button>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#111] p-6 shadow-2xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-blue-400">
                <FaShieldHalved size={24} />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                About Safe Mode
              </h3>
              <p className="mb-6 text-sm font-light leading-relaxed text-white/60">
                This FSdiscover node is currently operating in Safe Mode to
                protect the local network. Access is heavily restricted to
                secure file uploads only.
                <br />
                <br />
                Once you sign in with proper credentials, Safe Mode will
                automatically disengage and reveal the full FSdiscover
                interface.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full rounded-2xl bg-white py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="slideUp z-10 w-full max-w-xl text-center">
        <LazyLoadImage
          effect="opacity"
          placeholder={<PlaceHolder />}
          src="/icon.png"
          height={64}
          alt="SprintET FSdiscover"
          className="mx-auto rounded-2xl mb-8 h-16 w-16 object-contain"
        />

        <h1 className="mb-2 text-3xl font-light tracking-tight sm:text-4xl pt-3">
          FSdiscover
        </h1>
        <p className="mb-10 text-lg font-light text-white/50">
          Secure dropzone files to send to "{hostname}".
        </p>

        {!loggedIn ? (
          <div className="mx-auto w-full max-w-md">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ${
                isDragging
                  ? "border-blue-500 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,0.2)]"
                  : files.length
                    ? "border-white/20 bg-white/5"
                    : "border-white/10 bg-white/2 hover:border-white/30 hover:bg-white/5"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                onChange={(e) => handleFile(e.target.files)}
                className="hidden"
              />

              <AnimatePresence mode="wait">
                {!files.length ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center gap-4 p-8 text-white/50"
                  >
                    <div
                      className={`rounded-full bg-white/5 p-6 transition-transform duration-300 ${isDragging ? "scale-110 text-blue-500" : ""}`}
                    >
                      <FaCloudArrowUp size={48} />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-white/80">
                        Click to Select files
                      </p>
                      <p className="text-sm">or drag and drop files here</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="files"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex w-full flex-col items-center p-6"
                  >
                    <div className="mb-4 rounded-2xl bg-white/10 p-4">
                      <FaFileLines size={36} className="text-blue-400" />
                    </div>
                    <p className="text-lg font-medium text-white">
                      {files.length} file{files.length > 1 ? "s" : ""} selected
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      {formatSize(files.reduce((s, f) => s + f.size, 0))}
                    </p>
                    <div className="mt-3 max-h-28 w-full overflow-auto text-left text-sm text-white/70">
                      {files.map((f, idx) => (
                        <div key={idx} className="truncate">
                          {f.name}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="flex gap-3 overflow-hidden"
                >
                  {!isUploading ? (
                    <>
                      <button
                        onClick={() => setFiles([])}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/10 py-4 text-sm font-medium text-white transition hover:bg-white/20"
                      >
                        <FaXmark size={16} />
                        Cancel
                      </button>
                      <button
                        onClick={handleUpload}
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        <FaCloudArrowUp size={16} />
                        Upload File
                      </button>
                    </>
                  ) : (
                    <div className="relative flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-white/5">
                      <motion.div
                        className="absolute bottom-0 left-0 top-0 bg-blue-600/40"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ ease: "linear" }}
                      />
                      <span className="relative z-10 text-sm font-medium text-white animate-pulse">
                        Transferring {uploadProgress}%
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-6 flex items-center justify-center gap-2 text-sm ${
                    status.includes("failed") ||
                    status.includes("first") ||
                    status.includes("Limited")
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {!isUploading &&
                    !status.includes("failed") &&
                    !status.includes("Limited") && <FaCheck />}
                  {status}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <p className="text-white/80">
              You are signed in. Full system access is available.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
