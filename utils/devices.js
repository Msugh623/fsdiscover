const { mouse, Point, Button } = require("@nut-tree-fork/nut-js");

class Device {
  constructor(handlers, authHandler) {
    this.handlers = handlers;
    this.authHandler = authHandler;
    this.history = [];
  }
  parseHistory = (history) => {
    this.history.push(history);
    this.history.length > 10 && this.history.pop();
  };
}

class Mouse extends Device {
  parseDevice(clientId, reject = (error = String()) => error) {
    if (
      this.authHandler.getConfig().devices.filter((d) => d.type == "mouse")
        .length > 100
    ) {
      return reject(
        "Too many devices, please remove some devices before adding a new one."
      );
    }
    if (
      this.authHandler
        .getConfig()
        .devices.some((device) => device.clientId === clientId)
    ) {
      return reject("Device already exists.");
    }
    this.authHandler.config.devices.push({
      clientId,
      type: "mouse",
      name: "Controller",
      buttons: 3,
      scrollWheel: true,
      gestures: [],
    });
    this.authHandler.saveConfig();
  }

  remDevice(clientId, reject = (error = String()) => error) {
    const deviceIndex = this.authHandler
      .getConfig()
      .devices.findIndex((device) => device.clientId === clientId);
    if (deviceIndex === -1) {
      return reject("Device not found.");
    }
    this.authHandler.config.devices ==
      this.authHandler
        .getConfig()
        .devices.filter((d) => d.clientId !== clientId);
    this.authHandler.saveConfig();
    return reject("Device removed successfully.");
  }

  async mouseEvent(clientId, event, reject = (error = String()) => error) {
    const device = this.authHandler
      .getConfig()
      .devices.find((device) => device.clientId === clientId);
    if (!device) {
      return reject("Device not found.");
    }
    // const lastEvent = this.history[this.history.length - 1] || {};
    const currentPos = await mouse.getPosition();
    if (event.click) {
      await mouse.click(event.click == "right" ? Button.RIGHT : Button.LEFT);
    }
    await mouse.move([
      new Point(currentPos.x + event.dispX, currentPos.y + event.dispY),
    ]);

    if (event.scrollX) {
      const { scrollX } = event;
      if (scrollX >= 1) {
        mouse.scrollRight(1);
      }
      if (scrollX <= 0) {
        mouse.scrollRight(-1);
      }
    }
    if (event.scrollY) {
      const { scrollY } = event;
      if (scrollY >= 1) {
        mouse.scrollUp(1);
      }
      if (scrollY <= 0) {
        mouse.scrollUp(-1);
      }
    }
    this.parseHistory(event);
    return "Mouse event handled successfully.";
  }
}

module.exports = Mouse;
