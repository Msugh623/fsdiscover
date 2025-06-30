import React, { useEffect, useState } from "react";
import { useStateContext } from "../state/StateContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../../axios/api";
import { toast } from "react-toastify";
import { FaLock } from "react-icons/fa";
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

  useEffect(() => {
    document.title = "Sprintet  - " + hostname + " : Admin";
    fetchConfig();
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
                <div className="py-2 col-lg-4">ID</div>
                <div className="py-2 col-lg-6">Type</div>
                <div className="py-2 col-lg-2">Action</div>
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
                  <div className="py-2 col-lg-4">{device?.clientId}</div>
                  <div className="py-2 col-lg-6">{device?.type}</div>
                  <div className="py-2 col-lg-2">
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        eject(device);
                      }}
                    >
                      Eject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default SysAdminIndex;

// const AppDetails = ({ app }) => {
//   const { setPop, fetchSrc } = useStateContext();
//   const [isEdit, setIsEdit] = useState("");

//   const [editData, setEditData] = useState({
//     ...app,
//   });

//   const handleSubmit = async () => {
//     const tst = toast("updating...", { autoClose: false });
//     try {
//       const _ = await api.put("/rq/app/" + app.id, {
//         ...editData,
//       });
//       fetchSrc();
//       setIsEdit("");
//     } catch (err) {
//       toast.error(
//         <div
//           dangerouslySetInnerHTML={{
//             __html: `${err?.response?.data || err.message || "" + err}`,
//           }}
//         ></div>
//       );
//     } finally {
//       toast.dismiss(tst);
//     }
//   };

//   const handleInput = (e) => {
//     setEditData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   useEffect(() => {
//     fetchSrc();
//   }, []);

//   return (
//     <div className="col-12 col-sm-11 col-md-8 col-lg-6 mb-4 mx-auto mt-3 mt-sm-5 ">
//       <div className="item-wrap rounded shadow growUp darkTheme">
//         <div
//           className="p-2 p-sm-3"
//           style={{
//             maxHeight: "80vh",
//             overflowY: "auto",
//           }}
//         >
//           <h5 className="d-flex">
//             {app?.name}
//             <Link
//               className="readmore custom-navmenu bg-danger text-light growIn ms-auto"
//               onClick={() => {
//                 confirm("Delete ?") &&
//                   (async () => {
//                     const tst = toast("deleting...", { autoClose: false });
//                     try {
//                       const _ = await api.delete("/rq/app/" + app?.id);
//                       setPop("");
//                     } catch (err) {
//                       toast.error(
//                         `ERROR: ${err?.response?.data?.message || err.message}`
//                       );
//                     } finally {
//                       toast.dismiss(tst);
//                     }
//                   })();
//               }}
//             >
//               <FaTrash className="fs-6" />
//             </Link>
//             <Link
//               className="readmore custom-navmenu bg-primary text-light growIn ms-1"
//               onClick={() => {
//                 setPop("");
//               }}
//             >
//               <BiX className="fs-5" />
//             </Link>
//           </h5>
//           <div className="row align-items-stretch">
//             <div className="col-sm-5 " data-aos="fade-up">
//               <LazyLoadImage
//                 effect="opacity"
//                 placeholder={<PlaceHolder />}
//                 src={app.icon}
//                 className="img-fluid"
//                 alt=""
//               />
//               <div className="p-1 panel mb-3">
//                 {isEdit == "icon" ? (
//                   <div>
//                     <input
//                       type="text"
//                       className="form-control"
//                       autoFocus
//                       value={editData.icon}
//                       name="icon"
//                       onChange={handleInput}
//                     />
//                     <button
//                       className="shadow-sm ms-auto fs-4 border-0"
//                       onClick={() =>
//                         setIsEdit((prev) => (prev == "icon" ? "" : "icon"))
//                       }
//                     >
//                       <BiX />
//                     </button>
//                     <button
//                       className=" shadow-sm ms-auto bg-primary border-0 text-light"
//                       onClick={handleSubmit}
//                     >
//                       <BiSync className="fs-4 icon" />
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="d-flex">
//                     <div
//                       className="text-truncate"
//                       style={{ whiteSpace: "pre-wrap" }}
//                     >
//                       {editData?.icon}
//                     </div>
//                     <button
//                       className="btn shadow-sm ms-auto"
//                       onClick={() =>
//                         setIsEdit((prev) => (prev == "icon" ? "" : "icon"))
//                       }
//                     >
//                       <BiPencil />
//                     </button>
//                   </div>
//                 )}
//               </div>
//               <div className="mb-4 p-1 panel">
//                 {isEdit == "location" ? (
//                   <div>
//                     <input
//                       type="text"
//                       className="form-control"
//                       autoFocus
//                       value={editData.location}
//                       name="location"
//                       onChange={handleInput}
//                     />
//                     <button
//                       className="shadow-sm ms-auto fs-4 border-0"
//                       onClick={() =>
//                         setIsEdit((prev) =>
//                           prev == "location" ? "" : "location"
//                         )
//                       }
//                     >
//                       <BiX />
//                     </button>
//                     <button
//                       className=" shadow-sm ms-auto bg-primary border-0 text-light"
//                       onClick={handleSubmit}
//                     >
//                       <BiSync className="fs-4 location" />
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="d-flex">
//                     {editData?.location}{" "}
//                     <button
//                       className="btn shadow-sm ms-auto"
//                       onClick={() =>
//                         setIsEdit((prev) =>
//                           prev == "location" ? "" : "location"
//                         )
//                       }
//                     >
//                       <BiPencil />
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div
//               className="col-sm-7 ml-auto mt-3 mt-sm-0"
//               data-aos="fade-up"
//               data-aos-delay="100"
//             >
//               <div className="sticky-content">
//                 <h3 className="h3 p-2 panel mb-3">
//                   {isEdit == "name" ? (
//                     <div>
//                       <input
//                         type="text"
//                         className="form-control"
//                         autoFocus
//                         value={editData.name}
//                         name="name"
//                         onChange={handleInput}
//                       />
//                       <button
//                         className="shadow-sm ms-auto fs-4 border-0"
//                         onClick={() =>
//                           setIsEdit((prev) => (prev == "name" ? "" : "name"))
//                         }
//                       >
//                         <BiX />
//                       </button>
//                       <button
//                         className=" shadow-sm ms-auto bg-primary border-0 text-light"
//                         onClick={handleSubmit}
//                       >
//                         <BiSync className="fs-4 icon" />
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="d-flex">
//                       {editData?.name}{" "}
//                       <button
//                         className="btn shadow-sm ms-auto"
//                         onClick={() =>
//                           setIsEdit((prev) => (prev == "name" ? "" : "name"))
//                         }
//                       >
//                         <BiPencil />
//                       </button>
//                     </div>
//                   )}
//                 </h3>

//                 <div className="p-1 panel mb-3">
//                   {isEdit == "category" ? (
//                     <div>
//                       <input
//                         type="text"
//                         className="form-control"
//                         autoFocus
//                         value={editData.category}
//                         name="category"
//                         onChange={handleInput}
//                       />
//                       <button
//                         className="shadow-sm ms-auto fs-4 border-0"
//                         onClick={() =>
//                           setIsEdit((prev) =>
//                             prev == "category" ? "" : "category"
//                           )
//                         }
//                       >
//                         <BiX />
//                       </button>
//                       <button
//                         className=" shadow-sm ms-auto bg-primary border-0 text-light"
//                         onClick={handleSubmit}
//                       >
//                         <BiSync className="fs-4 icon" />
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="d-flex">
//                       {editData?.category}{" "}
//                       <button
//                         className="btn shadow-sm ms-auto"
//                         onClick={() =>
//                           setIsEdit((prev) =>
//                             prev == "category" ? "" : "category"
//                           )
//                         }
//                       >
//                         <BiPencil />
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <div className="panel mb-3">
//                   <label className="px-2">Is Pinned</label>
//                   <hr className="m-0" />
//                   <div className="d-flex">
//                     <select
//                       type="text"
//                       name="pinned"
//                       value={editData.pinned}
//                       onChange={handleInput}
//                       className="form-control shadow-sm"
//                       required
//                     >
//                       <option value={""}>false</option>
//                       <option value={true}>true</option>
//                     </select>
//                     <button
//                       className=" shadow-sm ms-auto bg-primary border-0 text-light"
//                       onClick={handleSubmit}
//                     >
//                       <BiSync className="fs-4 icon" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mb-5 panel">
//                   <div
//                     className=" p-2"
//                     onDoubleClick={() =>
//                       setIsEdit((prev) => (prev == "about" ? "" : "about"))
//                     }
//                   >
//                     {isEdit == "about" ? (
//                       <div>
//                         <textarea
//                           type="text"
//                           className="form-control"
//                           value={editData.about}
//                           rows="6"
//                           name="about"
//                           autoFocus
//                           onChange={handleInput}
//                         ></textarea>
//                         <button
//                           className="shadow-sm ms-auto fs-4 border-0"
//                           onClick={() =>
//                             setIsEdit((prev) =>
//                               prev == "about" ? "" : "about"
//                             )
//                           }
//                         >
//                           <BiX />
//                         </button>
//                         <button
//                           className=" shadow-sm ms-auto bg-primary border-0 text-light"
//                           onClick={handleSubmit}
//                         >
//                           <BiSync className="fs-4 icon" />
//                         </button>
//                       </div>
//                     ) : (
//                       <div className="d-flex">
//                         {" "}
//                         {editData?.about}{" "}
//                         <button
//                           className="btn shadow-sm ms-auto"
//                           onClick={() =>
//                             setIsEdit((prev) =>
//                               prev == "about" ? "" : "about"
//                             )
//                           }
//                         >
//                           <BiPencil />
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
