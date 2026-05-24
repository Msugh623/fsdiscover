const {
  mouse,
  Point,
  Button,
  keyboard,
  Key,
} = require("@nut-tree-fork/nut-js");
const os = require("os");
class Device {
  constructor(handlers, authHandler, type = String(), client, socket) {
    this.handlers = handlers;
    this.authHandler = authHandler;
    this.history = [];
    this.type = type;
    type == "keyboard" && (keyboard.config.autoDelayMs = 40);
    this.clientSocket = client;
    this.platform = os.platform();
    this.accelerator = Number(this.platform == "win32" ? 5 : 0.2);
    this.hasAuth = Boolean(client?.token?.token);
    this.socket = socket;
    this.running = false;
    this.buffer = [];
  }

  parseDevice(clientId, reject = (error = String()) => error) {
    this.clientId = clientId;
    if (
      this.authHandler.getConfig().devices.filter((d) => d.type == this.type)
        .length > 100
    ) {
      this.authHandler.config.devices.length >= 100 &&
        this.authHandler.config.devices.pop();
    }
    if (
      this.authHandler
        .getConfig()
        .devices.some(
          (device) => device.clientId == clientId && device.type == this.type
        )
    ) {
      return reject("Device already exists.");
    }
    this.authHandler.config.devices.length >= 100 &&
      this.authHandler.config.devices.pop();
    this.authHandler.config.devices.push({
      clientId,
      type: this.type,
      name: "Controller",
      buttons: 3,
      scrollWheel: true,
      gestures: [],
      user: this.clientSocket?.user,
      date: `${new Date()}`,
    });
    this.authHandler.saveConfig();
  }

  validateDevice() {
    if (!this.hasAuth) {
      return "UnAuthorized. Login to use Remote Input";
    }
    const clientId = this.clientId;
    const device = this.authHandler
      .getConfig()
      .devices.find(
        (device) => device.clientId == clientId && device.type == this.type
      );
    if (!device) {
      return "Invalid device... Your device does not exist in device index";
    }
  }

  remDevice(reject = (error = String()) => error) {
    const clientId = this.clientId;
    const deviceIndex = this.authHandler
      .getConfig()
      .devices.findIndex(
        (device) => device.clientId == clientId && device.type == this.type
      );
    if (deviceIndex == -1) {
      return reject("Device ejection failed... Device not found.");
    }
    this.authHandler.config.devices ==
      this.authHandler
        .getConfig()
        .devices.filter((d) => d.clientId !== clientId && d.type !== this.type);
    this.authHandler.saveConfig();
    return reject("Device removed successfully.");
  }

  parseHistory = (history) => {
    this.history.push(history);
    this.history.length > 10 && this.history.shift();
  };
}

class Mouse extends Device {
  async mouseEvent(event, reject = (error = String()) => error) {
    const clientId = this.clientId;
    const v = this.validateDevice();
    if (v) {
      return reject(v);
    }
    const device = this.authHandler
      .getConfig()
      .devices.find(
        (device) => device.clientId == clientId && device.type == this.type
      );
    if (!device) {
      return reject(
        "Invalid device... Your device does not exist in device index"
      );
    }
    if (event.click) {
      const h = Boolean(this.clickHold);
      this.clickHold && mouse.releaseButton(Button.LEFT);
      this.clickHold && this.clientSocket.emit("mouseDownHold", false);
      this.clickHold && (this.clickHold = !this.clickHold);
      !h &&
        (await mouse.click(
          event.click == "right" ? Button.RIGHT : Button.LEFT
        ));
    }

    if (event.mouseDownHold && !this.clickHold) {
      this.clickHold = true;
      this.clientSocket.emit("mouseDownHold", true);
      await mouse.pressButton(Button.LEFT);
    }
    this.buffer.push({
      dispX: this.judge(event.dispX),
      dispY: this.judge(event.dispY),
      scrollX: event.scrollX,
      scrollY: event.scrollY,
    });
    this.refresh();
    this.parseHistory(event);
  }
  judge(number) {
    if (number == 0) return number;
    if (number < 0 && number > -1) {
      return -1;
    }
    if (number > 0 && number < 1) {
      return 1;
    }
    return Math.round(number);
  }
  refresh = () => {
    if (this.running) return;
    this.useBuffer();
  };
  useBuffer = async () => {
    if (!this.running) this.running = true;
    while (this.buffer.length) {
      const event = this.buffer.shift();
      const currentPos = await mouse.getPosition();

      await mouse["move"]([
        new Point(currentPos.x + event.dispX, currentPos.y + event.dispY),
      ]);

      if (event.scrollX) {
        (event.scrollX <= -1 || event.scrollX >= 1) &&
          (await mouse.scrollRight(event.scrollX * this.accelerator));
      }
      if (event.scrollY) {
        await mouse.scrollUp(event.scrollY * this.accelerator);
      }
    }
    if (!this.buffer.length) this.running = false;
  };
  cleanUp = () => {
    mouse.releaseButton(Button.LEFT);
    mouse.releaseButton(Button.RIGHT);
    mouse.releaseButton(Button.MIDDLE);
  };

  async middleClick(reject = () => {}) {
    const v = this.validateDevice();
    if (v) {
      return reject(v);
    }
    await mouse.click(Button.MIDDLE);
  }
}

class Keyboard extends Device {
  async keydown(event, reject = (error = String()) => error) {
    const v = this.validateDevice();
    if (v) {
      return reject(v);
    }
    const key = Key[event];
    this.history.push(event);
    await keyboard.pressKey(key || 229);
    this.socket.emit("downkeys", this.history);
  }

  async keyup(event) {
    const key = Key[event];
    this.history = this.history.filter((i) => i !== event);
    // return console.log("keyup", event, key);
    await keyboard.releaseKey(key || 229);
    this.clientSocket.emit("downkeys", this.history);
  }

  async keypress(event, reject = (error = String()) => error) {
    const v = this.validateDevice();
    if (v) {
      return reject(v);
    }
    // return console.log("keypress", key);
    await keyboard.type(event || "");
  }

  async keytype(event, reject = (error = String()) => error) {
    const v = this.validateDevice();
    if (v) {
      return reject(v);
    }
    const key = Key[event];
    // return console.log("keypress", key);
    await keyboard.pressKey(key || 229);
    await keyboard.releaseKey(key || 229);
  }

  cleanUp = () => {
    const keys = this.history.map((k) => Key[k]);
    for (const element of keys) {
      keyboard.releaseKey(element);
    }
  };
}

module.exports.Mouse = Mouse;
module.exports.Keyboard = Keyboard;
