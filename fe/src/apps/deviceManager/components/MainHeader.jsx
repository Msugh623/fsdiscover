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
        className="navbar flex-column gap-2 navbar-expand-lg mb-0 navbar-dark themebg ani slideIn shadow-sm"
        style={{ position: "sticky", top: 0, zIndex: 1 }}
      >
        <div className="w-100 nav">
          {
            <h2 className="h4 mt-auto slideUp mx-4 ms-4  pb-2 mb-4 border-bottom d-flex">
              <Link to={"/"} className="text-light mt-auto  fw-bold fs-5">
                {hostname}
              </Link>
              <div className="mt-auto ms-2"> - Device Manager</div>
            </h2>
          }
          {window.innerWidth < 400 && (
            <>
              <div
                className="ms-auto w-auto d-flex my-auto  p-1 form-group border rounded me-2"
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
                  className="themebg border-0 border-start px-2 border my-auto text-light"
                  onClick={() => {
                    setIsSearching((prev) => !prev);
                    setKey("");
                  }}
                >
                  <BiSearch />
                </button>
              </div>
              <div className="me-1"></div>
            </>
          )}
        </div>
        <div className="container-fluid">
          <div
            className={`w-100 d-flex ${false ? "d-none" : ""}`}
            id="navbarNav"
          >
            <a
              className="nav-link my-auto fs-3 border-end px-2 pe-3"
              onClick={() => navigate(-1)}
            >
              <BiLeftArrowCircle className="icon" />
            </a>
            <div className="ps-2 ps-md-3 my-auto">
              {sessions.length} Connected devices
            </div>
            <div className="d-flex ms-auto">
              {window.innerWidth >= 400 && (
                <div className="d-flex p-1 form-group border rounded me-2">
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
                    className="themebg border-0 border-start px-2 border text-light"
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
