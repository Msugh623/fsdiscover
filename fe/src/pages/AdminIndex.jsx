import React, { useEffect, useState } from "react";
import { useStateContext } from "../state/StateContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../../axios/api";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import { BiPencil, BiSync, BiX } from "react-icons/bi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlaceHolder from "../components/PlaceHolder";

const AdminIndex = () => {
  const {
    apps,
    fetchSrc,
    categories,
    hostname,
    runtimeConfig,
    profile,
    setMenuPos,
  } = useStateContext();
  const [prs, setPrs] = useState(apps);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    category == "All"
      ? setPrs(
          apps.filter(
            (a) =>
              runtimeConfig?.apps?.includes(a?.location) ||
              a?.location.includes("devices")
          )
        )
      : setPrs(
          apps
            .filter((cr) => cr.category == category)
            .filter((a) => runtimeConfig?.apps?.includes(a?.location))
        );
  }, [category, apps, runtimeConfig?.apps]);

  useEffect(() => {
    document.title = "Sprintet Fsdiscover  - " + hostname;
    fetchSrc();
    setMenuPos({
      x: 40,
      y: window.innerHeight - 80,
    });
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
                <div className="d-flex pb-2">
                  <Link
                    to={!localStorage.access ? `/login` : "/admin"}
                    className="rounded shadow-lg p-3 ms-auto py-2 border border-dashed readmore custom-navmenu text-light"
                  >
                    {!localStorage.access ? "authorize" : "Admin"}
                  </Link>
                </div>
                <span className="text-primary">Host:</span> {hostname} <br />
                <span className="text-primary">Profile: </span>
                {profile.addr} <br />
                <span className="text-primary">UUID: </span> {profile.uuid}
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
                <a
                  href="#All"
                  data-category="*"
                  className={
                    "p-1 mx-1 shadow rounded" +
                    (category == "All" && "active rounded border")
                  }
                  onClick={() => setCategory("All")}
                >
                  All{" "}
                </a>
                {categories.map((flt) => (
                  <a
                    key={flt}
                    href={`#${flt}`}
                    data-category="*"
                    className={
                      "p-1 border-bottom mx-1 shadow rounded me-1" +
                      (category == flt && "active border ")
                    }
                    onClick={() => setCategory("" + flt)}
                  >
                    {flt}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div
            id="portfolio-grid"
            className="row"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            {prs.map((app, i) => {
              return <AppCard key={"" + app.id + i} app={app} />;
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminIndex;

const AppCard = ({ app }) => {
  const navigate = useNavigate();

  return (
    <div className="col-6 col-md-4 col-lg-3 py-3">
      <div
        onClick={() =>
          app.location.includes("http")
            ? (location.href = app.location)
            : navigate(app.location)
        }
      >
        <div className="p-2 active rounded fadeIn">
          {app?.pinned && (
            <div className="d-flex" style={{ position: "absolute" }}>
              <div className="p-1 btn btn-primary shadow rounded"></div>
            </div>
          )}
          <div
            className="row"
            style={{
              minHeight: "90px",
            }}
          >
            <div className="col-sm-5 my-auto">
              <LazyLoadImage
                effect="opacity"
                placeholder={<PlaceHolder />}
                src={app.icon}
                className="my-auto img-fluid rounded"
                alt=""
              />
            </div>
            <div className="col-sm-7">
              <h4 className="text-ligt mb-1">{app?.name}</h4>
              <div>{app?.category}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AppDetails = ({ app }) => {
  const { setPop, fetchSrc } = useStateContext();
  const [isEdit, setIsEdit] = useState("");

  const [editData, setEditData] = useState({
    ...app,
  });

  const handleSubmit = async () => {
    const tst = toast("updating...", { autoClose: false });
    try {
      const _ = await api.put("/rq/app/" + app.id, {
        ...editData,
      });
      fetchSrc();
      setIsEdit("");
    } catch (err) {
      toast.error(
        <div
          dangerouslySetInnerHTML={{
            __html: `${err?.response?.data || err.message || "" + err}`,
          }}
        ></div>
      );
    } finally {
      toast.dismiss(tst);
    }
  };

  const handleInput = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    fetchSrc();
  }, []);

  return (
    <div className="col-12 col-sm-11 col-md-8 col-lg-6 mb-4 mx-auto mt-3 mt-sm-5 ">
      <div className="item-wrap rounded shadow growUp darkTheme">
        <div
          className="p-2 p-sm-3"
          style={{
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <h5 className="d-flex">
            {app?.name}
            <Link
              className="readmore custom-navmenu bg-danger text-light growIn ms-auto"
              onClick={() => {
                confirm("Delete ?") &&
                  (async () => {
                    const tst = toast("deleting...", { autoClose: false });
                    try {
                      const _ = await api.delete("/rq/app/" + app?.id);
                      setPop("");
                    } catch (err) {
                      toast.error(
                        <div
                          dangerouslySetInnerHTML={{
                            __html: `${
                              err?.response?.data || err.message || "" + err
                            }`,
                          }}
                        ></div>
                      );
                    } finally {
                      toast.dismiss(tst);
                    }
                  })();
              }}
            >
              <FaTrash className="fs-6" />
            </Link>
            <Link
              className="readmore custom-navmenu bg-primary text-light growIn ms-1"
              onClick={() => {
                setPop("");
              }}
            >
              <BiX className="fs-5" />
            </Link>
          </h5>
          <div className="row align-items-stretch">
            <div className="col-sm-5 " data-aos="fade-up">
              <LazyLoadImage
                effect="opacity"
                placeholder={<PlaceHolder />}
                src={app.icon}
                className="img-fluid"
                alt=""
              />
              <div className="p-1 panel mb-3">
                {isEdit == "icon" ? (
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      autoFocus
                      value={editData.icon}
                      name="icon"
                      onChange={handleInput}
                    />
                    <button
                      className="shadow-sm ms-auto fs-4 border-0"
                      onClick={() =>
                        setIsEdit((prev) => (prev == "icon" ? "" : "icon"))
                      }
                    >
                      <BiX />
                    </button>
                    <button
                      className=" shadow-sm ms-auto bg-primary border-0 text-light"
                      onClick={handleSubmit}
                    >
                      <BiSync className="fs-4 icon" />
                    </button>
                  </div>
                ) : (
                  <div className="d-flex">
                    <div
                      className="text-truncate"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {editData?.icon}
                    </div>
                    <button
                      className="btn shadow-sm ms-auto"
                      onClick={() =>
                        setIsEdit((prev) => (prev == "icon" ? "" : "icon"))
                      }
                    >
                      <BiPencil />
                    </button>
                  </div>
                )}
              </div>
              <div className="mb-4 p-1 panel">
                {isEdit == "location" ? (
                  <div>
                    <input
                      type="text"
                      className="form-control"
                      autoFocus
                      value={editData.location}
                      name="location"
                      onChange={handleInput}
                    />
                    <button
                      className="shadow-sm ms-auto fs-4 border-0"
                      onClick={() =>
                        setIsEdit((prev) =>
                          prev == "location" ? "" : "location"
                        )
                      }
                    >
                      <BiX />
                    </button>
                    <button
                      className=" shadow-sm ms-auto bg-primary border-0 text-light"
                      onClick={handleSubmit}
                    >
                      <BiSync className="fs-4 location" />
                    </button>
                  </div>
                ) : (
                  <div className="d-flex">
                    {editData?.location}{" "}
                    <button
                      className="btn shadow-sm ms-auto"
                      onClick={() =>
                        setIsEdit((prev) =>
                          prev == "location" ? "" : "location"
                        )
                      }
                    >
                      <BiPencil />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div
              className="col-sm-7 ml-auto mt-3 mt-sm-0"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="sticky-content">
                <h3 className="h3 p-2 panel mb-3">
                  {isEdit == "name" ? (
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        autoFocus
                        value={editData.name}
                        name="name"
                        onChange={handleInput}
                      />
                      <button
                        className="shadow-sm ms-auto fs-4 border-0"
                        onClick={() =>
                          setIsEdit((prev) => (prev == "name" ? "" : "name"))
                        }
                      >
                        <BiX />
                      </button>
                      <button
                        className=" shadow-sm ms-auto bg-primary border-0 text-light"
                        onClick={handleSubmit}
                      >
                        <BiSync className="fs-4 icon" />
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex">
                      {editData?.name}{" "}
                      <button
                        className="btn shadow-sm ms-auto"
                        onClick={() =>
                          setIsEdit((prev) => (prev == "name" ? "" : "name"))
                        }
                      >
                        <BiPencil />
                      </button>
                    </div>
                  )}
                </h3>

                <div className="p-1 panel mb-3">
                  {isEdit == "category" ? (
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        autoFocus
                        value={editData.category}
                        name="category"
                        onChange={handleInput}
                      />
                      <button
                        className="shadow-sm ms-auto fs-4 border-0"
                        onClick={() =>
                          setIsEdit((prev) =>
                            prev == "category" ? "" : "category"
                          )
                        }
                      >
                        <BiX />
                      </button>
                      <button
                        className=" shadow-sm ms-auto bg-primary border-0 text-light"
                        onClick={handleSubmit}
                      >
                        <BiSync className="fs-4 icon" />
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex">
                      {editData?.category}{" "}
                      <button
                        className="btn shadow-sm ms-auto"
                        onClick={() =>
                          setIsEdit((prev) =>
                            prev == "category" ? "" : "category"
                          )
                        }
                      >
                        <BiPencil />
                      </button>
                    </div>
                  )}
                </div>

                <div className="panel mb-3">
                  <label className="px-2">Is Pinned</label>
                  <hr className="m-0" />
                  <div className="d-flex">
                    <select
                      type="text"
                      name="pinned"
                      value={editData.pinned}
                      onChange={handleInput}
                      className="form-control shadow-sm"
                      required
                    >
                      <option value={""}>false</option>
                      <option value={true}>true</option>
                    </select>
                    <button
                      className=" shadow-sm ms-auto bg-primary border-0 text-light"
                      onClick={handleSubmit}
                    >
                      <BiSync className="fs-4 icon" />
                    </button>
                  </div>
                </div>

                <div className="mb-5 panel">
                  <div
                    className=" p-2"
                    onDoubleClick={() =>
                      setIsEdit((prev) => (prev == "about" ? "" : "about"))
                    }
                  >
                    {isEdit == "about" ? (
                      <div>
                        <textarea
                          type="text"
                          className="form-control"
                          value={editData.about}
                          rows="6"
                          name="about"
                          autoFocus
                          onChange={handleInput}
                        ></textarea>
                        <button
                          className="shadow-sm ms-auto fs-4 border-0"
                          onClick={() =>
                            setIsEdit((prev) =>
                              prev == "about" ? "" : "about"
                            )
                          }
                        >
                          <BiX />
                        </button>
                        <button
                          className=" shadow-sm ms-auto bg-primary border-0 text-light"
                          onClick={handleSubmit}
                        >
                          <BiSync className="fs-4 icon" />
                        </button>
                      </div>
                    ) : (
                      <div className="d-flex">
                        {" "}
                        {editData?.about}{" "}
                        <button
                          className="btn shadow-sm ms-auto"
                          onClick={() =>
                            setIsEdit((prev) =>
                              prev == "about" ? "" : "about"
                            )
                          }
                        >
                          <BiPencil />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
