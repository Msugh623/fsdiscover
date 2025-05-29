// const dirname = require("../dirname")
const path = require('path')
const os = require('os')
const { exec } = require("child_process")
// const { createReadStream } = require("fs")
// const { outputfile, tempdir } = require("../variables")
const render = require("./render")
const errorHandlers = require('./errorHandlers')
const { readFileSync } = require('fs')
const dirname = require('../dirname')
const archiver = require('archiver')
const { writeFile } = require("fs/promises");

const { homedir, platform } = os;

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
          res.json(prsData);
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
      console.log(
        `${("" + date).split("(")[0]} ${req.method}  Request from ${
          req.socket.remoteAddress
        } to ${req.url} `
      );
    next();
  };
}

const config = {
  password: "",
  forbidden: [],
  visitors: [],
  authorizations: [],
};

class AuthHandler {
  constructor() {
    const authconfigRaw = readFileSync(path.join(dirname(), "config.json"), {
      encoding: "utf-8",
    });
    let toJson = JSON.parse(authconfigRaw);
    this.config = authconfigRaw ? toJson : config;
    this.hasAuth = Boolean(toJson?.password);
  }

  config = { ...config };

  checkAuth = async (req, res, next) => {
    const { headers, socket } = req;
    const uInfo = {
      agent: headers["user-agent"],
      addr: socket.remoteAddress,
    };
    const theVisitor = this.config.visitors.find(
      (v) => v.agent == uInfo.agent && v.addr == uInfo.addr
    );
    if (!theVisitor) {
      this.config.visitors.push(uInfo);
      await this.saveConfig();
    }
    if (
      this.config.forbidden.find(
        (u) => u.agent == uInfo.agent && u.addr == uInfo.addr
      )
    ) {
      return res.status(403).send("You have been forbidden by Admin");
    }
    if (this.hasAuth) {
      const token = headers["Authorization"];
      const theToken = this.config.authorizations.find((a) => a.token == token);
      req.token = theToken;
      return next();
    }
    req.token = {};
    next();
  };

  enforceAuth = (req, res, next) => {
    const { headers, token } = req;
    if (!token.token) {
      return res
        .status(401)
        .send("<center><h1> EACCES </h1> <hr> \n 401 Unauthorized\n</center>");
    }
    if (!this.tokenIsYoung(token)) {
      return res.status(401).send("Session Expired");
    }
    if (token.agent !== headers["user-agent"]) {
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
    await writeFile(
      path.join(dirname(), "config.json"),
      JSON.stringify(this.config)
    );
  };

  ejectCred = async (token) => {
    const newAuths = this.config.authorizations.filter(
      (a) => a.token !== token
    );
    this.config.authorizations = newAuths;
    await writeFile(
      path.join(dirname(), "config.json"),
      JSON.stringify(this.config)
    );
  };

  saveConfig = async () => {
    await writeFile(
      path.join(dirname(), "config.json"),
      JSON.stringify(this.config)
    );
  };

  login = async (req, res) => {
    const { body, headers, socket } = req;
    if (body.password !== this.config.password) {
      return res.status(401).send("Invalid Credentials");
    }
    const agent = headers[agent];
    const token = crypto.randomUUID();
    const addr = socket.remoteAddress;
    const cred = {
      name: body.name,
      agent,
      token,
      addr,
      oldAge: Date.now(),
    };
    await this.injectCred(cred);
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
    const newForbidden = body.forbidden || [];
    this.config.forbidden = newForbidden;
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

  updatePassword = (req, res) => {
    const { body } = req;
    const newPassword = body.password || this.config.password;
    this.config.password = newPassword;
    this.hasAuth = Boolean(newPassword);
    this.saveConfig();
    res.status(200).json({
      password: this.config.password,
      forbidden: this.config.forbidden,
      visitors: this.config.visitors,
    });
  };

  getSafeConfig = (req, res) => {
    res.status(200).json({
      password: this.config.password,
      forbidden: this.config.forbidden,
      visitors: this.config.visitors,
    });
  };
}

module.exports = new Handlers();
module.exports.middleware = new Middleware();
module.exports.authHandler = new AuthHandler();