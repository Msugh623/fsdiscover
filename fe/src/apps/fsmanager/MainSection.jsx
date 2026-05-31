import React, { useEffect, useMemo, useState } from "react";
import { useFsContext } from "../../state/FsContext";
import DirItem from "./components/DirItem";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { FaSpinner, FaTimes } from "react-icons/fa";
import {
  BiGrid,
  BiListUl,
  BiSortAlt2,
  BiSortAZ,
  BiSortZA,
} from "react-icons/bi";
import { useStateContext } from "../../state/StateContext";
import { useLocation } from "react-router-dom";

const MainSection = () => {
  const {
    isFetching,
    locChildren,
    isHidden,
    setIsHidden,
    err,
    key,
    setKey,
    modal,
    setModal,
    title,
  } = useFsContext();
  const { hostname } = useStateContext();
  const location = useLocation();
  const [viewMode, setViewMode] = useState("grid");
  const [sortMode, setSortMode] = useState("date");

  const sortedChildren = useMemo(() => {
    const isFolder = (name) => !name.includes(".");
    if (sortMode === "date") {
      return locChildren;
    }
    return [...locChildren].sort((a, b) => {
      if (sortMode === "foldersFirst") {
        const aFolder = isFolder(a);
        const bFolder = isFolder(b);
        if (aFolder !== bFolder) {
          return aFolder ? -1 : 1;
        }
        return a.localeCompare(b, undefined, { sensitivity: "base" });
      }
      const cmp = a.localeCompare(b, undefined, { sensitivity: "base" });
      return sortMode === "nameAsc" ? cmp : -cmp;
    });
  }, [locChildren, sortMode]);

  useEffect(() => {
    // console.log(locChildren)
    window.innerWidth < 768 ? setIsHidden(true) : setIsHidden(false);
    document.title =
      "" +
      hostname +
      " - File System: " +
      (location.pathname.replace("/fsexplorer", "") || "/");
    key && setKey("");
  }, [window.innerWidth, location.pathname]);

  return (
    <div className="slideUp bg-[#060606] min-h-screen">
      <div className="flex w-full">
        {isHidden ? false : <Sidebar />}
        <div className="w-full bg-[#070707]">
          <Header />

          <div className="px-4 py-3">
            <div className="themebg round border border-white/10 shadow-lg p-4 slideIn bg-[#111]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
                    Current Path
                  </div>
                  <div className="text-sm text-gray-100 wrap-break-word">
                    {location.pathname.replace("/fsexplorer", "")
                      ? "Home > "
                      : ""}
                    {location.pathname
                      .replace("/fsexplorer", "")
                      .replaceAll("%20", " ")
                      .slice(1)
                      .replaceAll("/", " > ") || "Home"}
                  </div>
                </div>

                <div className="flex flex-row sm:items-center sm:gap-3 text-sm">
                  <div className="text-gray-400 my-auto">
                    {locChildren.length} item
                    {locChildren.length === 1 ? "" : "s"}
                  </div>
                  <div className="flex flex-wrap ms-auto items-center gap-2 rounded-2xl bg-white/5 p-1">
                    <button
                      className="rounded-2xl px-3 py-2 text-xs font-semibold text-gray-400 transition hover:bg-white/10 hover:text-white"
                      onClick={() =>
                        setViewMode((prev) =>
                          prev === "grid" ? "list" : "grid",
                        )
                      }
                      aria-label={
                        viewMode === "grid"
                          ? "Switch to list view"
                          : "Switch to grid view"
                      }
                    >
                      <span className="inline-flex items-center gap-2">
                        {viewMode === "grid" ? <BiListUl /> : <BiGrid />}
                        {viewMode === "grid" ? "List view" : "Grid view"}
                      </span>
                    </button>
                    <button
                      className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${sortMode === "date" || sortMode === "foldersFirst" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/10"}`}
                      onClick={() =>
                        setSortMode((prev) =>{
                          const sortModes = ["date", "foldersFirst", "nameAsc", "nameDesc"];
                          const index = sortModes.indexOf(prev)
                          const newIndex=index+1>=sortModes.length?0:index+1;
                          return sortModes[newIndex]
                        })
                      }
                      aria-label="Toggle sort mode"
                    >
                      <span className="inline-flex items-center gap-2">
                        {sortMode === "date" ? (
                          <>
                            <BiSortAlt2 /> Date modified
                          </>
                        ) : sortMode == "foldersFirst" ? (
                          <>
                            <BiSortAlt2 /> Folders first
                          </>
                        ) : sortMode === "nameAsc" ? (
                          <>
                            <BiSortAZ /> A → Z
                          </>
                        ) : (
                          <>
                            <BiSortZA /> Z → A
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 pt-2">
            {isFetching && !locChildren.length ? (
              <div className="flex justify-center py-10 slideUp">
                <FaSpinner className="spinner text-3xl" />
              </div>
            ) : null}

            {!isFetching && !locChildren.length ? (
              <div className="bg-[#111] round border border-white/10 shadow-2xl p-6 text-center text-gray-200 slideUp">
                {err || "Empty Directory"}
              </div>
            ) : null}

            <div
              className={`grid gap-3 ${viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
            >
              {sortedChildren.map((item, i) => (
                <DirItem key={`${item}-${i}`} item={item} viewMode={viewMode} />
              ))}
            </div>

            {locChildren.length ? (
              <div className="text-right text-sm text-gray-400 mt-4">
                {locChildren.length} item{locChildren.length === 1 ? "" : "s"}{" "}
                shown
              </div>
            ) : null}
          </div>

          {modal ? (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f13] shadow-2xl slideUp">
                <div className="flex items-center gap-3 border-b border-white/10 p-4">
                  <div className="text-lg font-semibold text-white">
                    {title}
                  </div>
                  <button
                    className="ml-auto rounded-full p-2 active text-gray-200 hover:bg-white/10"
                    onClick={() => setModal("")}
                  >
                    <FaTimes className="icon" />
                  </button>
                </div>
                <div className="themebg round p-4">{modal}</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MainSection;
