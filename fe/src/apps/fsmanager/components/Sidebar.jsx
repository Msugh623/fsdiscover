import React, { useEffect, useState } from "react";
import { useFsContext } from "../../../state/FsContext";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../../../state/StateContext";
import api from "../../../../axios/api";
import { FaChevronLeft } from "react-icons/fa";

const Sidebar = () => {
  const { isHidden, setIsHidden } = useFsContext();
  const { hostname } = useStateContext();
  const navigate = useNavigate();
  const [desktopTarget, setDesktopTarget] = useState("/fsexplorer/Desktop");

  useEffect(() => {
    api
      .get("/fs")
      .then((res) => {
        const children = res.data || [];
        const hasDesktop = children.includes("Desktop");
        const hasOneDrive = children.includes("OneDrive");
        if (hasDesktop) {
          setDesktopTarget("/fsexplorer/Desktop");
        } else if (hasOneDrive) {
          setDesktopTarget("/fsexplorer/OneDrive/Desktop");
        } else {
          setDesktopTarget("/fsexplorer/Desktop");
        }
      })
      .catch(() => {
        setDesktopTarget("/fsexplorer/Desktop");
      });
  }, []);

  return (
    <div
      className={`sidebar text-gray-200 ${isHidden ? "d-none" : "d-block"} mt-3 slideIn`}
      style={{
        width: "250px",
        position: "sticky",
        top: "24px",
        height: "calc(100vh - 28px)",
        marginLeft: "12px",
      }}
    >
      <button
        type="button"
        className="absolute -right-3 top-8 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#111] text-white/80 shadow-2xl transition hover:bg-white/10"
        onClick={() => setIsHidden(true)}
        aria-label="Hide sidebar"
      >
        <FaChevronLeft />
      </button>
      <div className="bg-[#111] rounded-3xl border border-white/10 shadow-2xl h-full p-4 relative">
        <div className="mb-6">
          <Link
            to={"/"}
            className="text-gray-100 fw-bold text-xl hover:text-white"
          >
            {hostname}
          </Link>
          <div className="text-sm text-gray-400 mt-2">File Manager</div>
        </div>
        <ul className="list-unstyled space-y-3">
          <li>
            <button
              className="w-full rounded-2xl px-4 py-2 text-left text-white/90 bg-white/5 hover:outline border-white/10 hover:bg-white/10 transition"
              type="button"
              onClick={() => navigate("/fsexplorer")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className="w-full rounded-2xl px-4 py-2 text-left text-white/90 bg-white/5 hover:outline border-white/10 hover:bg-white/10 transition"
              type="button"
              onClick={() => navigate(desktopTarget)}
            >
              Desktop
            </button>
          </li>
          <li>
            <button
              className="w-full rounded-2xl px-4 py-2 text-left text-white/90 bg-white/5 hover:outline border-white/10 hover:bg-white/10 transition"
              type="button"
              onClick={() => navigate("/fsexplorer/Documents")}
            >
              Documents
            </button>
          </li>
          <li>
            <button
              className="w-full rounded-2xl px-4 py-2 text-left text-white/90 bg-white/5 hover:outline border-white/10 hover:bg-white/10 transition"
              type="button"
              onClick={() => navigate("/fsexplorer/Downloads")}
            >
              Downloads
            </button>
          </li>
          <li>
            <button
              className="w-full rounded-2xl px-4 py-2 text-left text-white/90 bg-white/5 hover:outline border-white/10 hover:bg-white/10 transition"
              type="button"
              onClick={() => navigate("/fsexplorer/Pictures")}
            >
              Pictures
            </button>
          </li>
          <li>
            <button
              className="w-full rounded-2xl px-4 py-2 text-left text-white/90 bg-white/5 hover:outline border-white/10 hover:bg-white/10 transition"
              type="button"
              onClick={() => navigate("/fsexplorer/Videos")}
            >
              Videos
            </button>
          </li>
          <li>
            <button
              className="w-full rounded-2xl px-4 py-2 text-left text-white/90 bg-white/5 hover:outline border-white/10 hover:bg-white/10 transition"
              type="button"
              onClick={() => navigate("/fsexplorer/Music")}
            >
              Music
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
