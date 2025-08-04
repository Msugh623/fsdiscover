import React from "react";
import { FaFolder } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Folder = ({ data }) => {
  const maxL = window.innerWidth < 468 ? 16 : 30;
  const prn = data?.name.substring(0, maxL - 5);
  return (
    <Link to={location.pathname + "/" + data?.name} className="text-light">
      <FaFolder className="icon" />{" "}
      <span className="text-truncate">
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
