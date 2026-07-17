import React from "react";
import { FaFolder } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Folder = ({ data }) => {
  const maxL = window.innerWidth < 468 ? 16 : 30;
  const prn = data?.name.substring(0, maxL - 5);
  return (
    <Link
      onClick={(e)=>e.stopPropagation()}
      to={location.pathname + "/" + data?.name}
      className="flex items-center gap-2 text-white text-sm font-medium rounded-3xl px-2 py-2 transition"
      title={data?.name}
    >
      <FaFolder className="icon" />
      <span className="truncate">
        {data?.name.length > maxL
          ? prn +
            "..." +
            data.name.substring(data?.name.length - 8, data?.name.length)
          : data?.name}
      </span>
    </Link>
  );
};

export default Folder;
