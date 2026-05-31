const os = require("os");
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
  autoUpdate: Boolean(true),
  sessionMaxAge: Number(60 * 60 * 1000),
  userspace: String(
    userspaces.INDIVIDUAL || userspaces.ORGANIZATION || userspaces.PUBLIC_SPACE,
  ),
  nodeType: String(nodeTypes.CHILD || nodeTypes.parent),
  apps: [
    "https://sprintet.onrender.com/fsdiscover",
    "/fsexplorer",
    "/touchpad",
    "/os",
    "/devices",
  ],
};

module.exports = {
  initData,
  runtimeConfData,
  userspaces,
};
