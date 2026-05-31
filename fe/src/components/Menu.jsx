import React, { useEffect, useState } from "react";
import { useStateContext } from "../state/StateContext";
import PinnedIcons from "./PinnedIcons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlaceHolder from "./PlaceHolder";

const Menu = ({ hasDivider }) => {
  const { page } = useParams();
  const navigate = useNavigate();
  const [panelClassName, setPanelClassName] = useState("d-none");
  const [href, setHref] = useState(location.href);
  const [hasPannel, setHasPannel] = useState(page);
  const { apps, menuPos, setMenuPos } = useStateContext();

  useEffect(() => {
    location.href !== href && setHref(location.href);
  }, [location.href == href]);

  useEffect(() => {
    if (!hasPannel) {
      if (hasPannel == undefined) {
        return;
      }
      setPanelClassName("slideOut");
      setTimeout(() => {
        setPanelClassName("d-none");
      }, 500);
    } else {
      setPanelClassName("d-block");
    }
  }, [hasPannel]);
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
        className={`fixed inset-0 z-[5000] ${hasPannel ? "block" : "hidden"}`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setHasPannel(false)}
        />
        <div className="relative mx-auto mt-20 max-w-3xl rounded-3xl border border-white/10 bg-[#070809] text-white shadow-2xl shadow-black/50 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/80 px-5 py-4">
            <div className="flex items-center gap-3">
              <LazyLoadImage
                effect="opacity"
                src="/sprintetS.png"
                draggable={false}
                placeholder={<PlaceHolder />}
                className="w-10 h-10 rounded-2xl bg-white/5 p-1"
                alt="Sprintet Logo"
              />
              <div>
                <p className="text-sm font-semibold text-white">
                  Sprintet Menu
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
          <div className="p-5">
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
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {apps.map((app) => (
                <PinnedIcons
                  key={app?.id || app?.location}
                  app={app}
                  handleClick={() => setHasPannel(false)}
                />
              ))}
            </div>
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <p className="mb-3 text-white font-medium">Sprintet</p>
              <p>
                Sprintet is a dynamic programming startup dedicated to
                delivering cutting-edge software solutions that drive business
                growth.
              </p>
              <Link
                to="/about"
                onClick={() => setHasPannel(false)}
                className="mt-4 inline-flex rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-gray-100"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        id="start"
        draggable
        title="Sprintet Menu"
        className={`app my-auto p-2 rounded-2xl border border-white/10 bg-white/10 text-white shadow-lg backdrop-blur-md transition-all duration-300 ${hasPannel ? "ring-2 ring-white/20" : "hover:bg-white/15"}`}
        onClick={() => setHasPannel((prev) => !prev)}
        style={{
          position: "fixed",
          left: menuPos.x + "px",
          top: menuPos.y + "px",
          zIndex: 5000,
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
          src="/sprintetS.png"
          draggable={false}
          placeholder={<PlaceHolder />}
          className={`h-[40px] relative top-[2px]`}
          alt="Sprintet Logo"
          about="Sprintet Logo Image"
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
