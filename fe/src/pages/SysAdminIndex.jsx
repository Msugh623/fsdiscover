import React, { useEffect, useState } from "react";
import { useStateContext } from "../state/StateContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../../axios/api";
import { toast } from "react-toastify";
import { FaCompress, FaExpandArrowsAlt, FaLock } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlaceHolder from "../components/PlaceHolder";

const SysAdminIndex = () => {
  const {
    fetchConfig,
    visitors,
    forbidden,
    setForbidden,
    protectedRoutes,
    setProtectedRoutes,
    hostname,
    changePass,
    devices,
    setDevices,
    traffic,
    setTraffic,
    scrollConfig,
    setScrollConfig,
  } = useStateContext();
  const navigate = useNavigate();
  const [category, setCategory] = useState("Visitors");
  async function forbid(visitor) {
    try {
      const res = await api.put("/admin/rq/forbidden", visitor);
      setForbidden(res.data);
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>
      );
    }
  }

  async function eject(device) {
    try {
      const res = await api.post("/admin/rq/devices/rem", device);
      setDevices(res.data);
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>
      );
    }
  }

  async function pardon(forbidden) {
    try {
      const res = await api.post("/admin/rq/forbidden/pardon", forbidden);
      setForbidden(res.data);
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>
      );
    }
  }

  async function unprotectRoute(route) {
    try {
      const res = await api.put("/admin/rq/protectedroutes", { route });
      setProtectedRoutes(res.data);
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>
      );
    }
  }

  async function logout(sudo) {
    if (!confirm("Logout?") && !sudo) {
      return;
    }
    try {
      const _ = await api.post("/admin/rq/logout");
      localStorage.access = "";
      location.href = location.origin;
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>
      );
      navigate("/login");
      localStorage.access = "";
    }
  }

  function autoScroll() {
    const cfg = {
      top: scrollY,
      height: document.documentElement.scrollHeight - window.innerHeight,
    };
    setTimeout(() => {
      if (category == "Network Traffic") {
        document.getElementById("bottom").scrollIntoView({ inline: "center" });
      }
    }, 40);
  }

  useEffect(() => {
    document.title = "Sprintet  - " + hostname + " : Admin";
    fetchConfig();
    const pushLog = ({ detail }) => {
      setTraffic((prev) => [
        ...prev,
        { ...detail, message: detail.message.split("-")[0] },
      ]);
      const cfg = {
        top: scrollY,
        height: document.documentElement.scrollHeight - window.innerHeight,
      };
      setScrollConfig(cfg);
      autoScroll();
    };
    window.addEventListener("netlog", pushLog);
    return () => {
      // window.removeEventListener("netlog", pushLog);
    };
  }, []);

  return (
    <main id="main">
      <section className="section site-portfolio py-5 darkTheme">
        <div className="container">
          <div className="row mb-5">
            <div
              className="d-flex flex-column flex-md-row slideIn mb-4 mb-lg-0"
              data-aos="fade-up"
            >
              <h2 className="">
                <Link to={"/"}>
                  <diviDotsNineBold
                    style={{ fontSize: "2em", color: "steelblue" }}
                    className="text-primary icon"
                  />
                  <LazyLoadImage
                    effect="opacity"
                    placeholder={<PlaceHolder />}
                    src="/sprintetName.png"
                    height={"100px"}
                    alt=""
                  />
                </Link>
              </h2>
              <div className="ms-0 ms-md-auto">
                <div className="d-flex">
                  <div className="ms-auto">
                    <Link
                      to={`/admin/app/add`}
                      className="rounded shadow-lg p-3 py-2 border border-dashed readmore custom-navmenu text-light"
                      onClick={changePass}
                    >
                      <FaLock className="fs-4" />
                    </Link>
                    <Link
                      onClick={() => logout()}
                      className="rounded ms-2 shadow-lg p-3 py-2 border border-dashed readmore custom-navmenu bg-danger text-light"
                    >
                      <BiLogOut className="fs-4" />
                    </Link>
                  </div>
                </div>
                <br />
                {"Device Hostname: " + hostname}
                <br />
                {"Mode: Administrator"}
              </div>
            </div>
            <div
              className="text-start text-lg-end mt-3"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div
                id="categories"
                className="ms-auto py-2 categories d-flex slideLeft"
                style={{
                  maxWidth: "98vw",
                  overflow: "auto",
                }}
              >
                {
                  // <a
                  //   href="#All"
                  //   data-category="*"
                  //   className={
                  //     "p-1 mx-1 shadow rounded" +
                  //     (category == "All" && "active rounded border")
                  //   }
                  //   onClick={() => setCategory("All")}
                  // >
                  //   All{" "}
                  // </a>
                }
                <a
                  href="#Visitors"
                  data-category="*"
                  className={
                    "p-1 mx-1 shadow rounded" +
                    (category == "Visitors" && "active rounded border")
                  }
                  onClick={() => setCategory("Visitors")}
                >
                  Visitors{" "}
                </a>
                <a
                  href="#Forbidden"
                  data-category="*"
                  className={
                    "p-1 mx-1 shadow rounded" +
                    (category == "Forbidden" && "active rounded border")
                  }
                  onClick={() => setCategory("Forbidden")}
                >
                  Forbidden{" "}
                </a>
                <a
                  href="#Protected Routes"
                  data-category="*"
                  className={
                    "p-1 mx-1 shadow rounded" +
                    (category == "Protected Routes" && "active rounded border")
                  }
                  onClick={() => setCategory("Protected Routes")}
                >
                  Protected_Routes{" "}
                </a>

                <a
                  href="#Devices"
                  data-category="*"
                  className={
                    "p-1 mx-1 shadow rounded" +
                    (category == "Devices" && "active rounded border")
                  }
                  onClick={() => setCategory("Devices")}
                >
                  Devices{" "}
                </a>
                <a
                  href="#NetworkTraffick"
                  data-category="*"
                  className={
                    "p-1 mx-1 shadow rounded" +
                    (category == "Network Traffic" && "active rounded border")
                  }
                  onClick={() => setCategory("Network Traffic")}
                >
                  Network_Traffic{" "}
                </a>
              </div>
            </div>
          </div>

          {(category == "All" || category == "Visitors") && (
            <div className="paper p-4 shadow">
              <h3 className="fw-bold">Visitors</h3>
              <div
                id=""
                className="row active p-3 fw-bold"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="py-2 col-lg-3">Type/IP_Address</div>
                <div className="py-2 col-lg-3">User_Agent</div>
                <div className="py-2 col-lg-2">Last_Access</div>
                <div className="py-2 col-lg-2">First_Access</div>
                <div className="py-2 col-lg-2">Action</div>
              </div>
              {visitors.map((u, i) => (
                <div
                  id=""
                  key={"v" + u?.addr + u?.agent}
                  className={`row ${
                    forbidden.find(
                      (v) => u?.addr == v.addr && u.agent == v.agent
                    ) && "d-none"
                  } ${i % 2 !== 0 && "active"} p-3 fw-bold`}
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="py-2 col-lg-3">
                    {u.type} {u?.addr}
                  </div>
                  <div className="py-2 col-lg-3">{u?.agent}</div>
                  <div className="py-2 col-lg-2">
                    {u?.lastAccess.split("(")[0]}
                  </div>
                  <div className="py-2 col-lg-2">{u?.date.split("(")[0]}</div>
                  <div className="py-2 col-lg-2">
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        forbid(u);
                      }}
                    >
                      Forbid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(category == "All" || category == "Forbidden") && (
            <div className="paper p-4 shadow mt-5">
              <h3 className="fw-bold ">Forbidden </h3>
              <div
                id=""
                className="row active p-3 fw-bold"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="py-2 col-lg-3">Type/IP_Address</div>
                <div className="py-2 col-lg-3">User_Agent</div>
                <div className="py-2 col-lg-2">Last_Access</div>
                <div className="py-2 col-lg-2">First_Access</div>
                <div className="py-2 col-lg-2">Action</div>
              </div>
              {forbidden.map((u, i) => (
                <div
                  id=""
                  key={"f" + u?.addr + u?.agent}
                  className={`row ${i % 2 !== 0 && "active"} p-3 fw-bold`}
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="py-2 col-lg-3">
                    {u.type} {u?.addr}
                  </div>
                  <div className="py-2 col-lg-3">{u?.agent}</div>
                  <div className="py-2 col-lg-2">
                    {u?.lastAccess.split("(")[0]}
                  </div>
                  <div className="py-2 col-lg-2">{u?.date.split("(")[0]}</div>
                  <div className="py-2 col-lg-2">
                    <button className="btn themebg" onClick={() => pardon(u)}>
                      Pardon
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {category == "Protected Routes" && (
            <div className="paper p-4 shadow mt-5">
              <h3 className="fw-bold ">Protected Routes </h3>
              <div
                id=""
                className="row active p-3 fw-bold"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="py-2 col-lg-10">Route</div>
                <div className="py-2 col-lg-2">Action</div>
              </div>
              {protectedRoutes.map((u, i) => (
                <div
                  id=""
                  key={"f" + u}
                  className={`row ${i % 2 !== 0 && "active"} p-3 fw-bold`}
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="py-2 col-lg-10">{u}</div>
                  <div className="py-2 col-lg-2">
                    <button
                      className="btn themebg"
                      onClick={() => unprotectRoute(u)}
                    >
                      Free Route
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(category == "All" || category == "Devices") && (
            <div className="paper p-4 shadow">
              <h3 className="fw-bold">Devices</h3>
              <div
                id=""
                className="row active p-3 fw-bold"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="py-2 col-lg-3">ID</div>
                <div className="py-2 col-lg-2">Address</div>
                <div className="py-2 col-lg-3">Agent</div>
                <div className="py-2 col-lg-1">Type</div>
                <div className="py-2 col-lg-2">Date</div>
                <div className="py-2 col-lg-1">Action</div>
              </div>
              {devices.map((device, i) => (
                <div
                  id=""
                  key={"v" + device?.clientId + device?.type}
                  className={`row ${
                    forbidden.find(
                      (v) =>
                        device?.clientId == v.addr && device.type == v.agent
                    ) && "d-none"
                  } ${i % 2 !== 0 && "active"} p-3 fw-bold`}
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="py-2 col-lg-3">{device?.clientId}</div>
                  <div className="py-2 col-lg-2">{device?.user?.addr}</div>
                  <div className="py-2 col-lg-2">{device?.user?.agent}</div>
                  <div className="py-2 col-lg-2">{device?.type}</div>
                  <div className="py-2 col-lg-2">{device?.date}</div>

                  <div className="py-2 col-lg-1">
                    <button
                      className="btn m-1 btn-danger"
                      onClick={() => {
                        eject(device);
                      }}
                    >
                      Eject
                    </button>
                    {!forbidden.find(
                      (u) =>
                        u?.addr == device.user.addr &&
                        u?.agent == device?.user?.agent
                    ) && (
                      <button
                        className="btn m-1 btn-danger"
                        onClick={() => {
                          forbid(device.user);
                        }}
                      >
                        <small className="small"> Forbid Owner</small>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {(category == "All" || category == "Network Traffic") && (
            <NetworkTraffic
              forbid={forbid}
              pardon={pardon}
              data={traffic}
              forbidden={forbidden}
            />
          )}

          <div
            className="mt-5"
            style={{
              position: "fixed",
              bottom: "10px",
              left: "10px",
            }}
          >
            {/* {JSON.stringify(scrollConfig)} */}
          </div>
          <div id="bottom" key={"Bottom dwelling div that never updates"}></div>
        </div>
      </section>
    </main>
  );
};

export default SysAdminIndex;

function NetworkTraffic({ data, forbid, forbidden, pardon }) {
  const [isForbidden, setIsForbidden] = useState(false);
  const [hasPaging, setHasPaging] = useState(true);
  useEffect(() => {
    const u = data.user;
    (async () =>
      setIsForbidden(
        Boolean(
          forbidden.find((v) => u?.addr == v.addr && u.agent == v.agent) &&
            "d-none"
        )
      ))();
  }, [forbidden]);
  return (
    <>
      <div id="NetworkTraffic">
        <div className="paper p-4 shadow">
          <div
            id=""
            className="row  pb-1 fw-bold"
            data-aos="fade-up"
            data-aos-delay="200"
            style={{
              position: "sticky",
              top: "0px",
              background: "#5a5a5a",
            }}
          >
            <h3
              className="fw-bold d-flex mt-0"
              style={{
                background: "#2f2f2f",
              }}
            >
              Network Traffic
              <div
                className="ms-auto"
                onClick={() => setHasPaging((prev) => !prev)}
              >
                {!hasPaging ? (
                  <div className="btn">
                    {data.length} <FaCompress className="icon" />
                  </div>
                ) : (
                  <div className="btn">
                    {`${data.length > 100 ? data.length - 100 : 0} ─ ${
                      data.length
                    }`}{" "}
                    <FaExpandArrowsAlt className="icon" />
                  </div>
                )}
              </div>
            </h3>

            <div className="py-1 col-10 col-lg-10">Type/IP_Address</div>
            <div className="py-1 col-lg-2 d-flex">
              <span className="ms-md-auto pe-md-3">Action</span>
            </div>
          </div>
          {(hasPaging
            ? data.slice(data.length > 100 ? data.length - 100 : 0, data.length)
            : data
          ).map(({ message, user }, i) => (
            <div
              id=""
              key={"f" + message + i}
              className={`row ${i % 2 !== 0 && "active"}  fw-bold`}
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="py-1 col-md-10">{message}</div>
              <div className="py-1 col-md-2 d-flex">
                <button
                  style={{ fontSize: "0.8em" }}
                  className={`btn ${
                    isForbidden ? "themebg" : "bg-danger"
                  } my-md-auto ms-md-auto me-0 btn-small p-1 text-small`}
                  onClick={() => {
                    isForbidden ? pardon(user) : forbid(user);
                    // setIsForbidden((prev) => !prev);
                  }}
                >
                  {!isForbidden ? "Forbid User" : "Pardon User"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
