const udp = require("node:dgram");
const { hostname } = require("os");
const fs = require("fs");
const dirname = require("../dirname");
const { conf } = require("../config/neighborhood.config");
const path = require("path");
const { default: axios } = require("axios");
const { UseRuntimeConfig } = require("./useRuntimeConfig");
const { UseLogger } = require("./logger");
const PORT = 19685;
const HOST = "255.255.255.255";

const { runtimeConfig } = new UseRuntimeConfig();
const { logger } = new UseLogger();

class Beacon {
  constructor(
    onChange = (
      beam = {
        deviceID: "_",
        address: "_",
        hostname: "_",
        timestamp: "_",
      },
    ) => {
      beam;
    },
    paired = [],
    pairRequests = [],
    pairing = [],
  ) {
    this.pairRequests = pairRequests;
    this.paired = paired;
    this.pairing = pairing;
    this.saveConfig = () => {};
    this.defaultMessage = "_::_::_::_;";
    this.defaultBeamData = {
      deviceID: "_",
      address: "_",
      hostname: "_",
      timestamp: "_",
    };
    this.beamIndex = {};
    this.onBeamHandled = onChange;
    this.server = udp.createSocket("udp4");
    this.client = udp.createSocket("udp4");

    this.server.bind(PORT, HOST);
    this.client.bind(() => {
      this.client.setBroadcast(true);
    });

    this.server.on("listening", () => {
      logger.log(
        "Neighborhood: Looking for neighboring devices on the network",
      );
    });

    this.server.on("message", (beamMessage) => {
      this.handleBeam(String(beamMessage));
    });
  }
  handleBeam = (beamMessage = this.defaultMessage) => {
    // console.log(beamMessage)
    if (!beamMessage.endsWith(";")) {
      return;
    }
    const beamData = this.beamToObject(beamMessage);

    if (runtimeConfig.config?.deviceID == beamData?.deviceID) {
      return;
    }
    if (
      Object.keys(beamData).some(
        (key) => !beamData[key] || beamData[key] == "_",
      )
    ) {
      return;
    }
    if (this.beamIndex[beamData.deviceID]) {
      if (
        Number(beamData.timestamp) -
          Number(this.beamIndex[beamData.deviceID].timestamp) <
        1000 * 30
      ) {
        return;
      }
    }
    const pairedBeam = this.paired.find(
      (beam) => beam.deviceID == beamData.deviceID,
    );
    const pairRequestsBeam = this.pairRequests.find(
      (beam) => beam.deviceID == beamData.deviceID,
    );
    const pairingBeam = this.pairing.find(
      (beam) => beam.deviceID == beamData.deviceID,
    );
    if (pairedBeam && pairedBeam.address !== beamData.address) {
      pairedBeam.address = beamData.address;
      pairedBeam.timestamp = beamData.timestamp;
      return this.saveConfig();
    }
    if (pairRequestsBeam && pairRequestsBeam.address !== beamData.address) {
      pairRequestsBeam.address = beamData.address;
      pairRequestsBeam.timestamp = beamData.timestamp;
      return this.saveConfig();
    }
    if (pairingBeam && pairingBeam.address !== beamData.address) {
      pairingBeam.address = beamData.address;
      pairingBeam.timestamp = beamData.timestamp;
      return this.saveConfig();
    }
    this.indexBeam(beamData);
    this.onBeamHandled(beamData);
  };

  beamToObject = (beamMessage = "") => {
    const split = (beamMessage || this.defaultMessage).split(";")[0].split("::");
    const beamData = {
      deviceID: split[0] || "_",
      address: split[1] || "_",
      hostname: split[2] || "_",
      timestamp: split[3] || "_",
    };
    return beamData;
  };

  indexBeam = (beamData = this.defaultBeamData) => {
    this.beamIndex[beamData.deviceID];
  };

  createBeam = (deviceID, address) => {
    return `${deviceID}::${address}::${hostname()}::${Date.now()}`;
  };
  getNewBeamData = () => {
    const beam = this.createBeam(
      runtimeConfig.config?.deviceID,
      process.netUrl,
    );
    return this.beamToObject(beam);
  };
  sendBeam = (beam = "") => {
    this.client.send(beam, PORT, HOST, (err) => {
      err && logger.log("Neighborhood: UDP_BROADCAST_FAIL: " + err);
    });
  };
  startBeaming = () => {
    clearInterval(this.beamInterval);
    this.beamInterval = setInterval(() => {
      this.sendBeam(
        this.createBeam(runtimeConfig.config?.deviceID, process.netUrl),
      );
    }, 1000 * 7);
    setTimeout(
      () => {
        clearInterval(this.beamInterval);
        this.beamInterval = setInterval(() => {
          this.sendBeam(
            this.createBeam(runtimeConfig.config?.deviceID, process.netUrl),
          );
        }, 1000 * 30);
      },
      1000 * 60 * 60 * 10,
    );
  };
}

class Neighborhood {
  constructor() {
    this.config = { ...conf };
    this.beacon = new Beacon(this.onBeaconBeam);
    this.beacon.startBeaming();

    try {
      const persistConf = fs.readFileSync(
        path.join(dirname(), "neighborhood.config.json"),
        { encoding: "utf-8" },
      );
      const toJson =
        persistConf.length > 10 ? JSON.parse(persistConf) : this.config;
      this.config = { ...conf, ...toJson };
    } catch (err) {
      logger.log(
        "NeighborhoodConfig: Failed to mount non-existent or curropted neighborhood.config.json... Cleaning and regenerating",
      );
      this.config = { ...conf };
      this.saveConfig();
    }
    this.beacon.pairRequests = this.config.pairRequests;
    this.beacon.paired = this.config.paired;
    this.beacon.pairing = this.config.pairing;
    this.beacon.saveConfig = this.saveConfig;
  }

  requestPairing = async (beamData = this.beacon.defaultBeamData) => {
    const url = beamData.address;
    const newLocalBeam = this.beacon.getNewBeamData();
    try {
      const response = await axios.post(
        url + "/rq/neighborhood/pair-request",
        newLocalBeam,
      );
      const existingBeam = this.config.pairing.find(
        (beam) => beam.deviceID == beamData.deviceID,
      );
      if (existingBeam) {
        existingBeam.url = url;
        this.saveConfig();
        return response.data;
      }
      this.config.pairing.push(beamData);
      this.saveConfig();
      return response.data;
    } catch (err) {
      logger.log(
        "NeighborhoodConfig: neigbor refused to pair with reason " +
          (err?.response?.data || err?.message),
      );
      throw (
        "NeighborhoodConfig: neigbor refused to pair with reason " +
        (err?.response?.data || err?.message)
      );
    }
  };

  handleParingRequest = (beamData = this.beacon.defaultBeamData) => {
    const existingRequest = this.config.pairRequests.find(
      (beam = this.beacon.defaultBeamData) =>
        beam.deviceID == beamData.deviceID,
    );
    if (existingRequest) {
      existingRequest.address = beamData.address;
      return this.saveConfig();
    }
    this.config.pairRequests.push(beamData);
    return this.saveConfig();
  };

  acceptPair = async (beamData = this.beacon.defaultBeamData) => {
    const existingRequest = this.config.pairRequests.find(
      (beam = this.beacon.defaultBeamData) =>
        beam.deviceID == beamData.deviceID,
    );
    if (!existingRequest) {
      throw new ReferenceError("No pair request from this device found");
    }

    const response = await axios.post(
      existingRequest.url + "/rq/neighborhood/pair-accepted",
      this.beacon.getNewBeamData(),
    );
    this.config.paired.push({ ...existingRequest });
    this.config.pairRequests.filter(
      (beam = this.beacon.defaultBeamData) =>
        beam.deviceID !== existingRequest.deviceID,
    );
    this.saveConfig();
    return response.data;
  };

  handlePairAccepted = async (beamData = this.beacon.defaultBeamData) => {
    const existingBeam = this.config.pairing.find(
      (beam = this.beacon.defaultBeamData) =>
        beam.deviceID == beamData.deviceID,
    );
    if (!existingBeam) {
      throw new ReferenceError("No pair request to this device found");
    }
    this.config.paired.push({ ...existingBeam });
    this.config.pairing.filter(
      (beam = this.beacon.defaultBeamData) =>
        beam.deviceID !== existingBeam.deviceID,
    );
    this.saveConfig();
  };

  rejectParing = async (beamData = this.beacon.defaultBeamData) => {
    this.config.pairRequests.filter(
      (beam = this.beacon.defaultBeamData) =>
        beam.deviceID !== beamData.deviceID,
    );
    this.saveConfig();
    const response = await axios.post(
      existingRequest.url + "/rq/neighborhood/pair-rejected",
      this.beacon.getNewBeamData(),
    );
    return response;
  };

  handlePairRejected = async (beamData = this.beacon.defaultBeamData) => {
    this.config.pairing.filter(
      (beam = this.beacon.defaultBeamData) =>
        beam.deviceID !== beamData.deviceID,
    );
    this.saveConfig();
  };

  onBeaconBeam = (beamData) => {
    this.config.discovered = Object.values(this.beacon.beamIndex);
    console.log(beamData);
    process.socket.emit("neighborhood/discovered", this.config.discovered);
  };

  getConfig = () => {
    return { ...this.config };
  };

  saveConfig = () => {
    fs.writeFileSync(
      path.join(dirname(), "neighborhood.config.json"),
      JSON.stringify({ ...this.config }),
      {
        encoding: "utf8",
      },
    );
  };
}
const neighborhood = new Neighborhood();
class UseNeighborhood {
  constructor() {
    this.neighborhood = neighborhood;
  }
}
module.exports = {
  UseNeighborhood,
  Neighborhood,
};
