import React, { useState } from "react";
import { useFsContext } from "../../../state/FsContext";
import { FaBars, FaUpload } from "react-icons/fa6";
import { BiLeftArrowCircle, BiSearch, BiSelectMultiple } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../../axios/api";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { useStateContext } from "../../../state/StateContext";

const Header = () => {
  const { setIsHidden, getFs, isHidden, key, setKey } = useFsContext();
  const { hostname, runtimeConfig } = useStateContext();
  const navigate = useNavigate();
  const [uProgres, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [isSearching, setIsSearching] = useState(window.innerWidth > 1280);

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
          ></div>
        );
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      <nav
        className="navbar flex-column gap-2 navbar-expand-lg mb-0 navbar-dark themebg ani slideIn shadow-sm"
        style={{ position: "sticky", top: 0, zIndex: 1 }}
      >
        <div className="w-100 nav">
          {isHidden && !isSearching && window.innerWidth < 400 && (
            <h2 className="h4 mt-auto slideUp mx-4 ms-4  pb-2 mb-4 border-bottom d-flex">
              <Link to={"/"} className="text-light mt-auto  fw-bold fs-5">
                {hostname}
              </Link>
              <div className="mt-auto ms-2"> - File Manager</div>
            </h2>
          )}
          {window.innerWidth < 400 && (
            <>
              <div
                className="ms-auto w-auto d-flex my-auto  p-1 form-group border rounded me-2"
                style={{
                  maxWidth: "98vw",
                }}
              >
                {isSearching && (
                  <input
                    type="search"
                    autoFocus
                    value={key}
                    className="rounded input px-1 no-dec bg-none themebg"
                    onChange={({ target }) => setKey(target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                    }}
                  />
                )}
                <button
                  className="themebg border-0 border-start px-2 border my-auto text-light"
                  onClick={() => {
                    setIsSearching((prev) => !prev);
                    setKey("");
                  }}
                >
                  <BiSearch />
                </button>
              </div>
              <div className="me-1"></div>
            </>
          )}
        </div>
        <div className="container-fluid">
          <div
            className={`w-100 d-flex ${false ? "d-none" : ""}`}
            id="navbarNav"
          >
            <a
              className="nav-link my-auto fs-3 border-end px-2 pe-3"
              onClick={() => navigate(-1)}
            >
              <BiLeftArrowCircle className="icon" />
            </a>
            {localStorage.access || runtimeConfig?.noAuthFsWrite ? (
              <a
                className="nav-link my-auto ms-2 p-2"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (!files.length) {
                    document.getElementById("filer").click();
                  } else {
                    confirm(
                      `Press "Okay" to upload ${files.length} files to ${hostname}'s computer!`
                    )
                      ? uploadFiles()
                      : toast(
                          "Operation requires user permission which has been denied"
                        );
                  }
                }}
              >
                <FaUpload className="icon" />{" "}
                {window.innerWidth > 600 || !files.length ? (
                  <span style={{ pointerEvents: "none", zIndex: -1 }}>
                    Upload
                  </span>
                ) : (
                  ""
                )}{" "}
                {files.length ? files.length + " files" : ""}
                {files?.length ? (
                  <span
                    title="Change selection"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("filer").click();
                    }}
                    className="rounded ms-2"
                  >
                    <BiSelectMultiple className="icon fs-4" />
                  </span>
                ) : (
                  ""
                )}
                {files?.length ? (
                  <span
                    title="Cancel Selection"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirm("Do you want to Unselect all selected Files?") &&
                        setFiles([]);
                    }}
                    className=" rounded fs-5 ms-2"
                  >
                    <FaTimes className="icon" />
                  </span>
                ) : (
                  ""
                )}
              </a>
            ) : (
              <>
                <Link
                  to={!localStorage.access ? `/login` : "/admin"}
                  className="rounded shadow-lg p-3 ms-3 py-2 border border-dashed readmore custom-navmenu text-light"
                >
                  authorize to upload
                </Link>
              </>
            )}
            <input
              type="file"
              name="files"
              id="filer"
              multiple
              style={{ opacity: "0", width: "0px", height: "0px" }}
              onChange={({ target }) => {
                setFiles(target.files);
                confirm(
                  `Press "Okay" to upload ${target.files.length} files to ${hostname}`
                )
                  ? uploadFiles(target.files)
                  : toast(
                      "Operation requires user permission which has been denied"
                    );
              }}
            />
            <div className="d-flex ms-auto">
              {window.innerWidth >= 400 && (
                <div className="d-flex p-1 form-group border rounded me-2">
                  {isSearching && (
                    <input
                      autoFocus
                      type="search"
                      value={key}
                      className="rounded input px-1 no-dec bg-none themebg"
                      onChange={({ target }) => setKey(target.value)}
                      style={{
                        border: "none",
                        outline: "none",
                      }}
                    />
                  )}
                  <button
                    className="themebg border-0 border-start px-2 border text-light"
                    onClick={() => {
                      setIsSearching((prev) => !prev);
                      setKey("");
                    }}
                  >
                    <BiSearch />
                  </button>
                </div>
              )}
              <button
                className="btn btn-outline-light"
                type="submit"
                onClick={() => setIsHidden((prev) => !prev)}
              >
                <FaBars className="icon" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      {isUploading && (
        <progress
          className="w-100 mt-0"
          style={{
            position: "relative",
            bottom: "5px",
          }}
          value={uProgres}
          max={100}
        ></progress>
      )}
    </>
  );
};

export default Header;
