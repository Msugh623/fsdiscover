const path = require("path");
const { conf } = require("../runtime.config");
const fs = require("fs");
const dirname = require("../dirname");
const { UseLogger } = require("./logger");
const { logger } = new UseLogger();

class RuntimeConfig {
  constructor() {
    this.config = conf;
    this.strbool = {
      false: false,
      true: true,
    };
    try {
      const persistConf = fs.readFileSync(
        path.join(dirname(), "runtime.config.json"),
        { encoding: "utf-8" }
      );
      const toJson =
        persistConf.length > 10 ? JSON.parse(persistConf) : this.config;
      this.config = { ...conf, ...toJson };
    } catch (err) {
      logger.log(
        "RuntimeConfig: Failed to mount non-existent or curropted runtime.config.json... Cleaning and regenerating"
      );
      this.config = conf;
      this.saveConfig();
    } finally {
      this.config.sessionUID = crypto.randomUUID();
    }
  }

  getSafeRuntimeConfig = (_, res) => {
    res.status(200).json(this.config);
  };
  updateConfig = (req, res) => {
    const user = req.user;
    const newConf = req.body;
    if (newConf.sessionUID !== this.config.sessionUID) {
      logger.lognet(
        "AuthHandler: " +
          ("" + new Date()).split("(")[0] +
          " RUNTIME_CONFIG update rejected from " +
          user.addr +
          " with INVALID SESSION ID",
        user
      );
      return res
        .status(400)
        .send("Config Rejected as it comes from a non existant session");
    }
    try {
      delete newConf.sessionUID;
      const mergeConf = {
        ...this.config,
        ...newConf,
        noAuthFsRead: this.strbool[newConf.noAuthFsRead],
        noAuthFsWrite: this.strbool[newConf.noAuthFsWrite],
      };
      this.config = {
        ...this.config,
        ...mergeConf,
      };
      this.saveConfig();
      res.status(200).json(this.config);
      logger.lognet(
        "AuthHandler: " +
          ("" + new Date()).split("(")[0] +
          " RUNTIME_CONFIG update success from " +
          user.addr,
        user
      );
    } catch (err) {
      res.status(500).send("Failed to update runtime config");
      process.emit("uncaughtException", err);
    }
  };
  saveConfig = () => {
    const toStr = JSON.stringify(this.config);
    fs.writeFileSync(path.join(dirname(), "runtime.config.json"), toStr, {
      encoding: "utf-8",
    });
  };
}

const rtc = new RuntimeConfig();

class UseRuntimeConfig {
  constructor() {
    this.runtimeConfig = rtc;
  }
}

module.exports = {
  UseRuntimeConfig,
};
