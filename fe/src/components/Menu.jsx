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
      <div className="menu-panel small">
        <div className="mx-auto col-12 col-sm-10 col-md-8 col-xl-9">
          {hasPannel && (
            <div
              onClick={() => setHasPannel(false)}
              className=""
              style={{
                position: "fixed",
                left: "0",
                right: "0",
                top: "0",
                bottom: "0",
              }}
            ></div>
          )}
          <div
            className={`inner rounded shadow-lg p-3 text-light bg-dark text-left slideUp ${panelClassName}`}
            style={{
              zIndex: 5000,
            }}
          >
            <div
              className="row ani"
              style={{
                minHeight: "140px",
                height: "20vh",
                maxHeight: "800vh",
              }}
            >
              {
                <div
                  className={`scrollbs ani ${page == "apps" && "d-none"}`}
                  style={{
                    height: "100%",
                    overflowY: "auto",
                  }}
                >
                  <div className="d-flex ">
                    {
                      <div
                        className="my-auto "
                        onClick={() => navigate("/") || setHasPannel(false)}
                      >
                        <div
                          className="p-1 active "
                          style={{ borderRadius: "3px" }}
                        >
                          {true ? (
                            <span className="slideLeft aniFast pe-2 small">
                              <BiChevronLeft className="fs-5 icon" />
                              <span className="">All Services</span>
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    }
                  </div>
                  <div className="mt-3 mb-3">
                    {apps.map((app) => (
                      <PinnedIcons
                        key={app?.id||app?.location}
                        app={app}
                        handleClick={() => setHasPannel(false)}
                      />
                    ))}
                  </div>
                  <div className="d-flex flex-column h-auto">
                    Sprintet is a dynamic programming startup dedicated to
                    delivering cutting-edge software solutions that drive
                    business growth. We specialize in agile development
                    methodologies, ensuring efficient project execution,
                    high-quality results, and continuous improvement.
                    <div className="mt-3">
                      <Link
                        to={"/about"}
                        title="Learn more"
                        aria-label="About Us - Learn more about Sprintet"
                        onClick={() => {
                          setHasPannel(false);
                        }}
                        className="p-2 active d-inline btn"
                        style={{ borderRadius: "3px" }}
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      <div
        id="start"
        draggable
        title="Sprintet Menu"
        className={`app my-auto p-1 btn fs-5 ${hasPannel && "active"}`}
        onClick={() => setHasPannel((prev) => !prev)}
        style={{
          transition:"all, 0.4s",
          position: "fixed",
          left: menuPos.x + "px",
          top: menuPos.y + "px",
          zIndex: 5000,
          background: "#a5cde441",
          backdropFilter: "blur(10px)",
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
          height={40}
          alt="Sprintet Logo"
          about="Sprintet Logo Image"
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          style={{}}
        />
      </div>
      {hasDivider !== false && (
        <div
          className="divider my-auto mx-2"
          style={{ width: "1px", background: "#efefef60", height: "80%" }}
        ></div>
      )}
    </>
  );
};

export default Menu;
