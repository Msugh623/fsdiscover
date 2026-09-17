const { default: axios } = require("axios");
const { createStat } = require("../utils/schemas");

const STATS_URL = "https://stats.sprintet.com/api/fsdiscover";

const sendStat = async (statType) => {
  try {
    await axios.post(STATS_URL, createStat(statType), {
      timeout: 5000,
      headers: { "content-type": "application/json" },
    });
  } catch {
    // Telemetry must never affect installation, updates, or startup.
  }
};

module.exports = sendStat;
