const express = require("express");
// const NetworkProbe = require("./utils/networkProbe");
const NetworkProbe = require("netprobe");
const { handlers, authHandler, middleware } = require("./utils/handlers");
const os = require("os");
const path = require("path");
const dirname = require("./dirname");
const cors = require("cors");
const multer = require("multer");
const { exec } = require("child_process");
const { config } = require("dotenv");
const adminRouter = require("./utils/adminRouter");
const SocketIo = require("socket.io");
const http = require("http");
const { Mouse } = require("./utils/devices");
const { Keyboard } = require("./utils/devices");
const { LogIoParser, UseLogger } = require("./utils/logger");
const update = require("./update");
const { UseRuntimeConfig } = require("./utils/useRuntimeConfig");
const cookieParser = require("cookie-parser");
const socketCookie = require("socket.io-cookie");

config({ path: path.join(dirname(), ".env") });
const app = express();
app.use(cookieParser());
const server = http.createServer(app);
const socket = new SocketIo.Server(server, { cors: { origin: "*" } });
socket.use(socketCookie);
process.socket = socket;
const ioParser = new LogIoParser();
const runtime = new UseRuntimeConfig();
const { runtimeConfig } = runtime;
runtime.attatchSocket(socket);
ioParser.parseIo(socket);
socket.use(authHandler.checkSocketAuth);
// socket.use(authHandler.enforceSocketAuth);
socket.on("connection", (client) => {
  const { logger } = new UseLogger();
  logger.lognet(
    "AuthHandler: " +
      ("" + new Date()).split("(")[0] +
      " SOCKET connected from " +
      client.user.addr +
      " with " +
      client.id,
    client.user
  );
  runtimeConfig.connectSession(client.user);
  const mouse = new Mouse(handlers, authHandler, "mouse", client, socket);
  const keyboard = new Keyboard(
    handlers,
    authHandler,
    "keyboard",
    client,
    socket
  );

  mouse.parseDevice(client.id, () => {
    client.emit(
      "error",
      "Connection Rejected By firewall... Too many devices attatched, Go to admin page to remove other devices"
    );
    setTimeout(() => {
      client.emit(
        "error",
        "Unable to parse device after 2s... Session terminated"
      );
      client.disconnect();
    }, 3000);
  });
  keyboard.parseDevice(client.id, () => {
    client.emit(
      "error",
      "Connection Rejected By firewall... Too many devices attatched, Go to admin page to remove other devices"
    );
    setTimeout(() => {
      client.emit(
        "error",
        "Unable to parse device after 2s... Session terminated"
      );
      client.disconnect();
    }, 3000);
  });
  client.on("reconnect", () => {
    runtimeConfig.connectSession(client.user);
  });
  // client.on("reconnect", () => {
  //   runtimeConfig.connectSession(client.user);
  // });
  client.on("disconnect", () => {
    mouse.remDevice((err) => {
      client.emit("error", err);
    });
    keyboard.remDevice((err) => {
      client.emit("error", err);
    });
    runtimeConfig.disconnectSession(client.user);
  });
  client.on("activities", (data) => {
    runtimeConfig.updateSession({
      ...client.user,
      activities: data,
    });
  });
  client.on("pointerEvent", async (data) => {
    await mouse.mouseEvent(data, (err) => {
      client.emit("error", err);
    });
  });

  client.on("middleclick", async (data) => {
    await mouse.middleClick(data, (err) => {
      client.emit("error", err);
    });
  });

  client.on(
    "keydown",
    async (data) =>
      await keyboard.keydown(data, (err) => {
        client.emit("error", err);
      })
  );
  client.on(
    "keyup",
    async (data) =>
      await keyboard.keyup(data, (err) => {
        client.emit("error", err);
      })
  );
  client.on(
    "keypress",
    async (data) =>
      await keyboard.keypress(data, (err) => {
        client.emit("error", err);
      })
  );

  client.on(
    "keytype",
    async (data) =>
      await keyboard.keytype(data, (err) => {
        client.emit("error", err);
      })
  );
});

const args = process.argv.slice(2, process.argv.length);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "temp/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

function chport(port) {
  return port + 1;
}

const upload = multer({ storage: storage });
let port = process.env.PORT || 3000;
const netProb = new NetworkProbe(port, null, true, null);
if (args.includes("--prefer") || args.includes("-p")) {
  const i =
    args.indexOf("--prefer") > -1
      ? args.indexOf("--prefer")
      : args.indexOf("-p");
  const face = args[i + 1];
  if (!face || face.startsWith("-")) {
    console.error(
      "Bad network interface supplied. %s Use --prefer <face> or -p <face>",
      '"' +
        face +
        '" is not a valid network interface and will be ignored by automatic detection.'
    );
  }
  netProb.prefer(face);
}

const netFace = netProb.autoDetect();
process.netFace = netFace;

app.use(authHandler.checkAuth);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(middleware.logger);
app.use(
  "/fsexplorer",
  (req, res, next) => {
    const cookies = req.cookies;
    const { noAuthFsRead } = runtimeConfig.config;
    const theToken = authHandler.config.authorizations.find(
      (auth) => auth.token == cookies?.uuid
    );
    if (!noAuthFsRead && !theToken) {
      req?.cookies?.uuid && res.clearCookie("uuid");
      return res
        .status(401)
        .send(
          "<h1>SprintET <a href='https://sprintet.onrender.com/fsdiscover'>FSdiscover</a> <hr>You Are not logged in, <a href='/login'>Login</a> to read files</h1>"
        );
    }
    next();
  },
  authHandler.checkDirAuth,
  express.static(path.join(runtimeConfig.config.publicDir), {
    index: false,
  })
);

app.use(express.json({ limit: "1000000mb" }));
app.use(express.urlencoded({ extended: true, limit: "1000000mb" }));
app.use(express.static(path.join(dirname(), "public")));
app.use(express.static(path.join(dirname(), "public", "client")));

app.post(
  "/fs/upload",
  (req, res, next) => {
    const { noAuthFsWrite } = runtimeConfig.config;
    const token = req?.token;
    if (!token?.token && !noAuthFsWrite) {
      return res
        .status(401)
        .send("You Are not logged in, Login to upload files");
    }
    next();
  },
  upload.array("files"),
  (req, res) => {
    const dir = req.body.dir == "/" ? "/" : req.body.dir;
    const absoluteDir =
      runtimeConfig.config.defaultUploadDir ||
      runtimeConfig.config.publicDir + (dir || "/") + "/";
    const placeDir = dir || "/";
    const mv = `mv temp/* ${absoluteDir
      .split("/")
      .map((p) => (p.includes(" ") && !p.startsWith('"') ? `"${p}"` : p))
      .join("/")} || move temp\\* ${absoluteDir
      .replaceAll("/", "\\")
      .split("\\")
      .map((p) => (p.includes(" ") && !p.startsWith('"') ? `"${p}"` : p))
      .join("\\")}`;
    exec(
      `${mv} || mkdir ${absoluteDir} && ${mv}`
        .replaceAll("//", "/")
        .replaceAll("\\\\", "\\")
    );
    const rConfPathSplit = runtimeConfig.config.defaultUploadDir.split(
      os.platform() == "win32" ? "\\" : "/"
    );
    res
      .status(201)
      .send(
        `${req.files.length} file Uploaded to ${os.hostname()} placed at ${
          runtimeConfig.config.defaultUploadDir
            ? "Default Upload Directory @/" +
              rConfPathSplit[rConfPathSplit.length - 1]
            : "@" + placeDir
        } succesfully`
      );
  }
);
app.use("/admin", authHandler.enforceAuth, adminRouter);
app.get("/profile", authHandler.getProfile);
app.get("/runtime", authHandler.runtimeConfig.getSafeRuntimeConfig);
app.post("/rq/login", authHandler.login);
app.get("/fsexplorer*", handlers.sendUi);
app.get("/hostname", handlers.getHost);
app.get("/zipper*", handlers.zipDir);
app.get("/fs*", authHandler.checkDirAuth, handlers.getPath);
// app.delete("/fs*", handlers.deletePath);
app.head("*", handlers.header);
app.get("*", handlers.sendUi);

async function getNewPort(port) {
  const { logger } = new UseLogger();
  authHandler.netFace = netFace;
  authHandler.port = port;
  const url = "http://" + netFace.address + ":" + port;
  try {
    const _ = await fetch(url, { method: "HEAD" });
    logger.log(
      `EADDRINUSE: failed to use port ${port} as address is already in use... attempting change port`
    );
    return getNewPort(chport(port));
  } catch (err) {
    netProb.port = port;
    process.netPort = port;
    process.netUrl = `http://${netFace.address}:${port}`;
    server.listen(port, netFace.address, () => {
      logger.log(
        `\nSprintET FSdiscover is serving ${os.hostname()} @ \x1b[32mhttp://${
          netFace.address
        }:${port}\n\n\x1b[0mUse: help to see options\nUse: exit or quit to stop fsdiscover`
      );
      const qr = require("qrcode");
      qr.toString(
        url,
        { type: "terminal", margin: 100, small: true },
        (err, code) => {
          if (!err) {
            logger.log(
              "\n\nScan this qrcode on a device connected to the same network to acces fsdiscover\n"
            );
            logger.log(code);
            return;
          }
          console.log("Initiator: Unable to generate qrcode");
        }
      );
      netProb.initLiveCheck();
      update();
    });
  }
}

async function getNewLocalPort(port) {
  const { logger } = new UseLogger();
  authHandler.netFace = netFace;
  const localUrl = "http://127.0.0.1" + ":" + port;
  try {
    const _ = await fetch(localUrl, { method: "HEAD" });
    logger.log(
      `EADDRINUSE: failed to use port ${port} for local addressing as address is already in use... attempting change port`
    );
    return getNewLocalPort(chport(port));
  } catch (err) {
    process.localPort = port;
    process.localUrl = `http://127.0.0.1:${port}`;
    app.listen(port, "127.0.0.1", () => {
      logger.log(
        `Local is running @ \x1b[32mhttp://127.0.0.1:${port}\n\n\x1b[0m`
      );
    });
  }
}
getNewPort(port);
getNewLocalPort(port);
