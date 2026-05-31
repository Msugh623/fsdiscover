const path = require("path");
const { conf } = require("../runtime.config");
const fs = require("fs");
const dirname = require("../dirname");
const { UseLogger } = require("./logger");
const { logger } = new UseLogger();
const crypto = require("node:crypto");
const { exec } = require("node:child_process");

// helpers
const parseBool = (v, fallback) => {
  if (v === undefined || v === null) return fallback;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") {
    const s = v.toLowerCase().trim();
    if (s === "true" || s === "1") return true;
    if (s === "false" || s === "0") return false;
  }
  return fallback;
};

const parseNumber = (v, fallback) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const parseArray = (v, fallback) => {
  if (v === undefined || v === null) return fallback;
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try {
      // allow JSON array string or comma separated
      const maybe = JSON.parse(v);
      if (Array.isArray(maybe)) return maybe;
    } catch (e) {}
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return fallback;
};

class RuntimeConfig {
  constructor() {
    this.config = conf;
    this.strbool = {
      false: false,
      true: true,
    };
    this.sessions = [];
    this.firstlaunch = false;
    try {
      const persistConf = fs.readFileSync(
        path.join(dirname(), "runtime.config.json"),
        { encoding: "utf-8" },
      );
      const toJson =
        persistConf.length > 10 ? JSON.parse(persistConf) : this.config;
      this.config = { ...conf, ...toJson };
    } catch (err) {
      logger.log(
        "RuntimeConfig: Failed to mount non-existent or curropted runtime.config.json... Cleaning and regenerating",
      );
      this.config = conf;
      this.saveConfig();
      this.firstlaunch = true;
      setTimeout(() => {
        exec(
          `open "${process.localUrl || "http://127.0.0.1:3000"}/init" || explorer "${process.localUrl || "http://127.0.0.1:3000"}/init"`,
        );
      }, 1200);
    } finally {
      this.config.sessionUID = crypto.randomUUID();
    }
  }

  // SESSION MANAGEMENT
  connectSession = (user) => {
    const theUser = this.sessions.find(
      (u) =>
        u.addr + u.agent + u?.uuid + u?.socketid ==
        user.addr + u.agent + user?.uuid + user?.socketid,
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
    process.refreshCompositor();
  };

  disconnectSession = (user) => {
    this.sessions = this.sessions.filter(
      (u) =>
        u.addr + u.agent + u?.uuid + u?.socketid !==
        user.addr + user.agent + user?.uuid + user?.socketid,
    );
    this.socket.emit("sessionEvent", this.sessions);
    process.refreshCompositor();
  };

  updateSession = (user) => {
    const theUser = this.sessions.find(
      (u) =>
        u.addr + u.agent + u?.uuid + u?.socketid ==
        user.addr + u.agent + user?.uuid + user?.socketid,
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
          : u,
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
        user,
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
        noAuthFsRead: parseBool(newConf.noAuthFsRead, this.config.noAuthFsRead),
        noAuthFsWrite: parseBool(
          newConf.noAuthFsWrite,
          this.config.noAuthFsWrite,
        ),
        autoUpdate: parseBool(newConf.autoUpdate, this.config.autoUpdate),
        sessionMaxAge: parseNumber(
          newConf.sessionMaxAge,
          this.config.sessionMaxAge,
        ),
        publicDir:
          typeof newConf.publicDir === "string"
            ? newConf.publicDir
            : this.config.publicDir,
        defaultUploadDir:
          typeof newConf.defaultUploadDir === "string"
            ? newConf.defaultUploadDir
            : this.config.defaultUploadDir,
        userspace:
          typeof newConf.userspace === "string"
            ? newConf.userspace
            : this.config.userspace,
        nodeType:
          typeof newConf.nodeType === "string"
            ? newConf.nodeType
            : this.config.nodeType,
        apps: parseArray(newConf.apps, this.config.apps),
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
        user,
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
