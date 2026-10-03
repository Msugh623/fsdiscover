const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const appDir = __dirname;
fs.mkdirSync(path.join(appDir, "logs"), { recursive: true });
fs.mkdirSync(path.join(appDir, "temp"), { recursive: true });

if (process.env.FSDISCOVER_UPDATE !== "1") {
  const child = spawn(
    process.execPath,
    [path.join(appDir, "stats", "install_logstat.js")],
    {
      detached: true,
      stdio: "ignore",
    },
  );
  child.on("error", (error) => {
    console.error(`Unable to start install telemetry: ${error.message}`);
  });
  child.unref();
}
