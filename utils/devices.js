
class Device {
  constructor(handlers, authHandler) {
    this.handlers = handlers;
    this.authHandler = authHandler;
  }
}


class Mouse extends Device {
  parseDevice(clientId, reject = (error = String()) => error) {
    if (this.authHandler.getConfig().devices.length > 5) {
      return reject(
        "Too many devices, please remove some devices before adding a new one."
      );
    }
    if (
      this.authHandler.getConfig().devices.some(
        (device) => device.clientId === clientId
      )
    ) {
      return reject("Device already exists.");
    }
    this.authHandler.config.devices.push({
      clientId,
      type: "mouse",
      name: "Mouse",
      description: "A mouse device for controlling the cursor.",
      buttons: 3,
      scrollWheel: true,
      gestures: [],
    })
    this.authHandler.saveConfig();
  }

  remDevice(clientId,reject=(error=String())=>error) {
    const deviceIndex = this.authHandler.getConfig().devices.findIndex(
      (device) => device.clientId === clientId
    );
    if (deviceIndex === -1) {
      return reject("Device not found.")
    }
    this.authHandler.config.devices == this.authHandler.getConfig().devices.filter(d => (d.clientId !== clientId))
    this.authHandler.saveConfig();
    return reject("Device removed successfully.")
  }

  mouseEvent(clientId, event, reject = (error = String()) => error) {
    const device = this.authHandler.getConfig().devices.find(
      (device) => device.clientId === clientId
    );
    if (!device) {
      return reject("Device not found.");
    }
    // Handle mouse events here
    console.log(`Mouse event for ${device.name}:`, event);
    return "Mouse event handled successfully.";
  }
}

module.exports =  Mouse;
