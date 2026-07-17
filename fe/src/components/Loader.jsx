import React from "react";
import Delay from "./Delay";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlaceHolder from "./PlaceHolder";
import { FaSpinner } from "react-icons/fa6";

const Loader = ({ animate }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070809]/60 backdrop-blur-md transition-all duration-300">
      <Delay delay={!animate ? 50 : 0}>
        <div className="relative mb-8 slideUp flex flex-col items-center">
          {/* Subtle ambient glow behind the logo */}
          <div className="absolute inset-0 animate-pulse rounded-2xl bg-blue-500/20 blur-xl"></div>

          <LazyLoadImage
            effect="opacity"
            placeholder={<PlaceHolder />}
            src="/icon.png"
            className="relative h-28 w-28 rounded-2xl border border-white/10 bg-white/5 object-contain shadow-2xl transition-transform hover:scale-105"
            alt="FSdiscover Logo"
            draggable={false}
          />
        </div>
      </Delay>
        <Delay delay={300}>
          <div className="slideUp flex flex-col items-center gap-3">
            <FaSpinner className="h-6 w-6 animate-spin text-white/70" />
            <span className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">
              Loading
            </span>
          </div>
        </Delay>
    </div>
  );
};

export default Loader;
