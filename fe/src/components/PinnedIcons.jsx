import React from "react";
import { useStateContext } from "../state/StateContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlaceHolder from "./PlaceHolder";

const PinnedIcons = ({ app, handleClick = () => null, onTaskbar = false }) => {
  const { handleIconClick, opened } = useStateContext();
  const aio = opened.find((win) => win.location == app.location);
  return (
    <div
      draggable={true}
      className={`app ico flex flex-col items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/5 p-3 text-center text-white transition hover:bg-white/10`}
      style={{ width: "100%", minWidth: "72px" }}
      title={app.name}
      id={app.location}
      onClick={() => {
        handleIconClick(app.location);
        handleClick();
      }}
    >
      <LazyLoadImage
        draggable={false}
        effect="opacity"
        alt={app.name}
        src={app.icon}
        width={"40px"}
        placeholder={<PlaceHolder />}
        height={"40px"}
        className="rounded-xl bg-black/70 p-1"
      />
      {!onTaskbar && (
        <div className="max-w-full">
          <div
            className="text-[11px] font-medium text-white/80 truncate"
            style={{ minWidth: "50px", maxWidth: "90px" }}
          >
            {app.name}
          </div>
        </div>
      )}
      {aio?.zIndex && <div className="h-1 w-full rounded-full bg-cyan-400" />}
    </div>
  );
};

export default PinnedIcons;
