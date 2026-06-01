import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BiLeftArrowCircle, BiSearch } from "react-icons/bi";
import { useStateContext } from "../../../state/StateContext";

const MainHeader = () => {
  const navigate = useNavigate();
  const { setKey, key, hostname, sessions } = useStateContext();
  const [isSearching, setIsSearching] = useState(false);
  return (
    <nav className="sticky top-0 z-5  rounded-3xl border border-white/10 bg-[#111] p-4 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-white">
            <button
              className="rounded-2xl border border-white/10 bg-[#0d0d11] px-3 py-2 text-white hover:bg-white/10 transition"
              onClick={() => navigate(-1)}
            >
              <BiLeftArrowCircle className="text-lg" />
            </button>
            <Link to="/" className="font-semibold text-xl hover:text-white/80">
              {hostname}
            </Link>
            <span className="text-sm text-white/60">- Device Manager</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex flex-1  items-center rounded-2xl border border-white/10 bg-[#0d0d11] p-2">
              {isSearching && (
                <input
                  autoFocus
                  type="search"
                  value={key}
                  className="w-full bg-transparent text-white outline-none placeholder:text-white/40"
                  onChange={({ target }) => setKey(target.value)}
                  placeholder="Search devices..."
                />
              )}
              <button
                className="rounded-2xl border border-white/10 bg-[#0d0d11] px-3 py-2 text-white hover:bg-white/10 transition"
                onClick={() => {
                  setIsSearching((prev) => !prev);
                  setKey("");
                }}
              >
                <BiSearch />
              </button>
            </div>
          </div>
        </div>

            <div className="text-sm text-white/60">
              {sessions.length} Connected devices
            </div> 
      </div>
    </nav>
  );
};

export default MainHeader;
