import React, { useEffect, useState } from "react";
import { useStateContext } from "../state/StateContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../../axios/api";
import { toast } from "material-react-toastify";
import { FaTrash } from "react-icons/fa";
import { BiPencil, BiSync, BiX } from "react-icons/bi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlaceHolder from "../components/PlaceHolder";
import { FaGear } from "react-icons/fa6";

export default function AdminIndex() {
  const {
    apps,
    fetchSrc,
    hostname,
    runtimeConfig,
    profile,
    setMenuPos,
    setSafeMode,
  } = useStateContext();
  const [prs, setPrs] = useState(apps);
  const [category, _] = useState("All");

  useEffect(() => {
    category == "All"
      ? setPrs(
          apps.filter(
            (a) =>
              runtimeConfig?.apps?.includes(a?.location) ||
              a?.location.includes("devices"),
          ),
        )
      : setPrs(
          apps
            .filter((cr) => cr.category == category)
            .filter((a) => runtimeConfig?.apps?.includes(a?.location)),
        );
  }, [category, apps, runtimeConfig?.apps]);

  useEffect(() => {
    document.title = "SprintET FSdiscover - " + hostname;
    (async () => {
      try {
        const res = await api.get("/safemode");
        const v = res?.data;
        setSafeMode(Boolean(Number(v)));
      } catch {
        // ignore
      }
    })();
    fetchSrc();
    setMenuPos({
      x: 40,
      y: window.innerHeight - 90,
    });
  }, []);

  return (
    <main
      id="main"
      className="bg-black min-h-screen text-white antialiased selection:bg-white/20"
    >
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between pb-8  gap-6">
            <div className="flex flex-col text-[13px] text-white/50 font-mono tracking-tight gap-1 bg-[#111] border border-white/10 rounded-2xl p-5 w-full shadow-lg">
              <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-3">
                <div className="font-sans flex gap-x-2 text-white">
                  <LazyLoadImage
                    effect="opacity"
                    placeholder={<PlaceHolder />}
                    src="/icon.png"
                    height={"48px"}
                    className="h-12 min-w-12 object-cover rounded-xl"
                    alt="fsdiscover"
                  />
                  <div>
                    <h1 className="text-[1.7em] icon font-bold">FSdiscover</h1>
                    <div className="text-[0.55em] sm:text-[0.7em]">
                      Your computer in the palm of your hands
                    </div>
                  </div>
                </div>
                <Link
                  to={!localStorage.access ? `/login` : "/admin"}
                  className="flex items-center gap-1.5 text-[12px] font-sans font-medium text-white bg-white/5 border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <FaGear className="text-xs text-white/50" /> Settings
                </Link>
              </div>
              <div>
                <span className="text-white/80">host:</span> {hostname}
              </div>
              <div>
                <span className="text-white/80">profile:</span> {profile.addr}
              </div>
              <div className="truncate">
                <span className="text-white/80">uuid:</span> {profile.uuid}
              </div>
            </div>
          </div>

          <div
            id="portfolio-grid"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {prs.map((app, i) => (
              <AppCard key={"" + app.id + i} app={app} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

const AppCard = ({ app }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        app.location.includes("http")
          ? (location.href = app.location)
          : navigate(app.location)
      }
      className="group relative cursor-pointer bg-[#111] border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-[#161616]"
    >
      {app?.pinned && (
        <span className="absolute top-3 right-3 w-2 h-2 bg-white rounded-full ring-4 ring-white/10" />
      )}

      <div className="flex flex-col gap-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-white/10 p-2">
          <LazyLoadImage
            effect="opacity"
            placeholder={<PlaceHolder />}
            src={app.icon}
            className="w-full h-full object-contain rounded-md"
            alt=""
          />
        </div>
        <div>
          <h4 className="text-[14px] font-semibold text-white truncate mb-1">
            {app?.name}
          </h4>
          <span className="text-[12px] font-medium text-white/50 tracking-wide">
            {app?.category}
          </span>
        </div>
      </div>
    </div>
  );
};

const AppDetails = ({ app }) => {
  const { setPop, fetchSrc } = useStateContext();
  const [isEdit, setIsEdit] = useState("");
  const [editData, setEditData] = useState({ ...app });

  const handleSubmit = async () => {
    const tst = toast("updating...", { autoClose: false });
    try {
      await api.put("/rq/app/" + app.id, { ...editData });
      fetchSrc();
      setIsEdit("");
    } catch (err) {
      toast.error(<div>{err?.response?.data || err.message || "" + err}</div>);
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
    <div className="w-full max-w-xl mx-auto mt-16 p-4">
      <div className="bg-[#111] border border-white/10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#0a0a0a]">
          <h5 className="text-[15px] font-semibold text-white">
            {app?.name || "App Configurations"}
          </h5>
          <div className="flex items-center gap-3">
            <button
              className="p-2 text-white/50 hover:text-red-500 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              onClick={() => {
                if (confirm("Delete structural app mapping?")) {
                  (async () => {
                    const tst = toast("deleting...", { autoClose: false });
                    try {
                      await api.delete("/rq/app/" + app?.id);
                      setPop("");
                    } catch (err) {
                      toast.error(
                        <div>
                          {err?.response?.data || err.message || "" + err}
                        </div>,
                      );
                    } finally {
                      toast.dismiss(tst);
                    }
                  })();
                }
              }}
            >
              <FaTrash className="text-sm" />
            </button>
            <button
              className="p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              onClick={() => setPop("")}
            >
              <BiX className="text-xl" />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          <div className="flex gap-5 items-start border-b border-white/10 pb-6">
            <div className="w-20 h-20 rounded-2xl bg-black border border-white/10 p-3 flex-shrink-0">
              <LazyLoadImage
                effect="opacity"
                placeholder={<PlaceHolder />}
                src={app.icon}
                className="w-full h-full object-contain"
                alt=""
              />
            </div>

            <div className="flex-1 space-y-2 mt-1">
              <div className="text-[13px]">
                <span className="text-white/50 block mb-2 font-medium">
                  App Identifier
                </span>
                {isEdit === "name" ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2 text-[14px] text-white focus:outline-none focus:border-white/30"
                      value={editData.name}
                      name="name"
                      onChange={handleInput}
                      autoFocus
                    />
                    <button
                      onClick={handleSubmit}
                      className="bg-white text-black px-4 py-2 rounded-xl font-medium"
                    >
                      <BiSync className="text-lg" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    <span className="font-semibold text-white text-[14px]">
                      {editData?.name}
                    </span>
                    <button
                      onClick={() => setIsEdit("name")}
                      className="text-white/50 hover:text-white"
                    >
                      <BiPencil />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5 text-[13px]">
            <div>
              <span className="text-white/50 block mb-2 font-medium">
                Category
              </span>
              {isEdit === "category" ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-white/30"
                    value={editData.category}
                    name="category"
                    onChange={handleInput}
                    autoFocus
                  />
                  <button
                    onClick={handleSubmit}
                    className="bg-white text-black px-4 rounded-xl font-medium"
                  >
                    <BiSync className="text-lg" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-white">{editData?.category}</span>
                  <button
                    onClick={() => setIsEdit("category")}
                    className="text-white/50 hover:text-white"
                  >
                    <BiPencil />
                  </button>
                </div>
              )}
            </div>

            <div>
              <span className="text-white/50 block mb-2 font-medium">
                Routing Target
              </span>
              {isEdit === "location" ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-black border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-white/30"
                    value={editData.location}
                    name="location"
                    onChange={handleInput}
                    autoFocus
                  />
                  <button
                    onClick={handleSubmit}
                    className="bg-white text-black px-4 rounded-xl font-medium"
                  >
                    <BiSync className="text-lg" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="font-mono text-white/70 truncate max-w-[340px]">
                    {editData?.location}
                  </span>
                  <button
                    onClick={() => setIsEdit("location")}
                    className="text-white/50 hover:text-white"
                  >
                    <BiPencil />
                  </button>
                </div>
              )}
            </div>

            <div>
              <span className="text-white/50 block mb-2 font-medium">
                Pin Status
              </span>
              <div className="flex gap-2 bg-white/5 p-2 rounded-xl border border-white/5">
                <select
                  name="pinned"
                  value={editData.pinned}
                  onChange={handleInput}
                  className="flex-1 bg-transparent text-white border-0 outline-none px-2 cursor-pointer appearance-none"
                >
                  <option value="" className="bg-black">
                    False
                  </option>
                  <option value="true" className="bg-black">
                    True
                  </option>
                </select>
                <button
                  onClick={handleSubmit}
                  className="bg-white text-black px-4 py-1.5 rounded-lg font-medium flex items-center gap-2"
                >
                  <BiSync /> Apply
                </button>
              </div>
            </div>

            <div>
              <span className="text-white/50 block mb-2 font-medium">
                Description
              </span>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                {isEdit === "about" ? (
                  <div className="space-y-3">
                    <textarea
                      className="w-full bg-black border border-white/10 rounded-xl p-3 text-white text-[13px] focus:outline-none focus:border-white/30 resize-none"
                      value={editData.about}
                      rows="4"
                      name="about"
                      onChange={handleInput}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEdit("")}
                        className="bg-transparent text-white px-4 py-2 rounded-lg font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="bg-white text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        <BiSync /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-white/80 whitespace-pre-wrap leading-relaxed m-0 flex-1">
                      {editData?.about || "No description provided."}
                    </p>
                    <button
                      onClick={() => setIsEdit("about")}
                      className="text-white/50 hover:text-white"
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
  );
};
