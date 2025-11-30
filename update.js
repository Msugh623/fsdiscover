const { default: axios } = require("axios");
const fs = require("fs");
const path = require("path");
const dirname = require("./dirname");
const { UseLogger } = require("./utils/logger");
const unzipper = require("unzipper");
const { UseRuntimeConfig } = require("./utils/useRuntimeConfig");

const { logger } = new UseLogger();

module.exports = async function () {
  const { runtimeConfig } = new UseRuntimeConfig();
  if (!runtimeConfig.config.autoUpdate) {
    return null;
  }
  let remoteVersion = "";
  let currentVersion = "";
  let checkDidFinishCleanly = false;
  let isUpTodate = true;
  try {
    remoteVersion = (
      await axios.get(
        "https://raw.githubusercontent.com/Msugh623/fsdiscover/main/version"
      )
    ).data;
    currentVersion = fs.readFileSync(path.join(dirname(), "version"), {
      encoding: "utf-8",
    });
    isUpTodate = currentVersion >= remoteVersion;
    checkDidFinishCleanly = true;
  } catch (err) {
    err.message = "Updater Failed to update";
    // process.emit("uncaughtException", err);
    logger.log(
      "NetUpdater: Could not connect to github... " + err?.message,
      true
    );
  } finally {
    if (isUpTodate && checkDidFinishCleanly) {
      logger.log(
        `NetUpdater: You are using the latest version of fsdiscover`,
        true
      );
    }
    if (!isUpTodate && checkDidFinishCleanly) {
      logger.log(
        `NetUpdater: Update Available... current version: ${currentVersion}, remoteVersion: ${remoteVersion} FsDiscover will try to update in the background. This will not interrupt or affect your system.`,
        true
      );
      const updateData = (
        await axios.get(
          "https://github.com/msugh623/fsdiscover/archive/refs/heads/main.zip",
          {
            responseType: "arraybuffer",
          }
        )
      ).data;
      fs.writeFileSync(path.join(dirname(), "../", "sysnet.zip"), updateData);
      fs.createReadStream(path.join(dirname(), "../", "sysnet.zip")).pipe(
        unzipper.Extract({
          path: path.join(dirname(), "../", "update"),
        })
      );
      logger.log(
        `NetUpdater: Update Succesfull...  Version ${remoteVersion} Will effect on next fsdiscover session.`,
        true
      );
    }
  }
};
