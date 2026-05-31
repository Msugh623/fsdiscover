import React, { useState } from "react";
import { BiLeftArrowCircle, BiSearch } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useStateContext } from "../../../state/StateContext";

const MainHeader = () => {
  const { setKey, key, hostname, sessions } = useStateContext();
  const [isSearching, setIsSearching] = useState(false);
  return (
    <>
      <nav
        className="navbar flex flex-col gap-2 navbar-expand-lg mb-0 navbar-dark themebg ani slideIn shadow-sm"
        style={{ position: "sticky", top: 0, zIndex: 1 }}
      >
        <div className="w-full nav">
          {
            <h2 className="h4 mt-auto slideUp mx-4 ml-4 pb-2 mb-4 border-bottom flex">
              <Link to={"/"} className="text-white mt-auto fw-bold text-xl">
                {hostname}
              </Link>
              <div className="mt-auto ml-2"> - Device Manager</div>
            </h2>
          }
          {window.innerWidth < 400 && (
            <>
              <div
                className="ml-auto w-auto flex my-auto p-1 form-group border rounded mr-2"
                style={{
                  maxWidth: "98vw",
                }}
              >
                {isSearching && (
                  <input
                    type="search"
                    autoFocus
                    value={key}
                    className="rounded input px-1 no-dec bg-none themebg"
                    onChange={({ target }) => setKey(target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                    }}
                  />
                )}
                <button
                  className="themebg border-0 border-start px-2 border my-auto text-white"
                  onClick={() => {
                    setIsSearching((prev) => !prev);
                    setKey("");
                  }}
                >
                  <BiSearch />
                </button>
              </div>
              <div className="mr-1"></div>
            </>
          )}
        </div>
        <div className="container-fluid">
          <div
            className={`w-full d-flex ${false ?"d-none" : ""}`}
            id="navbarNav"
          >
            <a
              className="nav-link my-auto fs-3 border-end px-2 pr-3"
              onClick={() => navigate(-1)}
            >
              <BiLeftArrowCircle className="icon" />
            </a>
            <div className="pl-2 ps-md-3 my-auto">
              {sessions.length} Connected devices
            </div>
            <div className="flex ml-auto">
              {window.innerWidth >= 400 && (
                <div className="flex p-1 form-group border rounded mr-2">
                  {isSearching && (
                    <input
                      autoFocus
                      type="search"
                      value={key}
                      className="rounded input px-1 no-dec bg-none themebg"
                      onChange={({ target }) => setKey(target.value)}
                      style={{
                        border: "none",
                        outline: "none",
                      }}
                    />
                  )}
                  <button
                    className="themebg border-0 border-start px-2 border text-white"
                    onClick={() => {
                      setIsSearching((prev) => !prev);
                      setKey("");
                    }}
                  >
                    <BiSearch />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MainHeader;
