const os = require("os");
const conf = {
  publicDir: os.homedir(),
  noAuthFsRead: true,
  noAuthFsWrite: true,
  sessionMaxAge: 60 * 60 * 1000,
  apps: [
    "https://sprintet.onrender.com/fsdiscover",
    "/fsexplorer",
    "/touchpad",
    "/os",
  ],
};

module.exports = { conf };
