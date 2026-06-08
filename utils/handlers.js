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
const crypto = require("node:crypto");
const schemas = require("./schemas");
const { randomSuperhero } = require("superheroes");

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
    res.status(200).send(`sysnet-v${process.currentVersion}`);
  };
  getHost = (_, res) => {
    const hn = os.hostname();
    res.send(hn);
  };
  isfirststart = (_, res) => {
    return res.status(200).json(runtimeConfig.firstlaunch ? 1 : 0);
  };
  isInSafeMode = (_, res) => {
    return res.status(200).json(runtimeConfig.config?.safeMode ? 1 : 0);
  };
  getSafeModeUploadDir = (_, res) => {
    const dir =
      runtimeConfig.config?.safemodeUploadDir ||
      runtimeConfig.config?.defaultUploadDir ||
      runtimeConfig.config?.publicDir ||
      "";
    return res.status(200).json(dir);
  };
  sendUi = async (_, res) => {
    const boilerplate = await readFileSync(
      path.join(dirname(), "public", "client", "index.html"),
      {
        encoding: "utf-8",
      },
    );
    const psr = boilerplate.replace(
      "$title",
      os.hostname() + "SprintET FSdiscover",
    );
    res.send(psr);
  };
  getPath = (req, res) => {
    const theToken = useNativeAuthHandler().config.authorizations.find(
      (auth) => auth.token == req?.cookies?.uuid,
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
          true,
        );
        if (typeof prsData == "object") {
          res.json(
            prsData.filter(
              (r) =>
                !config.protectedroutes.some(
                  (v) => r.includes(v) || v.includes(r),
                ),
            ),
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
  downloadFile = (req, res) => {
    const theToken = useNativeAuthHandler().config.authorizations.find(
      (auth) => auth.token == req?.cookies?.uuid,
    );
    if (!runtimeConfig.config.noAuthFsRead && !theToken) {
      req?.cookies?.uuid && res.clearCookie("uuid");
      return res.status(401).send(`<center>
          <h1> EACCES </h1> <hr> \n 401 Unauthorized - You Are not logged in. <br> <br>\n 
          "${os.hostname()}" Requires you log in to access File Explorer. <a href="/login"><button class="btn btn-primary">Login</button></a> to be able to access files'
      </center>`);
    }
    // Strip query string and work with decoded path
    const rawUrl = (req.url || "").split("?")[0];
    const badChar = rawUrl
      .split("/")
      .find((char) => forbiddenChars.find((fchar) => char.includes(fchar)));
    if (badChar) {
      return res
        .status(403)
        .send(`Request pathname includes a forbidden character \"${badChar}\"`);
    }

    try {
      // Remove the route prefix and leading slashes
      let rel = rawUrl.replace("/fsdownload", "").replace(/^\/+/, "");
      rel = decodeURIComponent(rel || "");

      // Prevent path traversal
      const normalized = path.normalize(rel);
      if (
        normalized.split(path.sep).includes("..") ||
        normalized.startsWith("..")
      ) {
        return res.status(403).send("Forbidden path");
      }

      const fullPath = path.join(runtimeConfig.config.publicDir, normalized);

      if (!existsSync(fullPath)) {
        return res.status(404).send("File not found: " + fullPath);
      }

      const filename = path.basename(fullPath).replace(/\"/g, "");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`,
      );

      // Stream the file from disk
      res.sendFile(fullPath, (err) => {
        if (err) {
          if (!res.headersSent) {
            res.status(500).send("File transfer interrupted");
          }
        }
      });
    } catch (error) {
      res.status(500).send(String(error));
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
      },
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
      },
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
      },
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
      },
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
        },
        !req.url.includes("socket"),
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
      },
    );
    let toJson = {};
    try {
      toJson = JSON.parse(
        authconfigRaw.length > 10 ? authconfigRaw : JSON.stringify(config),
      );
    } catch {
      logger.log(
        `ERROR: failed to load corrupted or non existant auth config from ${__dirname}/../auth.config.json, using default settings`,
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
        logger.log(
          'Process has been asked to exit from stdin. user input "' +
            data +
            '"',
        );
        process.exit(0);
      }
      if (data == "help" || data == "h") {
        logger.log(`\nUse: quit or exit to stop fsdiscover\nUse: uninstall to remove fsdiscover\nUse: fsdiscover --help or fsdiscover \\help for options\nUse: help to see options
          `);
        const url = "http://" + this?.netFace?.address + ":" + this.port;
        logger.log(
          `\nSprintET FSdiscover is serving ${os.hostname()} @ \x1b[32m${url} \n\n\x1b[0mUse: help to see options\nUse: exit or quit to stop fsdiscover`,
        );
        const qr = require("qrcode");
        qr.toString(
          url,
          { type: "terminal", margin: 100, small: true },
          (err, code) => {
            if (!err) {
              logger.log(
                "\n\nScan this qrcode on a device connected to the same network to acces fsdiscover\n",
              );
              logger.log(code);
              return;
            }
            logger.log("Initiator: Unable to generate qrcode");
          },
        );
      }
      if (data == "uninstall") {
        logger.log(
          `\nRun fsdiscover -u  or fsdiscover /u to uninstall fsdiscover`,
        );
      }
    });
    process.on("SIGINT", async () => {
      logger.log(
        ("\n" + new Date()).split("(")[0] +
          " SIGINT received, Fsdiscover will exit Safely\n",
      );
      this.saveConfig(() => process.exit(0));
    });
    process.on("SIGTERM", async () => {
      logger.log(
        ("\n" + new Date()).split("(")[0] +
          " SIGTERM received, Fsdiscover will exit Safely\n",
      );
      this.saveConfig(() => process.exit(0));
    });
    process.on("SIGBREAK", async () => {
      logger.log(
        ("\n" + new Date()).split("(")[0] +
          " SIGTERM received, Fsdiscover will exit Safely\n",
      );
      this.saveConfig(() => process.exit(0));
    });
    process.on("uncaughtException", (err) => {
      logger.log("RuntimeErrorHandler: " + ` ${err.stack}`);
      this.saveConfig();
    });
  }

  config = { ...config };

  init = (req, res) => {
    const { runtimeConfig } = new UseRuntimeConfig();
    if (!`${req?.headers?.host}`.includes("127.0.0.1")) {
      return res.status(401).send("forbidden");
    }
    if (!runtimeConfig.firstlaunch) {
      return res.status(403).send("Initializer forbidden");
    }
    const { body } = req;
    const initData = schemas.initData;
    initData.password = String(body.password);
    initData.userspace = String(body.userspace);
    initData.nodeType = String(body.nodeType);
    initData.autoUpdate = Boolean(body.autoUpdate);
    initData.defaultUploadDir = String(body.defaultUploadDir);
    initData.safemodeUploadDir = String(body.safemodeUploadDir || "");
    initData.noAuthFsRead = Boolean(body.noAuthFsRead);
    initData.noAuthFsWrite = Boolean(body.noAuthFsWrite);
    initData.safeMode = Boolean(body.safeMode);
    initData.publicDir = String(body.publicDir || os.homedir());
    // validate directories supplied
    const dirChecks = [];
    try {
      const pPublic = path.resolve(initData.publicDir || "");
      if (initData.publicDir && !existsSync(pPublic)) {
        dirChecks.push(
          `File manager Directory ${initData.publicDir} directory does not exist on this computer`,
        );
      }
    } catch (e) {
      dirChecks.push(
        `File manager Directory ${initData.publicDir} (invalid path)`,
      );
    }
    try {
      const pDefault = path.resolve(initData.defaultUploadDir || "");
      if (initData.defaultUploadDir && !existsSync(pDefault)) {
        dirChecks.push(
          `Upload Directory: ${initData.defaultUploadDir} directory does not exist on this computer`,
        );
      }
    } catch (e) {
      dirChecks.push(
        `Upload Directory: ${initData.defaultUploadDir} (invalid path)`,
      );
    }
    try {
      const pSafe = path.resolve(initData.safemodeUploadDir || "");
      if (initData.safemodeUploadDir && !existsSync(pSafe)) {
        dirChecks.push(
          `Safemode Upload Directory ${initData.safemodeUploadDir} directory does not exist on this computer`,
        );
      }
    } catch (e) {
      dirChecks.push(
        `Safemode Upload Directory ${initData.safemodeUploadDir} (invalid path)`,
      );
    }
    if (dirChecks.length > 0) {
      return res
        .status(400)
        .send(
          `Initialization failed - directory validation errors:\n${dirChecks.join("\n")}`,
        );
    }
    if (!initData.password || !initData.userspace || !initData.nodeType) {
      return res.status(400).send("incomplete data");
    }
    const newRuntimeConfig = {
      ...schemas.runtimeConfData,
      userspace: initData.userspace,
      nodeType: initData.nodeType,
      autoUpdate: initData.autoUpdate,
      defaultUploadDir: initData.defaultUploadDir,
      noAuthFsRead: initData.noAuthFsRead,
      noAuthFsWrite: initData.noAuthFsWrite,
      safeMode: initData.safeMode,
      safemodeUploadDir: initData.safemodeUploadDir,
      publicDir: initData.publicDir,
      apps: schemas.runtimeConfData.apps,
    };
    this.config.password = initData.password;
    runtimeConfig.config = {
      ...newRuntimeConfig,
    };
    runtimeConfig.firstlaunch = false;
    runtimeConfig.saveConfig();
    this.saveConfig();
    try {
      // create a marker file so the runtime knows initialization completed
      writeFileSync(path.join(dirname(), "__init"), String(Date.now()), {
        encoding: "utf-8",
      });
    } catch (e) {
      logger.log("Init: failed to write __init marker: " + e);
    }
    res.status(200).send("Initialization succesful");
  };
  checkAuth = async (req, res, next) => {
    const { headers, socket } = req;
    const cookieMaxAge =
      Number(runtimeConfig?.config?.sessionMaxAge) > 0
        ? Number(runtimeConfig.config.sessionMaxAge)
        : 3600000;

    // Resolve deviceName: prefer existing cookie, then existing visitor record, then generate once
    const existingVisitor = this.config.visitors.find(
      (v) =>
        v.agent === headers["user-agent"] && v.addr === socket.remoteAddress,
    );

    const deviceName =
      req?.cookies?.device_name ||
      existingVisitor?.deviceName ||
      randomSuperhero().split(" ").join("-").toLocaleLowerCase();

    const uInfo = {
      agent: headers["user-agent"],
      addr: socket.remoteAddress,
      type: "rest",
      date: existingVisitor?.date || `${new Date()}`,
      lastAccess: `${new Date()}`,
      uuid: req?.cookies?.uuid,
      deviceName,
    };

    // Always set the cookie so it persists across requests
    if (!req?.cookies?.device_name) {
      res.cookie("device_name", deviceName, {
        httpOnly: false, // needs to be readable by the browser if your client reads it;
        // keep true if server-only
        maxAge: cookieMaxAge,
        sameSite: "lax",
      });
    }

    if (!existingVisitor) {
      this.config.visitors.push(uInfo);
      this.saveConfig();
    } else {
      // Only update mutable fields, never overwrite deviceName
      this.config.visitors = this.config.visitors.map((v) =>
        v.agent === uInfo.agent && v.addr === uInfo.addr
          ? { ...v, lastAccess: uInfo.lastAccess, uuid: uInfo.uuid }
          : v,
      );
    }

    req.user = this.config.visitors.find(
      (v) => v.agent === uInfo.agent && v.addr === uInfo.addr,
    );

    // Forbidden check
    if (
      this.config.forbidden.find(
        (v) => v.agent === uInfo.agent && v.addr === uInfo.addr,
      )
    ) {
      return res
        .status(403)
        .send(
          "<center><h1> EACCES </h1> <hr> \n 403 Forbidden by Admin\n</center>",
        );
    }

    if (this.hasAuth) {
      const token = headers["authorization"];
      const theToken = this.config.authorizations.find(
        (a) => a.token === token,
      );
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
    const rawAddr =
      socket.handshake.address || socket.request.connection.remoteAddress;

    // Parse the raw cookie string — socket.handshake.headers.cookie is not a parsed object
    const cookies = Object.fromEntries(
      (socket.handshake.headers.cookie || "")
        .split(";")
        .filter(Boolean)
        .map((c) => c.trim().split("=").map(decodeURIComponent)),
    );

    // Resolve existing visitor before building uInfo
    const existingVisitor = this.config.visitors.find(
      (v) => v.agent === headers["user-agent"] && v.addr === rawAddr,
    );

    const deviceName =
      cookies.device_name ||
      existingVisitor?.deviceName ||
      randomSuperhero().split(" ").join("-").toLocaleLowerCase();

    const uInfo = {
      agent: headers["user-agent"],
      addr: rawAddr,
      type: "socket",
      date: existingVisitor?.date || `${new Date()}`,
      lastAccess: `${new Date()}`,
      socketid: socket.id,
      uuid: cookies.uuid,
      deviceName,
    };

    const auth = socket.handshake.auth.token;

    logger.lognet(
      "NetFirewall: " +
        ("" + new Date()).split("(")[0] +
        " SOCKET Attempt from " +
        uInfo.addr,
      uInfo,
    );

    // Forbidden check
    if (
      this.config.forbidden.find(
        (u) =>
          u.deviceName === uInfo.deviceName ||
          (u.agent === uInfo.agent && u.addr === uInfo.addr),
      )
    ) {
      logger.lognet(
        "NetFirewall: " +
          ("" + new Date()).split("(")[0] +
          " SOCKET Rejected from " +
          uInfo.addr +
          " with Forbidden Session",
        uInfo,
      );
      return;
    }

    if (!existingVisitor) {
      this.config.visitors.push(uInfo);
      this.saveConfig();
    } else {
      // Only update mutable fields — never overwrite deviceName
      this.config.visitors = this.config.visitors.map((v) =>
        v.agent === uInfo.agent && v.addr === uInfo.addr
          ? {
              ...v,
              lastAccess: uInfo.lastAccess,
              socketid: socket.id,
              uuid: uInfo.uuid,
            }
          : v,
      );
    }

    socket.user = this.config.visitors.find(
      (v) => v.agent === uInfo.agent && v.addr === uInfo.addr,
    );

    // Auth check
    if (auth) {
      const theToken = this.config.authorizations.find((a) => a.token === auth);
      socket.token = { ...uInfo, ...theToken };
      return next();
    }

    socket.token = uInfo;
    next();
  };

  enforceSocketAuth = (socket, next) => {
    const headers = socket.handshake.headers;
    const user = socket.token; // this line exists, so below references are fine
    if (!user.token) {
      logger.lognet(
        "AuthHandler: " +
          ("" + new Date()).split("(")[0] +
          " SOCKET Rejected from " +
          user.addr +
          " with Invalid Authorization",
        user,
      );
      return socket.emit(
        "error",
        `<center><h1> EACCES </h1> <hr> \n 401 Unauthorized\n</center>`,
      );
    }
    if (!this.tokenIsYoung(user)) {
      logger.lognet(
        "AuthHandler: " +
          ("" + new Date()).split("(")[0] +
          " SOCKET Rejected from " +
          user.addr +
          " with (Old/Expired) Socket Session",
        user,
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
          " with Forbidden Socket Session",
        user, // was referencing undefined 'user' in original
      );
      socket.emit(
        "error",
        "Authorization compromised: Login again to renew Authorization",
      );
      return this.ejectCred(user.token); // same
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
        user,
      );
      return res
        .status(403)
        .send(
          "<center><h1> EACCES </h1> <hr> \n 403 Entity Forbidden by Admin\n</center>",
        );
    }
    next();
  };

  enforceAuth = (req, res, next) => {
    const { headers, token } = req;
    const user = req.user;
    const haslogin = this.config.authorizations.find(
      (a) =>
        a.deviceName == user.deviceName ||
        (a?.addr == user?.addr && a?.agent == user?.agent),
    );
    if (!token?.token) {
      logger.lognet(
        "NetFirewall: " +
          ("" + new Date()).split("(")[0] +
          " ACCESS Rejected from " +
          user.addr +
          " with Invalid Authorization",
        user,
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
        user,
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
        user,
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
      (a) => a.token !== token,
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
      JSON.stringify({ ...this.config, devices: [] }),
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
        } with ${req.user.agent.split("Apple")[0]}`,
      );
    const { body, headers, socket } = req;
    if (body.password !== this.config.password) {
      (this.config.verbose || true) &&
        logger.lognet(
          `AuthHandler: ${
            ("" + new Date()).split("(")[0]
          } LOGIN Rejected from ${req.user.addr} with invalid credentials`,
          req.user,
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
      req.user,
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
        (f) =>
          f.deviceName == body.deviceName ||
          (f.agent == body.agent && f.addr == body.addr),
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
      (f) =>
        f.deviceName !== body?.deviceName ||
        (f.agent !== agent && f.addr !== addr),
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
      (f) => f !== body.route,
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
      (d) => d.clientId !== clientId && d.type !== type,
    );
    this.saveConfig();
    res.status(200).json(this.config.devices);
  };

  remVisitor = (req, res) => {
    const { body } = req;
    const { agent, addr, deviceName, uuid } = body || {};
    // remove visitors that match by deviceName or by agent+addr or by uuid
    this.config.visitors = this.config.visitors.filter((v) => {
      if (deviceName && v.deviceName === deviceName) return false;
      if (uuid && (v.uuid === uuid || v.socketid === uuid)) return false;
      if (agent && addr && v.agent === agent && v.addr === addr) return false;
      return true;
    });
    this.saveConfig();
    res.status(200).json(this.config.visitors);
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
      user,
    );
    if (body.oldpassword !== this.config.password) {
      logger.lognet(
        "AuthHandler: " +
          ("" + new Date()).split("(")[0] +
          " ACCESS Rejected from " +
          user.addr +
          " with Invalid or Old Password",
        user,
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
      user,
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
      devices: [],
    });
  };

  getProfile = (req, res) => {
    res.status(200).json(req.user);
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
