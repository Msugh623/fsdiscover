import React, { useEffect, useState } from "react";
import { useStateContext } from "../state/StateContext";
import PinnedIcons from "./PinnedIcons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BiChevronLeft } from "react-icons/bi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlaceHolder from "./PlaceHolder";

const Menu = ({}) => {
  const { page } = useParams();
  const navigate = useNavigate();
  const [href, setHref] = useState(location.href);
  const [hasPannel, setHasPannel] = useState(page);
  const { apps, menuPos, setMenuPos, safeMode } = useStateContext();

  useEffect(() => {
    location.href !== href && setHref(location.href);
  }, [location.href == href]);

  useEffect(() => {
    const killCtr = (e) => {
      e.code == "Escape" && setHasPannel(false);
    };
    window.addEventListener("keydown", killCtr);

    return () => {
      window.removeEventListener("keydown", killCtr);
    };
  }, []);
  return (
    <>
      <div
        className={`fixed inset-0 z-5000 slideUp ${hasPannel ? "block" : "hidden"}`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setHasPannel(false)}
        />
        <div className="relative mx-auto mt-8 w-[min(100vw-1.5rem,100%)] max-w-3xl max-h-[calc(100vh-3rem)] rounded-3xl border border-white/10 bg-[#070809] text-white shadow-2xl shadow-black/50 overflow-hidden sm:mt-20">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/80 px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex flex-1 min-w-0 items-center gap-3">
              <LazyLoadImage
                effect="opacity"
                src="/icon.png"
                draggable={false}
                placeholder={<PlaceHolder />}
                className="w-10 h-10 rounded-2xl bg-white/5 p-1"
                alt="SprintET Logo"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  SprintET Menu
                </p>
                <p className="text-xs text-white/50">
                  Quick access to your apps
                </p>
              </div>
            </div>
            <button
              onClick={() => setHasPannel(false)}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors"
            >
              Close
            </button>
          </div>
          <div
            className="p-4 sm:p-5 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 16rem)" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <button
                onClick={() => {
                  navigate("/");
                  setHasPannel(false);
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <BiChevronLeft className="text-lg" />
                All Services
              </button>
              <span className="text-sm text-white/50">
                Drag the menu icon to reposition it.
              </span>
            </div>
            {safeMode && !localStorage?.access ? (
              <div className="flex flex-col items-center justify-center gap-4 p-8">
                <p className="text-sm text-white/60">
                  Restricted — sign in to access apps
                </p>
                <button
                  onClick={() => {
                    navigate("/login");
                    setHasPannel(false);
                  }}
                  className="rounded-2xl bg-blue-600 px-4 py-2 text-white font-semibold"
                >
                  Login
                </button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {apps.map((app) => (
                  <PinnedIcons
                    key={app?.id || app?.location}
                    app={app}
                    handleClick={() => setHasPannel(false)}
                  />
                ))}
              </div>
            )}
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <p className="mb-3 text-white font-medium">SprintET</p>
              <p>
                SprintET engineers elite software that serves as the digital
                backbones required to put your entire business world in the palm
                of your hands. We make software that transforms your ideas and
                needs into real products that transforms your world.
              </p>
              <a
                href="https://sprintet.onrender.com"
                onClick={() => setHasPannel(false)}
                className="mt-4 inline-flex rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-100"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        id="start"
        draggable
        title="SprintET Menu"
        className={`app my-auto p-1 py-0.5 rounded-2xl border border-white/10 bg-white/10 text-white shadow-lg backdrop-blur-md 
          ${hasPannel ? "ring-2 ring-white/20" : "hover:bg-white/15"}`}
        onClick={() => setHasPannel((prev) => !prev)}
        style={{
          position: "fixed",
          left: menuPos.x + "px",
          top: menuPos.y + "px",
          zIndex: 5000,
          transition: "all, 0.3s",
        }}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        onDragStart={() => {
          setMenuPos((prev) => ({
            ...prev,
            x: prev.x,
            y: prev.y,
          }));
        }}
        onTouchStart={() => {
          setMenuPos((prev) => ({
            ...prev,
            x: prev.x,
            y: prev.y,
          }));
        }}
        onDrag={(e) => {
          setMenuPos((prev) => ({
            x: e.clientX ? e.clientX : prev.x,
            y: e.clientY ? e.clientY : prev.y,
          }));
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          setMenuPos((prev) => ({
            x: e.touches[0].clientX ? e.touches[0].clientX : prev.x,
            y: e.touches[0].clientY ? e.touches[0].clientY : prev.y,
          }));
        }}
        onDragEnd={() => {
          setMenuPos((prev) => ({
            ...prev,
            x: prev.x,
            y: prev.y,
          }));
        }}
        onTouchEnd={() => {
          setMenuPos((prev) => ({
            ...prev,
            x: prev.x,
            y: prev.y,
          }));
        }}
        onTouchCancel={() => {
          setMenuPos((prev) => ({
            ...prev,
            x: prev.x,
            y: prev.y,
          }));
        }}
      >
        <LazyLoadImage
          effect="opacity"
          src="/icon.png"
          draggable={false}
          placeholder={<PlaceHolder />}
          className={`h-10 rounded-xl relative top-0.75`}
          alt="SprintET Logo"
          about="FSdiscover Logo Image"
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          style={{}}
        />
      </div>
    </>
  );
};

export default Menu;
