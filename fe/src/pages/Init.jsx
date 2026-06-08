import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axios/api";
import { toast } from "material-react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PlaceHolder from "../components/PlaceHolder";
import {
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";

const Init = () => {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    password: "password",
    userspace: "individual",
    nodeType: "child",
    publicDir: "",
    defaultUploadDir: "",
    safemodeUploadDir: "",
    noAuthFsRead: true,
    noAuthFsWrite: true,
    safeMode: false,
    autoUpdate: true,
    sessionMaxAge: 60 * 60 * 1000,
  });
  const [sessionValue, setSessionValue] = useState(1);
  const [sessionUnit, setSessionUnit] = useState("hours");
  const [step, setStep] = useState(0);

  const baseInputClass =
    "w-full bg-transparent border-b border-white/20 pb-3 text-center text-2xl text-white outline-none transition focus:border-white placeholder:text-white/20";
  const baseSelectClass =
    "w-full appearance-none bg-transparent border-b border-white/20 pb-3 text-center text-2xl text-white outline-none transition focus:border-white cursor-pointer";

  const steps = [
    {
      key: "welcome",
      title: "Welcome to FSdiscover.",
      desc: "Take control of your devices and share files easily within your network.",
      render: () => (
        <div className="flex flex-col items-center gap-4">
          <p className="mx-auto max-w-md text-xl font-light leading-relaxed text-white/70">
            Connect instantly with any device on your local network. No extra
            apps. No cloud required.
          </p>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent p-8 shadow-2xl backdrop-blur-md">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1)_0,transparent_100%)]"></div>
            <h3 className="relative bg-gradient-to-br from-white to-white/50 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
              Your computer in the palm of your hands.
            </h3>
          </div>
        </div>
      ),
      validate: () => true,
    },
    {
      key: "password",
      title: "Secure your instance.",
      desc: "Set a strong administrator password for FSdiscover.",
      render: () => (
        <div className="relative mx-auto w-full max-w-sm">
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type={showPassword ? "text" : "password"}
            className={baseInputClass}
            placeholder="Enter password"
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white/40 transition hover:text-white"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
      ),
      validate: (f) => f.password && f.password.length >= 4,
      invalidMsg: "Password must be at least 4 characters",
    },
    {
      key: "userspace",
      title: "Define your space.",
      desc: "Whether you are using FSdiscover in an organization or as an individual.",
      render: () => (
        <select
          name="userspace"
          value={form.userspace}
          onChange={handleChange}
          className={baseSelectClass}
        >
          <option value="individual" className="bg-[#111] text-base">
            Individual
          </option>
          <option value="organization" className="bg-[#111] text-base">
            Organization
          </option>
          <option value="public_space" className="bg-[#111] text-base">
            Public Space
          </option>
        </select>
      ),
    },
    {
      key: "nodeType",
      title: "Establish node hierarchy.",
      desc: "Whether this is the primary device running FSdiscover in your network or an additional child device.",
      render: () => (
        <select
          name="nodeType"
          value={form.nodeType}
          onChange={handleChange}
          className={baseSelectClass}
        >
          <option value="child" className="bg-[#111] text-base">
            Child Node
          </option>
          <option value="parent" className="bg-[#111] text-base">
            Primary Node
          </option>
        </select>
      ),
    },
    {
      key: "publicDir",
      title: "Set file manager folder.",
      desc: "Specify the absolute path for FSdiscover to discover in the file manager. Leave empty to use default, by default FSdiscover uses the computer's home folder",
      render: () => (
        <input
          name="publicDir"
          value={form.publicDir}
          onChange={handleChange}
          className={baseInputClass}
          placeholder={"/home/user"}
          autoFocus
        />
      ),
    },
    {
      key: "defaultUploadDir",
      title: "Route your uploads.",
      desc: "Set the default destination for incoming files. Leave empty to use default, by default FSdiscover dynamically places sent files in on openned folder",
      render: () => (
        <input
          name="defaultUploadDir"
          value={form.defaultUploadDir}
          onChange={handleChange}
          className={baseInputClass}
          placeholder="/home/user/*"
          autoFocus
        />
      ),
    },
    {
      key: "safemodeUploadDir",
      title: "Safe Mode upload folder",
      desc: "Directory where files uploaded via Safe Mode are placed. Leave empty to use default upload directory.",
      render: () => (
        <input
          name="safemodeUploadDir"
          value={form.safemodeUploadDir}
          onChange={handleChange}
          className={baseInputClass}
          placeholder="/home/user/safedrops"
          autoFocus
        />
      ),
    },
    {
      key: "noAuthFsWrite",
      title: "Configure write access.",
      desc: "Control wether files can be sent to this computer without login",
      render: () => (
        <select
          name="noAuthFsWrite"
          value={form.noAuthFsWrite}
          onChange={handleChange}
          className={baseSelectClass}
        >
          <option value={false} className="bg-[#111] text-base">
            Require Authentication
          </option>
          <option value={true} className="bg-[#111] text-base">
            Allow Unauthenticated
          </option>
        </select>
      ),
    },
    {
      key: "noAuthFsRead",
      title: "Configure read access.",
      desc: "Control wether files can be discovered without login",
      render: () => (
        <select
          name="noAuthFsRead"
          value={form.noAuthFsRead}
          onChange={handleChange}
          className={baseSelectClass}
        >
          <option value={false} className="bg-[#111] text-base">
            Require Authentication
          </option>
          <option value={true} className="bg-[#111] text-base">
            Allow Unauthenticated
          </option>
        </select>
      ),
    },
    {
      key: "safeMode",
      title: "Enable restrictions.",
      desc: "For public environments like business centers. Unauthenticated users get a dedicated screen restricted to safe file uploads.",
      render: () => (
        <label className="flex cursor-pointer items-center justify-center gap-4 py-4">
          <input
            name="safeMode"
            type="checkbox"
            className="h-6 w-6 accent-white"
            checked={!!form.safeMode}
            onChange={handleChange}
          />
          <span className="text-xl font-light tracking-wide text-white">
            Safe Mode Active
          </span>
        </label>
      ),
    },
    {
      key: "autoUpdate",
      title: "Stay current.",
      desc: "Automatically fetch and stage system updates.",
      render: () => (
        <label className="flex cursor-pointer items-center justify-center gap-4 py-4">
          <input
            name="autoUpdate"
            type="checkbox"
            className="h-6 w-6 accent-white"
            checked={!!form.autoUpdate}
            onChange={handleChange}
          />
          <span className="text-xl font-light tracking-wide text-white">
            Auto Updates Active
          </span>
        </label>
      ),
    },
    {
      key: "sessionMaxAge",
      title: "Session duration.",
      desc: "Set authorization lifespan in milliseconds.",
      render: () => (
        <div>
          <div className="mt-2 flex w-full gap-2">
            <input
              type="number"
              min={0}
              step="any"
              value={sessionValue}
              onChange={(e) => {
                const v = Number(e.target.value) || 0;
                setSessionValue(v);
                let ms = 0;
                switch (sessionUnit) {
                  case "seconds":
                    ms = Math.round(v * 1000);
                    break;
                  case "minutes":
                    ms = Math.round(v * 60000);
                    break;
                  case "days":
                    ms = Math.round(v * 86400000);
                    break;
                  default:
                    ms = Math.round(v * 3600000);
                }
                setForm((p) => ({ ...p, sessionMaxAge: ms }));
              }}
              className={baseInputClass}
              autoFocus
            />
            <select
              value={sessionUnit}
              onChange={(e) => {
                const unit = e.target.value;
                setSessionUnit(unit);
                const v = Number(sessionValue) || 0;
                let ms = 0;
                switch (unit) {
                  case "seconds":
                    ms = Math.round(v * 1000);
                    break;
                  case "minutes":
                    ms = Math.round(v * 60000);
                    break;
                  case "days":
                    ms = Math.round(v * 86400000);
                    break;
                  default:
                    ms = Math.round(v * 3600000);
                }
                setForm((p) => ({ ...p, sessionMaxAge: ms }));
              }}
              className={baseSelectClass}
            >
              <option value="seconds">Seconds</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>
          <div className="text-xs text-white/50 mt-2">
            Default unit: hours | Current maxAge: {form.sessionMaxAge} ms
          </div>
        </div>
      ),
    },
    {
      key: "summary",
      title: "Review your configuration.",
      desc: "Verify your settings before initializing the system.",
      render: () => (
        <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-2xl backdrop-blur-md">
          <div className="space-y-4 text-sm font-light text-white/80">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>Userspace</span>
              <span className="font-medium text-white capitalize">
                {form.userspace.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>Node Type</span>
              <span className="font-medium text-white capitalize">
                {form.nodeType}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>Public Directory</span>
              <span className="font-medium text-white">
                {form.publicDir || "None set"}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>Upload Directory</span>
              <span className="font-medium text-white">
                {form.defaultUploadDir || "None set"}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>Write Access</span>
              <span className="font-medium text-white">
                {form.noAuthFsWrite ? "Open" : "Protected"}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>Read Access</span>
              <span className="font-medium text-white">
                {form.noAuthFsRead ? "Open" : "Protected"}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>Safe Mode</span>
              <span className="font-medium text-white">
                {form.safeMode ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span>Auto Update</span>
              <span className="font-medium text-white">
                {form.autoUpdate ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Session Max Age</span>
              <span className="font-medium text-white">
                {form.sessionMaxAge} ms
              </span>
            </div>
          </div>
        </div>
      ),
      validate: () => true,
    },
  ];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  useEffect(() => {
    if (window.location.hostname !== "127.0.0.1") {
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
          api
            .get("/runtime")
            .then((res) => {
              if (!mounted || !res || !res.data) return;
              const data = res.data;
              const keys = Object.keys(form);
              const merged = { ...form };
              for (const k of Object.keys(data)) {
                if (keys.includes(k)) merged[k] = data[k];
              }
              setForm(merged);
              // initialize sessionValue/sessionUnit from sessionMaxAge
              const ms = Number(merged?.sessionMaxAge || 0);
              if (ms > 0) {
                setSessionUnit("hours");
                setSessionValue(ms / 3600000);
              } else {
                setSessionUnit("hours");
                setSessionValue(1);
              }
            })
            .catch(() => {})
            .finally(() => mounted && setLoading(false));
        } else {
          mounted && setLoading(false);
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
    if (step < steps.length - 1) {
      setDirection(1);
      setStep((s) => Math.min(s + 1, steps.length - 1));
      return;
    }
    const tst = toast("Setting up", { autoClose: false });
    try {
      await api.post("/init", form);
      toast.success("Initialization successful");
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data || err.message || "Init failed");
    } finally {
      toast.dismiss(tst);
    }
  };

  const prev = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const goNext = () => {
    const current = steps[step];
    if (current && current.validate && !current.validate(form)) {
      toast.error(current.invalidMsg || "Invalid value");
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  if (loading) return null;
  if (!allowed) return null;

  const current = steps[step];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 py-12 text-white selection:bg-white/30">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,transparent_100%)]" />

      <div className="slideUp z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <LazyLoadImage
          effect="opacity"
          placeholder={<PlaceHolder />}
          src="/icon.png"
          height={64}
          alt="SprintET FSdiscover"
          className=" h-20 w-20  rounded-2xl slideUp object-cover"
        />

        <div className="min-h-[250px] mt-14 w-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="mb-4 text-4xl font-light tracking-tight sm:text-5xl">
                {current.title}
              </h2>
              <p className="mb-12 text-lg font-light text-white/50">
                {current.desc}
              </p>

              <div
                className={`mx-auto w-full ${
                  step === 0 || step === steps.length - 1
                    ? "max-w-xl"
                    : "max-w-sm"
                }`}
              >
                {current.render()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-16 flex w-full max-w-xl items-center justify-between px-4">
          {step > 0 ? (
            <button
              type="button"
              className="group flex items-center gap-3 rounded-full p-3 text-sm font-medium tracking-wide text-white/50 transition hover:text-white"
              onClick={prev}
            >
              <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
              Back
            </button>
          ) : (
            <div className="w-24" />
          )}

          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === step ? "w-8 bg-white" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>

          {step < steps.length - 1 ? (
            <button
              type="button"
              className="group flex items-center gap-3 rounded-full p-3 text-sm font-medium tracking-wide text-white transition hover:text-white/80"
              onClick={goNext}
            >
              {step === 0 ? "Get Started" : "Continue"}
              <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <button
              type="button"
              className="group flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-medium tracking-wide text-black transition hover:bg-white/90"
              onClick={handleSubmit}
            >
              Start using FSdiscover
              <FaCheck className="transition-transform group-hover:scale-110" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Init;
