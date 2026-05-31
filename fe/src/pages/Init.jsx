import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axios/api";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlaceHolder from "../components/PlaceHolder";
import {
  FaChevronRight,
  FaChevronLeft,
  FaCheck,
  FaShield,
} from "react-icons/fa6";

const Init = () => {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    password: "password",
    userspace: "individual",
    nodeType: "child",
    publicDir: "",
    defaultUploadDir: "",
    noAuthFsRead: true,
    noAuthFsWrite: true,
    safeMode: false,
    autoUpdate: true,
    sessionMaxAge: 60 * 60 * 1000,
  });
  const [step, setStep] = useState(0);

  const steps = [
    {
      key: "password",
      title: "Admin Password",
      desc: "Set a strong admin password. This will be used to authenticate to the admin interface.",
      render: () => (
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          className="w-full border rounded px-2 py-1 bg-transparent"
        />
      ),
      validate: (f) => f.password && f.password.length >= 4,
      invalidMsg: "Password must be at least 4 characters",
    },
    {
      key: "userspace",
      title: "Userspace",
      desc: "Select the default userspace. 'Individual' is typical for single-user installs.",
      render: () => (
        <select
          name="userspace"
          value={form.userspace}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 bg-transparent"
        >
          <option value="individual">Individual</option>
          <option value="organization">Organization</option>
          <option value="public_space">Public Space</option>
        </select>
      ),
    },
    {
      key: "nodeType",
      title: "Node Type",
      desc: "Choose whether this device acts as a 'child' node or a 'parent' node in multi-node setups.",
      render: () => (
        <select
          name="nodeType"
          value={form.nodeType}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 bg-transparent"
        >
          <option value="child">Child</option>
          <option value="parent">Parent</option>
        </select>
      ),
    },
    {
      key: "publicDir",
      title: "Public Directory",
      desc: "Public Directory is the directory FSdiscover's File explorer is allowed to access. Provide an absolute path (e.g. /home/user).",
      render: () => (
        <input
          name="publicDir"
          value={form.publicDir}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 bg-transparent"
          placeholder="/home/user"
        />
      ),
    },
    {
      key: "defaultUploadDir",
      title: "Default Upload Directory",
      desc: "Directory where uploaded files will be placed by default. Leave empty to use the user's current directory.",
      render: () => (
        <input
          name="defaultUploadDir"
          value={form.defaultUploadDir}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 bg-transparent"
          placeholder="/home/user/Downloads"
        />
      ),
    },
    {
      key: "noAuthFsWrite",
      title: "Upload Files without Authorization",
      desc: "Allow unauthenticated users to upload files to this machine. Only enable if you understand the risks.",
      render: () => (
        <select
          name="noAuthFsWrite"
          value={form.noAuthFsWrite}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 bg-transparent"
        >
          <option value={false}>Don't Allow</option>
          <option value={true}>Allow</option>
        </select>
      ),
    },
    {
      key: "noAuthFsRead",
      title: "Access Files without Authorization",
      desc: "Allow unauthenticated users to read files. Enabling exposes files to anyone on your network.",
      render: () => (
        <select
          name="noAuthFsRead"
          value={form.noAuthFsRead}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1 bg-transparent"
        >
          <option value={false}>Don't Allow</option>
          <option value={true}>Allow</option>
        </select>
      ),
    },
    {
      key: "safeMode",
      title: "Safe Mode",
      desc: "When enabled, FSdiscover operates with safer defaults and may disable some risky features.",
      render: () => (
        <label className="form-check">
          <input
            name="safeMode"
            type="checkbox"
            className="mr-2"
            checked={!!form.safeMode}
            onChange={handleChange}
          />
          <span className="text-sm">Enable Safe Mode</span>
        </label>
      ),
    },
    {
      key: "autoUpdate",
      title: "Automatic Updates",
      desc: "Allow FSdiscover to automatically check for updates and stage them for the next session.",
      render: () => (
        <label className="form-check">
          <input
            name="autoUpdate"
            type="checkbox"
            className="mr-2"
            checked={!!form.autoUpdate}
            onChange={handleChange}
          />
          <span className="text-sm">Enable Auto Update</span>
        </label>
      ),
    },
    {
      key: "sessionMaxAge",
      title: "Session Max Age",
      desc: "How long (in milliseconds) an authorization session remains valid. Default is 1 hour (3600000 ms).",
      render: () => (
        <input
          name="sessionMaxAge"
          value={form.sessionMaxAge}
          onChange={handleChange}
          type="number"
          className="w-full border rounded px-2 py-1 bg-transparent"
        />
      ),
    },
  ];

  useEffect(() => {
    // Only allow if served from 127.0.0.1
    if (window.location.hostname !== "127.0.0.1") {
      //   toast.error("Page forbidden by firewall");
      //   navigate("/");
      return;
    }

    let mounted = true;
    setLoading(true);
    api
      .get("/isfirstlaunch")
      .then((r) => {
        const v = r?.data;
        if (mounted && (v === 1 || v === "1")) {
          setAllowed(true);
          // fetch runtime config to prepopulate fields
          api
            .get("/runtime")
            .then((res) => {
              if (!mounted || !res || !res.data) return;
              const data = res.data;
              // Only merge keys that exist in our form state
              const keys = Object.keys(form);
              const merged = { ...form };
              for (const k of Object.keys(data)) {
                if (keys.includes(k)) merged[k] = data[k];
              }
              setForm(merged);
            })
            .catch(() => {
              // ignore runtime fetch errors; init can proceed with defaults
            })
            .finally(() => mounted && setLoading(false));
        } else {
          // not first launch: block access
          mounted && setLoading(false);
          // navigate away silently
          // navigate("/");
        }
      })
      .catch((err) => {
        toast.error("Forbidden page");
        navigate("/");
      });

    return () => (mounted = false);
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // final submit only allowed on last step
    if (step < steps.length - 1) {
      setStep((s) => Math.min(s + 1, steps.length - 1));
      return;
    }
    // validate last step if any
    try {
      const tst = toast("Initializing...", { autoClose: false });
      const res = await api.post("/init", form);
      toast.dismiss(tst);
      toast.success("Initialization successful");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data || err.message || "Init failed");
    }
  };

  const prev = () => setStep((s) => Math.max(0, s - 1));

  const goNext = () => {
    const current = steps[step];
    if (current && current.validate && !current.validate(form)) {
      toast.error(current.invalidMsg || "Invalid value");
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  if (loading) return <div className="p-3 max-w-4xl mx-auto px-4">Checking...</div>;
  if (!allowed) return null;

  const current = steps[step];

  const progress = Math.round(((step + 1) / steps.length) * 100);

  return (
    <div className="p-3 slideUp max-w-4xl mx-auto px-4 darkTheme">
      <div className="flex flex-wrap -mx-2 mb-4 items-center">
        <div className="col-auto">
          <LazyLoadImage
            effect="opacity"
            placeholder={<PlaceHolder />}
            src="/icon.png"
            height={72}
            alt="Fsdiscover"
            className="icon rounded"
          />
        </div>
        <div className="col">
          <h2 className="mb-0">Welcome to FSDiscover</h2>
          <div className="text-sm text-gray-400">
            Let's walk through a quick setup to get your instance running.
          </div>
        </div>
        <div className="col-auto text-end text-sm text-gray-400">
          Step {step + 1} of {steps.length}
        </div>
      </div>

      <div className="paper p-0 shadow-lg">
        <div className="flex flex-wrap -mx-2 g-0">
          <div
            className="md:w-1/3 px-2 border-end p-3 bg-gray-900"
            style={{ minHeight: "320px" }}
          >
            <div className="mb-3">
              <div className="text-sm text-gray-400">Progress</div>
              <div className="progress" style={{ height: "10px" }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <div className="text-sm text-gray-400 mt-2">{progress}% completed</div>
            </div>

            <div className="mt-4">
              {steps.map((s, i) => (
                <div
                  key={s.key}
                  className={`d-flex align-items-center mb-2 ${i === step ?"fw-bold" : "text-muted"}`}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      background: i <= step ? "steelblue" : "#444",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      marginRight: 10,
                    }}
                  >
                    {i < step ? (
                      <FaCheck />
                    ) : i === step ? (
                      <FaShield />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <div>
                    <div>{s.title}</div>
                    <div className="text-sm text-gray-400">
                      {s.desc.length > 60
                        ? s.desc.slice(0, 60) + "..."
                        : s.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-2/3 px-2 p-4">
            <h5 className="mb-1">{current.title}</h5>
            <div className="text-sm text-gray-400 mb-3">{current.desc}</div>
            <div className="mb-3">{current.render()}</div>

            <div className="flex mt-3">
              <button
                type="button"
                className="border border-gray-300 text-gray-700 hover:bg-gray-100 rounded px-2 py-1 mr-2"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
              {step > 0 && (
                <button
                  type="button"
                  className="border border-gray-300 text-gray-700 hover:bg-gray-100 rounded px-2 py-1 mr-2"
                  onClick={prev}
                >
                  <FaChevronLeft /> Back
                </button>
              )}
              {step < steps.length - 1 && (
                <button
                  type="button"
                  className="bg-blue-600 text-white hover:bg-blue-700 ml-auto"
                  onClick={goNext}
                >
                  Next <FaChevronRight className="ml-2" />
                </button>
              )}
              {step === steps.length - 1 && (
                <button
                  className="bg-green-600 text-white hover:bg-green-700 ml-auto"
                  onClick={handleSubmit}
                >
                  <FaCheck className="mr-1" /> Finish & Initialize
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Init;
