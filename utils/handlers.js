// const dirname = require("../dirname")
const path = require("path");
const os = require("os");
const { exec } = require("child_process");
// const { createReadStream } = require("fs")
// const { outputfile, tempdir } = require("../variables")
const render = require("./render");
const errorHandlers = require("./errorHandlers");
const { readFileSync, existsSync, writeFileSync } = require("fs");
const dirname = require("../dirname");
const archiver = require("archiver");
const { UseLogger } = require("./logger");
const { UseRuntimeConfig } = require("./useRuntimeConfig");
const { logger } = new UseLogger();
const crypto = require("crypto");

const { platform } = os;
function homedir() {
  return runtimeConfig.config.publicDir;
}
let config = {
  password: "password",
  verbose: Boolean(),
  forbidden: [],
  visitors: [],
  authorizations: [],
  protectedroutes: [],
  devices: [],
};
const forbiddenChars = [
  ";",
  ":",
  "}",
  "{",
  ">",
  "<",
  "|",
  "*",
  "$",
  "!",
  "\0",
  "\n",
  "?",
  "\b",
  "\t",
  "\f",
  "\\",
  "&",
  '"',
  "'",
];
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
    const psr = boilerplate.replace(
      "$title",
      os.hostname() + "SprintET FSdiscover"
    );
    res.send(psr);
  };
  getPath = (req, res) => {
    const theToken = useNativeAuthHandler().config.authorizations.find(
      (auth) => auth.token == req?.cookies?.uuid
    );
    if (!runtimeConfig.config.noAuthFsRead && !theToken) {
      req?.cookies?.uuid && res.clearCookie("uuid");
      return res.status(401).send(`<center>
          <h1> EACCES </h1> <hr> \n 401 Unauthorized - You Are not logged in. <br> <br>\n 
          "${os.hostname()}" Requires you log in to access File Explorer. <a href="/login"><button class="btn btn-primary">Login</button></a> to be able to access files'
      </center>`);
    }
    const badChar = req.url
      .split("/")
      .find((char) => forbiddenChars.find((fchar) => char.includes(fchar)));
    if (badChar) {
      return res
        .status(403)
        .send(`Request pathname includes a forbidden character \"${badChar}\"`);
    }
    try {
      const pathname = req.url
        .replace("/fs", "")
        .replaceAll("%20", " ")
        .split("/")
        .filter((u) => Boolean(u))
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
    const token = req?.token;
    if (!token?.token && !runtimeConfig.config.noAuthFsRead) {
      return res.status(401).send(`<center>
          <h1> EACCES </h1> <hr> \n 401 Unauthorized - You Are not logged in. <br> <br>\n 
          "${os.hostname()}" Requires you log in to access File Explorer. <a href="/auth/login"><button class="btn btn-primary">Login</button></a> to be able to access files'
      </center>`);
    }
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
      `rem ${path
        .join(homedir(), pathname.replaceAll("/", "\\"))
        .split("\\")
        .map((p) => `"${p}"`)
        .join("\\")}`,
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
      `dir /O-D /B ${path
        .join(homedir(), pathname.replaceAll("/", "\\"))
        .split("\\")
        .map((p) => (p.includes(" ") && !p.startsWith('"') ? `"${p}"` : p))
        .join("\\")
        .replaceAll('""', "")}`,
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
    exec(
      `ls -t ${path
        .join(homedir(), pathname)
        .split("/")
        .map((p) => (p.includes(" ") && !p.startsWith('"') ? `"${p}"` : p))
        .join("/")
        .replaceAll('""', "")} `,
      (error, stdout, stderr) => {
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
      }
    );
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
    exec(
      `ls -t ${path
        .join(homedir(), pathname)
        .split("/")
        .map((p) => (p.includes(" ") && !p.startsWith('"') ? `"${p}"` : p))
        .join("/")
        .replaceAll('""', "")} `,
      (error, stdout, stderr) => {
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
      }
    );
  };
}

class Middleware {
  logger = (req, _, next) => {
    const date = new Date();
    req.url !== "/" &&
      logger.lognet(
        `NetFirewall: ${("" + date).split("(")[0]} ${
          req.method
        }  Request from ${req.socket.remoteAddress} to ${req.url} `,
        {
          agent: req.headers["user-agent"],
          addr: req.socket.remoteAddress,
          type: "rest",
          date: `${new Date()}`,
          lastAccess: `${new Date()}`,
        }
      );
    next();
  };
}

const { runtimeConfig } = new UseRuntimeConfig();

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
    this.runtimeConfig = runtimeConfig;
    process.stdin.on("data", (buffer) => {
      const data = buffer.toString().trim();
      if (data == "exit" || data == "quit") {
        process.stdin.write("\x1b[2A");
        process.stdin.write("\x1b[2k");
        console.log(
          'Process has been asked to exit from stdin. user input "%s"',
          data
        );
        process.exit(0);
      }
      if (data == "help" || data == "h") {
        console.log(`\nUse: quit or exit to stop fsdiscover\nUse: uninstall to remove fsdiscover\nUse: help to see
          `);
      }
      if (data == "uninstall") {
        console.log(`\nRun fsdiscover /u to uninstall fsdiscover`);
      }
    });
    process.on("SIGINT", async () => {
      logger.log(
        ("\n" + new Date()).split("(")[0] +
          " SIGINT received, Fsdiscover will exit Safely"
      );
      this.saveConfig(() => process.exit(0));
    });
    process.on("SIGTERM", async () => {
      logger.log(
        ("\n" + new Date()).split("(")[0] +
          " SIGTERM received, Fsdiscover will exit Safely"
      );
      this.saveConfig(() => process.exit(0));
    });
    process.on("SIGBREAK", async () => {
      logger.log(
        ("\n" + new Date()).split("(")[0] +
          " SIGTERM received, Fsdiscover will exit Safely"
      );
      this.saveConfig(() => process.exit(0));
    });
    process.on("uncaughtException", (err) => {
      const stackArr = err.stack.split("\n");
      logger.log(
        ("\nRuntimeErrorHandler: " + new Date()).split("(")[0] +
          "\n" +
          stackArr
            .map(
              (s, i) =>
                `${
                  i == 0
                    ? "×─── "
                    : i == stackArr.length - 1
                    ? "╰───>"
                    : "│─── "
                } ${s.replaceAll("   ", " ")}`
            )
            .join("\n") +
          "\n"
      );
      this.saveConfig();
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
      uuid: req?.cookies?.uuid,
    };
    const theVisitor = this.config.visitors.find(
      (v) => v.agent == uInfo.agent && v.addr == uInfo.addr
    );
    if (!theVisitor) {
      this.config.visitors.push(uInfo);
      this.saveConfig();
    } else {
      this.config.visitors = this.config.visitors.map((u) =>
        u.agent == uInfo.agent && u.addr == uInfo.addr && u.type == uInfo.type
          ? { ...u, lastAccess: `${new Date()}` }
          : u
      );
    }
    req.user = this.config.visitors.find(
      (v) =>
        (req?.cookies?.uuid && Boolean(req?.cookies?.uuid == v?.uuid)) ||
        (v.agent == uInfo.agent && v.addr == uInfo.addr)
    );
    if (
      this.config.forbidden.find(
        (v) =>
          (req?.cookies?.uuid && Boolean(req?.cookies?.uuid == v?.uuid)) ||
          (v.agent == uInfo.agent && v.addr == uInfo.addr)
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
    const badChar = req.url
      .split("/")
      .find((char) => forbiddenChars.find((fchar) => char.includes(fchar)));
    if (badChar) {
      return res
        .status(403)
        .send(`Request pathname includes a forbidden character \"${badChar}\"`);
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
      socketid: socket.id,
      uuid: socket.handshake.headers.cookie?.uuid
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
      this.saveConfig();
    } else {
      this.config.visitors = this.config.visitors.map((u) =>
        u.agent == uInfo.agent && u.addr == uInfo.addr && u.type == uInfo.type
          ? { ...u, lastAccess: `${new Date()}`, uuid: socket.id }
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
          " with Forbidden Session",
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
          " with Invalid Authorization - Login with credentials to get valid Authorization",
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
          " with (Old/Expired) Socket Session - Login again to renew Authorization",
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
          " with Forbidden Socket Session - Login with credentials to get valid Authorization",
        user
      );
      socket.emit(
        "error",
        "Authorization compromised: Login again to renew Authorization"
      );
      return this.ejectCred(user.token);
    }
    next();
  };

  checkDirAuth = async (req, res, next) => {
    const { url, headers, socket } = req;
    const user = {
      agent: headers["user-agent"],
      addr: socket.remoteAddress,
      type: "rest",
      date: `${new Date()}`,
      lastAccess: `${new Date()}`,
    };
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
          " with Forbidden Route Trespassed - This route is forbidden by Admin",
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
      res
        .status(401)
        .send("Session Expired - Login again to renew Authorization");
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
      res
        .status(403)
        .send("Authorization compromised: Login again to renew Authorization");
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

  saveConfig = (cb = () => {}) => {
    writeFileSync(
      path.join(dirname(), "auth.config.json"),
      JSON.stringify(this.config)
    );
    config = this.config;
    cb();
  };

  login = async (req, res) => {
    const { runtimeConfig } = new UseRuntimeConfig();
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
      return res
        .status(401)
        .send("Invalid Password: Check your credentials in the config");
    }
    const agent = headers["user-agent"];
    const token = crypto.randomUUID();
    const addr = socket.remoteAddress;
    const cred = {
      name: body.email,
      agent,
      token,
      addr,
      oldAge: Date.now() + Number(runtimeConfig.config.sessionMaxAge),
    };
    await this.injectCred(cred);
    logger.lognet(
      `AuthHandler: ${("" + new Date()).split("(")[0]} LOGIN Succes from ${
        req.user.addr
      } with ${req.user.agent.split("Apple")[0]}`,
      req.user
    );
    res.cookie("uuid", cred.token, {
      httpOnly: true,
      maxAge: Number(runtimeConfig.config.sessionMaxAge),
    });
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
    const { body, user } = req;
    logger.lognet(
      "AuthHandler: " +
        ("" + new Date()).split("(")[0] +
        " PASSWORD Change Attempt from " +
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
          " with Invalid or Old Password",
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
        "with <Check auth.config.json>",
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

function useNativeAuthHandler() {
  return module.exports.authHandler;
}
