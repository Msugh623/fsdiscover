// const dirname = require("../dirname")
const path = require("path");
const os = require("os");
const { exec } = require("child_process");
// const { createReadStream } = require("fs")
// const { outputfile, tempdir } = require("../variables")
const render = require("./render");
const errorHandlers = require("./errorHandlers");
const { readFileSync, existsSync } = require("fs");
const dirname = require("../dirname");
const archiver = require("archiver");
const { writeFile } = require("fs/promises");
const { UseLogger } = require("./logger");
const { logger } = new UseLogger();

const { homedir, platform } = os;
let config = {
  password: "password",
  verbose: Boolean(),
  forbidden: [],
  visitors: [],
  authorizations: [],
  protectedroutes: [],
  devices: [],
};

class Handlers {
  header = (_, res) => {
    res.send("Heartbeat Live");
  };
  getHost = (_, res) => {
    const hn = os.hostname();
    res.send(hn);
  };
  sendUi = async (_, res) => {
    const boilerplate = await readFileSync(
      path.join(dirname(), "public", "client", "index.html"),
      {
        encoding: "utf-8",
      }
    );
    const psr = boilerplate.replace("$title", os.hostname() + " - Fs Discover");
    res.send(psr);
  };
  getPath = (req, res) => {
    try {
      const pathname = req.url
        .replace("/fs", "")
        .replaceAll("%20", " ")
        .split("/")
        .map((u) => `"${u}"`)
        .join("/");

      this["fs" + platform()](pathname, async (data) => {
        if (data.startsWith("$ERR")) {
          errorHandlers.ENOENT(data, res);
          return;
        }
        const prsData = await render(
          "Sprint FS Explorer - index of: " + pathname,
          data,
          true
        );
        if (typeof prsData == "object") {
          res.json(
            prsData.filter(
              (r) =>
                !config.protectedroutes.some(
                  (v) => r.includes(v) || v.includes(r)
                )
            )
          );
        } else {
          res.send(prsData);
        }
      });
    } catch (error) {
      // console.error(error)
      res.status(500).send(error);
    }
  };
  zipDir = (req, res) => {
    try {
      const pathname = req.url.replace("/zipper", "").replaceAll("%20", " ");
      const zipper = archiver("zip", {
        zlib: { level: 9 },
      });
      zipper.on("error", (err) => {
        console.error(err);
        throw err;
      });
      zipper.pipe(res);
      zipper.directory(path.join(homedir(), pathname), false);
      zipper.finalize();
    } catch (error) {
      // console.error(error)
      res.status(500).send(`ERROR: ${error}`);
    }
  };
  deletePath = (req, res) => {
    try {
      const pathname = req.url.replace("/fs", "");
      this["del" + platform()](pathname, async (data) => {
        if (data.startsWith("$ERR")) {
          errorHandlers.ENOENT(data, res);
          return;
        }
        res.send(data);
      });
    } catch (error) {
      // console.error(error)
      res.status(500).send(error);
    }
  };
  delwin32 = (pathname, useData) => {
    // const outputFilePath = path.join(dirname(), tempdir,  outputfile)
    exec(
      `rem ${path.join(homedir(), pathname.replaceAll("/", "\\"))}`,
      (error, stdout, stderr) => {
        if (error) {
          useData(`$ERR${error}`);
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          useData(`$ERR${error}`);
          console.error(`exec error: ${stderr}`);
          return;
        }
        if (stderr) {
          throw stderr;
        }

        return useData(stdout);
      }
    );
  };
  fswin32 = (pathname, useData) => {
    // const outputFilePath = path.join(dirname(), tempdir,  outputfile)
    exec(
      `dir /B ${path.join(homedir(), pathname.replaceAll("/", "\\"))}`,
      (error, stdout, stderr) => {
        if (error) {
          useData(`$ERR${error}`);
          console.error(`exec error: ${error}`);
          return;
        }
        if (stderr) {
          useData(`$ERR${error}`);
          console.error(`exec error: ${stderr}`);
          return;
        }
        if (stderr) {
          throw stderr;
        }

        return useData(stdout);
      }
    );
  };
  fsdarwin = (pathname, useData) => {
    exec(`ls ${path.join(homedir(), pathname)}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        useData(`$ERR${error}`);
        return;
      }
      if (stderr) {
        useData(`$ERR${error}`);
        console.error(`exec error: ${stderr}`);
        return;
      }

      return useData(stdout);
    });
  };

  deldarwin = (pathname, useData) => {
    exec(`rm ${path.join(homedir(), pathname)} `, (error, _, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        useData(`$ERR${error}`);
        return;
      }
      if (stderr) {
        useData(`$ERR${error}`);
        console.error(`exec error: ${stderr}`);
        return;
      }

      return useData("Deleted " + pathname + "Succesfully");
    });
  };
  dellinux = (pathname, useData) => {
    exec(`rm ${path.join(homedir(), pathname)} `, (error, _, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        useData(`$ERR${error}`);
        return;
      }
      if (stderr) {
        useData(`$ERR${error}`);
        console.error(`exec error: ${stderr}`);
        return;
      }

      return useData("Deleted " + pathname + "Succesfully");
    });
  };
  fslinux = (pathname, useData) => {
    // const outputFilePath = path.join(dirname(), tempdir, 'paths.txt')
    exec(`ls ${path.join(homedir(), pathname)} `, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        useData(`$ERR${error}`);
        return;
      }
      if (stderr) {
        useData(`$ERR${error}`);
        console.error(`exec error: ${stderr}`);
        return;
      }

      return useData(stdout);
    });
  };
}

class Middleware {
  logger = (req, _, next) => {
    const date = new Date();
    req.url !== "/" &&
      logger.log(
        `NetFirewall: ${("" + date).split("(")[0]} ${
          req.method
        }  Request from ${req.socket.remoteAddress} to ${req.url} `
      );
    next();
  };
}

class AuthHandler {
  constructor() {
    if (!existsSync(path.join(dirname(), "auth.config.json"))) {
      this.config = config;
      this.saveConfig();
    }
    const authconfigRaw = readFileSync(
      path.join(dirname(), "auth.config.json"),
      {
        encoding: "utf-8",
      }
    );
    let toJson = {};
    try {
      toJson = JSON.parse(
        authconfigRaw.length > 10 ? authconfigRaw : JSON.stringify(config)
      );
    } catch {
      logger.log(
        `ERROR: failed to load auth config as ${__dirname}/../auth.config.json is curropted, falling back to default config.`
      );
      toJson = config;
    }
    this.config = toJson;
    config = toJson;
    this.hasAuth = Boolean(toJson?.password);
    process.on("SIGINT", async () => {
      logger.log(
        ("" + new Date()).split("(")[0] + " SIGINT received, saving config... "
      );
      await this.saveConfig();
      process.exit();
    });
    process.on("SIGTERM", async () => {
      logger.log(
        ("" + new Date()).split("(")[0] + " SIGTERM received, saving config... "
      );
      await this.saveConfig();
      process.exit();
    });
    process.on("uncaughtException", async (err) => {
      logger.log(
        ("" + new Date()).split("(")[0] + " Uncaught Exception: " + err.message
      );
      await this.saveConfig();
      process.exit(1);
    });
  }

  config = { ...config };

  checkAuth = async (req, res, next) => {
    const { headers, socket } = req;
    const uInfo = {
      agent: headers["user-agent"],
      addr: socket.remoteAddress,
      type: "rest",
      date: `${new Date()}`,
      lastAccess: `${new Date()}`,
    };
    req.user = uInfo;
    const theVisitor = this.config.visitors.find(
      (v) => v.agent == uInfo.agent && v.addr == uInfo.addr
    );
    if (!theVisitor) {
      this.config.visitors.push(uInfo);
      await this.saveConfig();
    } else {
      this.config.visitors = this.config.visitors.map((u) =>
        u.agent == uInfo.agent && u.addr == uInfo.addr && u.type == uInfo.type
          ? { ...u, lastAccess: `${new Date()}` }
          : u
      );
    }
    if (
      this.config.forbidden.find(
        (u) => u.agent == uInfo.agent && u.addr == uInfo.addr
      )
    ) {
      return res
        .status(403)
        .send(
          "<center><h1> EACCES </h1> <hr> \n 403 Forbidden by Admin\n</center>"
        );
    }
    if (this.hasAuth) {
      const token = headers["authorization"];
      const theToken = this.config.authorizations.find((a) => a.token == token);
      req.token = theToken;
      return next();
    }
    req.token = uInfo;
    next();
  };

  checkSocketAuth = async (socket, next) => {
    const headers = socket.handshake.headers;
    const uInfo = {
      agent: headers["user-agent"],
      addr: socket.handshake.address || socket.request.connection.remoteAddress,
      type: "socket",
      date: `${new Date()}`,
      lastAccess: `${new Date()}`,
    };
    const auth = socket.handshake.auth.token;
    logger.lognet(
      "NetFirewall: " +
        ("" + new Date()).split("(")[0] +
        " SOCKET Attempt from " +
        uInfo.addr +
        "",
      uInfo
    );

    // Track visitors
    const theVisitor = this.config.visitors.find(
      (v) => v.agent == uInfo.agent && v.addr == uInfo.addr
    );
    if (!theVisitor) {
      this.config.visitors.push(uInfo);
      await this.saveConfig();
    } else {
      this.config.visitors = this.config.visitors.map((u) =>
        u.agent == uInfo.agent && u.addr == uInfo.addr && u.type == uInfo.type
          ? { ...u, lastAccess: `${new Date()}` }
          : u
      );
    }

    socket.user = uInfo;

    // Check forbidden
    if (
      this.config.forbidden.find(
        (u) => u.agent == uInfo.agent && u.addr == uInfo.addr
      )
    ) {
      logger.lognet(
        "NetFirewall: " +
          ("" + new Date()).split("(")[0] +
          " SOCKET Rejected from " +
          user.addr +
          " with Forbidden_Session",
        user
      );
      return;
    }
    // Auth check
    if (auth) {
      const token = auth;
      const theToken = this.config.authorizations.find((a) => a.token == token);
      socket.token = { ...uInfo, ...theToken };
      return next();
    }
    socket.token = uInfo;
    next();
  };

  enforceSocketAuth = (socket, next) => {
    const headers = socket.handshake.headers;
    const user = socket.token;
    if (!user.token) {
      logger.lognet(
        "AuthHandler: " +
          ("" + new Date()).split("(")[0] +
          " SOCKET Rejected from " +
          user.addr +
          " with Invalid_Socket_Session",
        user
      );
      return socket.emit(
        "error",
        `<center>
          <h1> EACCES </h1> <hr> \n ${true ? "401 Unauthorized" : ""}\n 
          </center>`
      );
    }
    if (!this.tokenIsYoung(user)) {
      logger.lognet(
        "AuthHandler: " +
          ("" + new Date()).split("(")[0] +
          " SOCKET Rejected from " +
          user.addr +
          " with Old_Socket_Session",
        user
      );
      socket.emit("error", "Session Expired");
      return this.ejectCred(user.token);
    }
    if (user.agent !== headers["user-agent"]) {
      logger.lognet(
        "NetFirewall: " +
          ("" + new Date()).split("(")[0] +
          " SOCKET Rejected from " +
          user.addr +
          " with Forbidden_Socket_Session",
        user
      );
      socket.emit("error", "Authorization compromised");
      return this.ejectCred(user.token);
    }
    next();
  };

  checkDirAuth = async (req, res, next) => {
    const { url } = req;
    const pathname = url.replace("/fs", "").replaceAll("%20", " ");
    if (
      this.config.protectedroutes.find((u) => {
        return pathname.includes(u);
      })
    ) {
      logger.lognet(
        "NetFirewall: " +
          ("" + new Date()).split("(")[0] +
          " ACCESS Rejected from " +
          user.addr +
          " with Forbidden_Route_Trespassed",
        user
      );
      return res
        .status(403)
        .send(
          "<center><h1> EACCES </h1> <hr> \n 403 Entity Forbidden by Admin\n</center>"
        );
    }
    next();
  };

  enforceAuth = (req, res, next) => {
    const { headers, token } = req;
    const user = req.user;
    const haslogin = this.config.authorizations.find(
      (a) => a?.addr == user?.addr && a?.agent == user?.agent
    );
    if (!token?.token) {
      logger.lognet(
        "NetFirewall: " +
          ("" + new Date()).split("(")[0] +
          " ACCESS Rejected from " +
          user.addr +
          " with Invalid Authorization",
        user
      );
      return res.status(401).send(`<center>
          <h1> EACCES </h1> <hr> \n ${!haslogin ? "401 Unauthorized" : ""}\n 
          ${
            haslogin
              ? 'Entering fsdiscover from admin page or reloading the admin page is forbidden. Return to the <a href="/">homepage</a> and click the button on the top right corner to enter admin page'
              : ""
          }
          </center>`);
    }
    if (!this.tokenIsYoung(token)) {
      logger.lognet(
        "AuthHandler: " +
          ("" + new Date()).split("(")[0] +
          " ACCESS Rejected from " +
          user.addr +
          " with Old_Session",
        user
      );
      res.status(401).send("Session Expired");
      return this.ejectCred(token.token);
    }
    if (token.agent !== headers["user-agent"]) {
      logger.lognet(
        "NetFirewall: " +
          ("" + new Date()).split("(")[0] +
          " ACCESS Rejected from " +
          user.addr +
          " with Bad_Session",
        user
      );
      res.status(403).send("Authorization compromised");
      return this.ejectCred(token.token);
    }
    next();
  };

  tokenIsYoung = (token) => {
    const date = Date.now();
    return date < (token?.oldAge || 0);
  };

  injectCred = async (data) => {
    this.config.authorizations.push(data);
    this.saveConfig();
  };

  ejectCred = async (token) => {
    const newAuths = this.config.authorizations.filter(
      (a) => a.token !== token
    );
    this.config.authorizations = newAuths;
    this.saveConfig();
  };

  returnProtected = () => {
    return this.config.protectedroutes;
  };

  saveConfig = async () => {
    await writeFile(
      path.join(dirname(), "auth.config.json"),
      JSON.stringify(this.config)
    );
    config = this.config;
  };

  login = async (req, res) => {
    (this.config.verbose || true) &&
      logger.log(
        `AuthHandler: ${("" + new Date()).split("(")[0]} LOGIN Attempt from ${
          req.user.addr
        } with ${req.user.agent.split("Apple")[0]}`
      );
    const { body, headers, socket } = req;
    if (body.password !== this.config.password) {
      (this.config.verbose || true) &&
        logger.lognet(
          `AuthHandler: ${
            ("" + new Date()).split("(")[0]
          } LOGIN Rejected from ${req.user.addr} with invalid credentials`,
          req.user
        );
      return res.status(401).send("Invalid Password");
    }
    const agent = headers["user-agent"];
    const token = crypto.randomUUID();
    const addr = socket.remoteAddress;
    const cred = {
      name: body.email,
      agent,
      token,
      addr,
      oldAge: Date.now() + 1000 * 60 * 60,
    };
    await this.injectCred(cred);
    logger.lognet(
      `AuthHandler: ${("" + new Date()).split("(")[0]} LOGIN Succes from ${
        req.user.addr
      } with ${req.user.agent.split("Apple")[0]}`,
      req.user
    );
    res.status(200).send({ token: cred.token });
  };

  logout = async (req, res) => {
    this.ejectCred(req.token.token);
    res.status(200).send("Logged out");
  };

  getVisitors = (req, res) => {
    res.status(200).json(this.config.visitors);
  };

  getForbidden = (req, res) => {
    res.status(200).json(this.config.forbidden);
  };

  updateForbidden = (req, res) => {
    const { body } = req;
    const newForbidden = body || {};
    if (
      this.config.forbidden.find(
        (f) => f.agent == body.agent && f.addr == body.addr
      )
    ) {
      return res.status(200).json(this.config.forbidden);
    }
    this.config.forbidden = [...this.config.forbidden, newForbidden];
    this.saveConfig();
    res.status(200).json(this.config.forbidden);
  };

  remForbidden = (req, res) => {
    const { body } = req;
    const { agent, addr } = body;
    this.config.forbidden = this.config.forbidden.filter(
      (f) => f.agent !== agent || f.addr !== addr
    );
    this.saveConfig();
    res.status(200).json(this.config.forbidden);
  };

  protectroute = (req, res) => {
    const { body } = req;
    const newForbidden = body.route;
    if (this.config.protectedroutes.find((f) => f == body.route)) {
      return res.status(200).json(this.config.protectedroutes);
    }
    this.config.protectedroutes = [
      ...this.config.protectedroutes,
      newForbidden,
    ];
    this.saveConfig();
    res.status(200).json(this.config.protectedroutes);
  };

  remprotected = (req, res) => {
    const { body } = req;
    this.config.protectedroutes = this.config.protectedroutes.filter(
      (f) => f !== body.route
    );
    this.saveConfig();
    res.status(200).json(this.config.protectedroutes);
  };

  getDevices = (_, res) => {
    res.status(200).json(this.config.devices);
  };

  remDevice = (req, res) => {
    const { body } = req;
    const { clientId, type } = body;
    // logger.log(body)
    this.config.devices = this.config.devices.filter(
      (d) => d.clientId !== clientId && d.type !== type
    );
    this.saveConfig();
    res.status(200).json(this.config.devices);
  };

  getProtectedRoutes = (_, res) => {
    res.status(200).json(this.config.protectedroutes);
  };

  updatePassword = (req, res) => {
    const { body } = req;
    logger.lognet(
      "AuthHandler: " +
        ("" + new Date()).split("(")[0] +
        " PASSWORD Change_Attempt from " +
        user.addr +
        "",
      user
    );
    if (body.oldpassword !== this.config.password) {
      logger.lognet(
        "AuthHandler: " +
          ("" + new Date()).split("(")[0] +
          " ACCESS Rejected from " +
          user.addr +
          " with Invalid_Old_Password",
        user
      );
      return res.status(401).send("Old password is not correct");
    }
    const newPassword = body.newpassword || this.config.password;
    this.config.password = newPassword;
    this.hasAuth = Boolean(newPassword);
    this.saveConfig();
    logger.lognet(
      "AuthHandler: " +
        ("" + new Date()).split("(")[0] +
        " PASSWORD Change_Success from " +
        user.addr +
        "with New_Password " +
        newPassword,
      user
    );
    res.status(200).json({
      password: this.config.password,
      forbidden: this.config.forbidden,
      visitors: this.config.visitors,
    });
  };

  getSafeConfig = (_, res) => {
    res.status(200).json({
      password: this.config.password == config.password ? config.password : "",
      forbidden: this.config.forbidden,
      visitors: this.config.visitors,
      protectedRoutes: this.config.protectedroutes,
      devices: this.config.devices,
    });
  };

  getConfig = () => {
    return this.config;
  };
}

module.exports.handlers = new Handlers();
module.exports.middleware = new Middleware();
module.exports.authHandler = new AuthHandler();
