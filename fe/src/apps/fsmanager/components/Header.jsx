import React, { useEffect, useRef, useState } from "react";
import { useFsContext } from "../../../state/FsContext";
import { FaBars, FaUpload } from "react-icons/fa6";
import { BiLeftArrowCircle, BiSearch, BiSelectMultiple } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../../axios/api";
import { toast } from "material-react-toastify";
import { FaTimes } from "react-icons/fa";
import { useStateContext } from "../../../state/StateContext";

const Header = () => {
  const { setIsHidden, getFs, isHidden, key, setKey } = useFsContext();
  const { hostname, runtimeConfig } = useStateContext();
  const navigate = useNavigate();
  const [uProgres, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [isSearching, setIsSearching] = useState(window.innerWidth > 768);
  const searchRef = useRef(null);

  useEffect(() => {
    if (isSearching && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearching]);

  const uploadFiles = async (fsd) => {
    if (files.length > 0 || (fsd || []).length > 0) {
      setIsUploading(true);
      const formData = new FormData();
      for (const file of fsd || files) {
        formData.append("files", file);
      }
      formData.append("dir", location.pathname.replace("/fsexplorer", ""));

      try {
        const res = await api.post("/fs/upload", formData, {
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percent = Math.floor((loaded * 100) / total);
            setProgress(percent);
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success(res.data);
        setFiles([]);
        setTimeout(() => getFs(), 800);
      } catch (err) {
        toast.error(
          <div
            dangerouslySetInnerHTML={{
              __html: `${err?.response?.data || err.message || "" + err}`,
            }}
          ></div>,
        );
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      <nav
        className="navbar flex flex-col gap-3 navbar-expand-lg w-full mb-0 navbar-dark ani slideIn"
        style={{ position: "sticky", top: 12, zIndex: 50 }}
      >
        <div className="w-full mx-auto px-4">
          <div className="bg-[#111] rounded-3xl border border-white/10 shadow-2xl p-4 flex flex-col sm:flex-row lg:items-center gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="rounded-full border border-white/10 p-2 text-white/80 hover:text-white hover:bg-white/10"
                onClick={() => navigate(-1)}
                type="button"
              >
                <BiLeftArrowCircle className="icon" />
              </button>
              <div className="overflow-hidden" onClick={() => navigate("")}>
                <div className="text-xs uppercase tracking-[0.3em] text-gray-500">
                  SprintET
                </div>
                <div className="text-sm font-semibold text-white truncate">
                  File Manager
                </div>
              </div>
            </div>

            <div className="flex flex-1 items-center sm:ms-auto gap-3 min-w-0">
              <div className="flex-1 min-w-0">
                <div className="relative bg-[#0f0f14] border border-white/10 rounded-3xl overflow-hidden w-full max-w-[24rem]">
                  {isSearching ? (
                    <input
                      ref={searchRef}
                      type="search"
                      value={key}
                      className="w-full bg-transparent text-white placeholder:text-white/40 px-4 py-3 focus:outline-none"
                      onChange={({ target }) => setKey(target.value)}
                      placeholder="Search files or folders"
                    />
                  ) : (
                    <button
                      className="flex w-full items-center gap-2 px-4 py-3 text-white/70 hover:text-white"
                      onClick={() => setIsSearching(true)}
                      type="button"
                    >
                      <BiSearch className="icon" />
                      <span className="inline">Search</span>
                    </button>
                  )}
                  {isSearching ? (
                    <button
                      className="absolute right-2 px-1 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                      type="button"
                      onClick={() => {
                        setIsSearching((prev) => !prev);
                        if (isSearching) setKey("");
                      }}
                    >
                      <BiSearch />
                    </button>
                  ) : null}
                </div>
              </div>
              {(localStorage.access || runtimeConfig?.noAuthFsWrite) && (
                <button
                  className="rounded-3xl bg-white/5 border border-white/10 px-4 py-2 text-white hover:bg-white/10 flex items-center gap-2"
                  type="button"
                  onClick={() => {
                    if (isUploading) {
                      return;
                    }
                    if (!files.length) {
                      document.getElementById("filer").click();
                    } else {
                      confirm(
                        `Press "Okay" to upload ${files.length} files to ${hostname}'s computer!`,
                      )
                        ? uploadFiles()
                        : toast(
                            "Operation requires user permission which has been denied",
                          );
                    }
                  }}
                >
                  <FaUpload className="icon" />
                  <span>Upload</span>
                </button>
              )}
              <div className="flex items-center gap-2">
                {!(localStorage.access || runtimeConfig?.noAuthFsWrite) && (
                  <Link
                    to={!localStorage.access ? `/login` : "/admin"}
                    className="rounded-3xl border border-dashed border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10 transition"
                  >
                    authorize to upload
                  </Link>
                )}
                <button
                  className="border border-white/10 rounded-3xl p-2 text-white/80 hover:text-white hover:bg-white/10"
                  type="button"
                  onClick={() => setIsHidden((prev) => !prev)}
                >
                  <FaBars className="icon" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <input
          type="file"
          name="files"
          id="filer"
          multiple
          style={{ opacity: "0", width: "0px", height: "0px" }}
          onChange={({ target }) => {
            setFiles(target.files);
            confirm(
              `Press "Okay" to upload ${target.files.length} files to ${hostname}`,
            )
              ? uploadFiles(target.files)
              : toast(
                  "Operation requires user permission which has been denied",
                );
          }}
        />
      </nav>
      {isUploading && (
        <div className="w-full sticky top-26 z-10 px-4 mt-3">
          <div className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-[#0d0d11] p-3 shadow-2xl">
            <div className="flex items-center justify-between gap-3 text-xs text-white/70 mb-3">
              <span>Uploading files</span>
              <span>{uProgres}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-linear-to-r from-sky-400 via-blue-500 to-violet-500 transition-all duration-300"
                style={{ width: `${uProgres}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
