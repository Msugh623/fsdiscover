const express = require("express");
const NetworkProbe = require("./utils/networkProbe");
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

config({ path: path.join(dirname(), ".env") });
const app = express();
const server = http.createServer(app);
const socket = new SocketIo.Server(server, { cors: { origin: "*" } });
const ioParser = new LogIoParser();
ioParser.parseIo(socket);
socket.use(authHandler.checkSocketAuth);
socket.use(authHandler.enforceSocketAuth);
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
  const mouse = new Mouse(handlers, authHandler, "mouse", client);
  const keyboard = new Keyboard(handlers, authHandler, "keyboard", client);

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

  client.on("disconnect", () => {
    mouse.remDevice((err) => {
      client.emit("error", err);
    });
    keyboard.remDevice((err) => {
      client.emit("error", err);
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
const netFace = netProb.autoDetect();

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
  authHandler.checkDirAuth,
  express.static(os.homedir(), {
    index: false,
  })
);

app.use(express.json({ limit: "1000000mb" }));
app.use(express.urlencoded({ extended: true, limit: "1000000mb" }));
app.use(express.static(path.join(dirname(), "public")));
app.use(express.static(path.join(dirname(), "public", "client")));

app.post("/fs/upload", upload.array("files", 10), (req, res) => {
  const dir = req.body.dir == "/" ? "/Downloads" : req.body.dir;
  const absoluteDir = os.homedir() + (dir || "/Downloads");
  const placeDir = dir || "/Downloads";
  exec(`mv temp/* ${absoluteDir}`);
  res
    .status(201)
    .send(
      `${
        req.files.length
      } file Uploaded to ${os.hostname()} placed at ${placeDir} succesfully`
    );
});
app.use("/admin", authHandler.enforceAuth, adminRouter);
app.post("/rq/login", authHandler.login);
app.get("/fsexplorer*", handlers.sendUi);
app.get("/hostname", handlers.getHost);
app.get("/zipper*", handlers.zipDir);
app.get("/fs*", authHandler.checkDirAuth, handlers.getPath);
app.delete("/fs*", handlers.deletePath);
app.head("*", handlers.header);
app.get("*", handlers.sendUi);

async function getNewPort(port) {
  const { logger } = new UseLogger();
  const url = "http://" + netFace.address + ":" + port;
  try {
    const _ = await fetch(url, { method: "HEAD" });
    logger.log(
      `EADDRINUSE: failed to use port ${port} as address is already in use... attempting change port`
    );
    return getNewPort(chport(port));
  } catch (err) {
    netProb.port = port;
    server.listen(port, netFace.address, () => {
      logger.log(
        `\nSprint FS Explorer is serving ${os.hostname()} home directory @ http://${
          netFace.address
        }:${port}\n`
      );
      netProb.initLiveCheck();
    });
  }
}

getNewPort(port);
