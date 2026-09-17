const os = require("os");
const fs = require("fs");
const path = require("path");
const dirname = require("../dirname");

const statTypes = Object.freeze({
  INSTALL: "install",
  UPDATE: "update",
  CHECK_UPDATE: "checkupdate",
});

const statSchema = Object.freeze({
  version: "",
  osVersion: "",
  platform: "",
  datetime: "",
  stat_type: "",
  region: "",
  arch: "",
  dID: "",
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

const createStat = (stat_type) => {
  const runtime = readJson(path.join(dirname(), "runtime.config.json"), {});
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    ...statSchema,
    version: readVersion(),
    osVersion: os.release(),
    platform: os.platform(),
    datetime: new Date().toISOString(),
    stat_type,
    region: timezone || "unknown",
    arch: os.arch(),
    dID: runtime.deviceID || "",
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
  statTypes,
  statSchema,
  createStat,
};
