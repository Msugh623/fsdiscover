const path = require("path");
const { conf } = require("../runtime.config");
const fs = require("fs");
const dirname = require("../dirname");
const { UseLogger } = require("./logger");
const { logger } = new UseLogger();
const crypto = require("crypto");

class RuntimeConfig {
  constructor() {
    this.config = conf;
    this.strbool = {
      false: false,
      true: true,
    };
    this.sessions = [];
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

  // SESSION MANAGEMENT
  connectSession = (user) => {
    const theUser = this.sessions.find(
      (u) =>
        u.addr + u.agent + u?.uuid + u?.socketid ==
        user.addr + u.agent + user?.uuid + user?.socketid
    );
    if (theUser) {
      const keys = Object.keys(user);
      for (const key of keys) {
        theUser[key] = user[key];
      }
    } else {
      this.sessions.unshift(user);
    }
    this.socket.emit("sessionEvent", this.sessions);
    process.refreshCompositor()
  };

  disconnectSession = (user) => {
    this.sessions = this.sessions.filter(
      (u) =>
        u.addr + u.agent + u?.uuid + u?.socketid !==
        user.addr + user.agent + user?.uuid + user?.socketid
    );
    this.socket.emit("sessionEvent", this.sessions);
    process.refreshCompositor();
  };

  updateSession = (user) => {
    const theUser = this.sessions.find(
      (u) =>
        u.addr + u.agent + u?.uuid + u?.socketid ==
        user.addr + u.agent + user?.uuid + user?.socketid
    );
    if (theUser?.addr) {
      const keys = Object.keys(user);
      for (const key of keys) {
        theUser[key] = user[key];
      }
      this.sessions = this.sessions.map((u) =>
        u.addr + u.agent + u?.uuid + u?.socketid ==
        user.addr + user.agent + user?.uuid + user?.socketid
          ? theUser
          : u
      );
    } else {
      this.sessions.unshift(user);
    }
    this.socket.emit("sessionEvent", this.sessions);
    process.refreshCompositor();
  };
  getSessions = (_, res) => {
    res.status(200).json([...this.sessions]);
  };

  // RUNTIME CONFIG MANAGEMENT

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
        autoUpdate: this.strbool[newConf.autoUpdate],
        sessionMaxAge: Number(newConf.sessionMaxAge),
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

  cleanUp = () => {
    this.sessions = [];
    this.saveConfig();
  };
}

const rtc = new RuntimeConfig();

class UseRuntimeConfig {
  constructor() {
    this.runtimeConfig = rtc;
  }

  attatchSocket = (socket) => {
    this.runtimeConfig.socket = socket;
    socket.on("getSessions", (data) => {
      console.log(data);
      this.socket.emit("sessionEvent", this.sessions);
    });
  };
}

module.exports = {
  UseRuntimeConfig,
};
