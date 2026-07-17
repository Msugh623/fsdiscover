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
    if (type === "keyboard") keyboard.config.autoDelayMs = 40;
    this.clientSocket = client;
    this.platform = os.platform();
    this.accelerator = this.platform === "win32" ? 5 : 0.2;
    this.hasAuth = Boolean(client?.token?.token);
    this.socket = socket;
    this.running = false;
    this.buffer = [];
  }

  parseDevice(clientId, reject = (error) => error) {
    this.clientId = clientId;
    const devices = this.authHandler.getConfig().devices;

    if (devices.some((d) => d.clientId === clientId && d.type === this.type)) {
      return reject("Device already exists.");
    }

    // BUG FIX: original popped twice when type count exceeded 100,
    // and used pop() (removes newest) instead of shift() (removes oldest)
    if (devices.length >= 100) devices.shift();

    devices.push({
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
    if (!this.hasAuth) return "UnAuthorized. Login to use Remote Input";
    const device = this.authHandler
      .getConfig()
      .devices.find(
        (d) => d.clientId === this.clientId && d.type === this.type,
      );
    if (!device)
      return "Invalid device... Your device does not exist in device index";
  }

  remDevice(reject = (error) => error) {
    const devices = this.authHandler.getConfig().devices;
    const idx = devices.findIndex(
      (d) => d.clientId === this.clientId && d.type === this.type,
    );
    if (idx === -1)
      return reject("Device ejection failed... Device not found.");

    // BUG FIX 1: was using == instead of = so the assignment was a no-op — devices never removed
    // BUG FIX 2: predicate was (clientId !== x && type !== y) which is wrong —
    //            that keeps devices where either field matches instead of removing the exact one
    devices.splice(idx, 1);
    this.authHandler.saveConfig();
    return reject("Device removed successfully.");
  }

  parseHistory = (entry) => {
    this.history.push(entry);
    if (this.history.length > 10) this.history.shift();
  };
}

class Mouse extends Device {
  async mouseEvent(event, reject = (err) => err) {
    // BUG FIX: validateDevice already does a .find() internally — the original then did
    // a second .find() on the same array immediately after. Removed the redundant lookup.
    const v = this.validateDevice();
    if (v) return reject(v);

    if (event.click) {
      if (this.clickHold) {
        mouse.releaseButton(Button.LEFT);
        this.clientSocket.emit("mouseDownHold", false);
        this.clickHold = false;
      } else {
        await mouse.click(event.click === "right" ? Button.RIGHT : Button.LEFT);
      }
    }

    if (event.mouseDownHold && !this.clickHold) {
      this.clickHold = true;
      this.clientSocket.emit("mouseDownHold", true);
      await mouse.pressButton(Button.LEFT);
    }

    const mouseData = {
      dispX: this.judge(event.dispX),
      dispY: this.judge(event.dispY),
      scrollX: event.scrollX,
      scrollY: event.scrollY,
    };

    if (!Object.values(mouseData).some(Boolean)) return;

    // BUG FIX: original stored raw event in history but compared against judge()'d values.
    // e.g. lastHistory.dispX = 2.3 (raw float), mouseData.dispX = 2 (rounded) — never equal,
    // so hasChanged was almost always true and the dedup was effectively disabled.
    // Now history stores processed values so the comparison is apples-to-apples.
    const lastHistory = this.history[this.history.length - 1] ?? {};
    const hasChanged = Object.keys(mouseData).some(
      (key) => lastHistory[key] !== mouseData[key],
    );
    if (!hasChanged) return;

    this.buffer.push(mouseData);
    this.refresh();
    this.parseHistory(mouseData);
  }

  judge(number) {
    if (number === 0) return 0;
    if (number > -1 && number < 0) return -1;
    if (number > 0 && number < 1) return 1;
    return Math.round(number);
  }

  refresh = () => {
    if (!this.running) this.useBuffer();
  };

  useBuffer = async () => {
    this.running = true;
    while (this.buffer.length) {
      // LAG FIX: original called mouse.getPosition() + mouse.move() per buffer item.
      // For 10 queued moves that's 20 sequential OS syscalls. Instead, drain the entire
      // buffer now, accumulate total displacement, then ONE getPosition + ONE move.
      // New items added while awaiting are handled in the next outer-loop iteration.
      let totalX = 0,
        totalY = 0,
        scrollX = 0,
        scrollY = 0;

      while (this.buffer.length) {
        const item = this.buffer.shift();
        totalX += item.dispX;
        totalY += item.dispY;
        if (item.scrollX) scrollX += item.scrollX;
        if (item.scrollY) scrollY += item.scrollY;
      }

      if (totalX !== 0 || totalY !== 0) {
        const pos = await mouse.getPosition();
        await mouse.move([new Point(pos.x + totalX, pos.y + totalY)]);
      }

      if (scrollX && (scrollX <= -1 || scrollX >= 1)) {
        await mouse.scrollRight(scrollX * this.accelerator);
      }

      if (scrollY) {
        await mouse.scrollUp(scrollY * this.accelerator);
      }
    }
    this.running = false;
  };

  cleanUp = () => {
    [Button.LEFT, Button.RIGHT, Button.MIDDLE].forEach((btn) =>
      mouse.releaseButton(btn),
    );
  };

  async middleClick(reject = () => {}) {
    const v = this.validateDevice();
    if (v) return reject(v);
    await mouse.click(Button.MIDDLE);
  }
}

class Keyboard extends Device {
  async keydown(event, reject = (error) => error) {
    const v = this.validateDevice();
    if (v) return reject(v);
    const key = Key[event];
    this.history.push(event);
    await keyboard.pressKey(key || 229);
    this.socket.emit("downkeys", this.history);
  }

  async keyup(event) {
    const key = Key[event];
    this.history = this.history.filter((i) => i !== event);
    await keyboard.releaseKey(key || 229);
    this.clientSocket.emit("downkeys", this.history);
  }

  async keypress(event, reject = (error) => error) {
    const v = this.validateDevice();
    if (v) return reject(v);
    await keyboard.type(event || "");
  }

  async keytype(event, reject = (error) => error) {
    const v = this.validateDevice();
    if (v) return reject(v);
    const key = Key[event];
    await keyboard.pressKey(key || 229);
    await keyboard.releaseKey(key || 229);
  }

  cleanUp = () => {
    for (const k of this.history) {
      keyboard.releaseKey(Key[k]);
    }
  };
}

module.exports.Mouse = Mouse;
module.exports.Keyboard = Keyboard;
