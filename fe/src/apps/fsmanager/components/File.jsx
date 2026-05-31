import React from "react";
import { BiFile } from "react-icons/bi";

const File = ({ data }) => {
  const maxL = window.innerWidth < 468 ? 16 : 30;
  const prn = data?.name.substring(0, maxL - 5);
  return (
    <a
      className="flex items-center gap-2 text-white text-sm font-medium rounded-3xl px-2 py-2 transition"
      onClick={(e)=>e.stopPropagation()}
      style={{ maxWidth: "100%" }}
      href={location.pathname + "/" + data?.name}
      target="_blank"
      rel="noreferrer"
      title={data?.name}
    >
      <BiFile />
      <span className="truncate">
        {data?.name.length > maxL
          ? prn +
            "..." +
            data.name.substring(data?.name.length - 8, data?.name.length)
          : data?.name}
      </span>
    </a>
  );
};

export default File;
