const os = require("os");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const dirname = require("../dirname");

const statSchema = Object.freeze({
  id: "",
  hostname: "",
  platform: "",
  version: "",
  deviceId: "",
  app: "fsdiscover",
  source: "fsdiscover",
});

const readJson = (filePath, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
};

const readVersion = () => {
  try {
    return fs.readFileSync(path.join(dirname(), "version"), "utf8").trim();
  } catch {
    return readJson(path.join(dirname(), "package.json"), {}).version || "";
  }
};

const createStat = () => {
  const runtime = readJson(path.join(dirname(), "runtime.config.json"), {});

  return {
    ...statSchema,
    id: `fsdiscover-${Date.now()}-${crypto.randomUUID()}`,
    hostname: os.hostname(),
    platform: os.platform(),
    version: readVersion(),
    deviceId: runtime.deviceID || "",
  };
};

const userspaces = Object.freeze({
  INDIVIDUAL: "individual",
  ORGANIZATION: "organization",
  PUBLIC_SPACE: "public_space",
});
const nodeTypes = Object.freeze({
  PARENT: "parent",
  CHILD: "child",
});
const initData = {
  password: String("password"),
  userspace: String(
    userspaces.INDIVIDUAL || userspaces.ORGANIZATION || userspaces.PUBLIC_SPACE,
  ),
  nodeType: String(nodeTypes.CHILD || nodeTypes.parent),
  publicDir: String(os.homedir()),
  defaultUploadDir: String(""),
  safemodeUploadDir: String(
    os.homedir() + `${os.platform == "win32" ? "\\" : "/"}` + "Downloads",
  ),
  noAuthFsRead: Boolean(true),
  noAuthFsWrite: Boolean(true),
  safeMode: Boolean(false),
  autoUpdate: Boolean(true),
  sessionMaxAge: Number(60 * 60 * 1000),
};

const runtimeConfData = {
  publicDir: String(os.homedir()),
  defaultUploadDir: String(""),
  noAuthFsRead: Boolean(true),
  noAuthFsWrite: Boolean(true),
  safemodeUploadDir: String(
    os.homedir() + `${os.platform == "win32" ? "\\" : "/"}` + "Downloads",
  ),
  deviceID: "",
  autoUpdate: Boolean(true),
  sessionMaxAge: Number(60 * 60 * 1000),
  userspace: String(
    userspaces.INDIVIDUAL || userspaces.ORGANIZATION || userspaces.PUBLIC_SPACE,
  ),
  safeMode: Boolean(false),
  nodeType: String(nodeTypes.CHILD || nodeTypes.parent),
  apps: [
    "https://sprintet.onrender.com/fsdiscover",
    "/fsexplorer",
    "/touchpad",
    "/os",
    "/devices",
  ],
};

const neighborhoodData = {
  discovered: [],
  pairing: [],
  pairRequests: [],
  paired: [],
};

module.exports = {
  initData,
  runtimeConfData,
  userspaces,
  neighborhoodData,
  statSchema,
  createStat,
};
