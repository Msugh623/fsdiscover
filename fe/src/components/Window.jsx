import React, { useState } from "react";
import { FaX } from "react-icons/fa6";
import { useStateContext } from "../state/StateContext";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlaceHolder from "./PlaceHolder";

const AppWindow = ({ app }) => {
  const { killWindow } = useStateContext();
  const [dd, setDd] = useState(false);

  if (app.isMini) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3">
      <div className="w-[98vw] h-[98vh] sm:w-[96vw] sm:h-[96vh] bg-[#111] text-white rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden relative">
        <header className="flex items-center px-3 py-1 border-b border-white/8 bg-[#0f1114]">
          <div className="flex items-center gap-2 min-w-0">
            <LazyLoadImage
              placeholder={<PlaceHolder />}
              src={app.icon}
              width={20}
              height={20}
              className="rounded"
            />
            <span className="text-xs font-medium truncate max-w-[65vw]">
              {app.name}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <AiOutlineInfoCircle
              className="text-sm cursor-pointer text-gray-300 hover:text-white transition"
              onClick={() => setDd((prev) => !prev)}
            />
            <button
              onClick={() => killWindow(app.id)}
              className="text-gray-400 hover:text-white transition bg-transparent border-none outline-none cursor-pointer"
              aria-label="Close window"
            >
              <FaX size={12} />
            </button>
          </div>
        </header>
        <iframe
          src={app.href || app.location}
          className="flex-1 w-full bg-white"
          frameBorder="0"
        />
        {dd && <AppDropDown app={app} ddSetter={setDd} />}
      </div>
    </div>
  );
};

const AppDropDown = ({ app, ddSetter }) => {
  return (
    <div className="absolute top-14 left-4 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl w-56 p-3 z-50">
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <LazyLoadImage
            placeholder={<PlaceHolder />}
            src={app.icon}
            width="24px"
            className="rounded"
          />
          <span className="text-sm font-medium truncate">{app.name}</span>
        </div>
        <FaTimes
          className="cursor-pointer text-gray-400 hover:text-white"
          onClick={() => ddSetter(false)}
        />
      </div>
      <div
        className="flex items-center gap-2 text-sm p-2 hover:bg-white/10 rounded cursor-pointer transition"
        onClick={() => {
          ddSetter(false);
          window.open(app.href || app.location, "_blank");
        }}
      >
        <BiLinkExternal /> Run in browser
      </div>
    </div>
  );
};

export default AppWindow;
