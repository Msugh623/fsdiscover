const { default: axios } = require("axios");
const { createStat } = require("../utils/schemas");
const fs = require("fs");
const path = require("path");
const dirname = require("../dirname");

const STATS_URL = "https://sprintet.com/rq/fsdiscover/stats";

const logStat = async (message) => {
  try {
    await fs.promises.appendFile(
      path.join(dirname(), "stats.log"),
      `${message}\n`,
    );
  } catch (error) {
    console.error(`Unable to write telemetry log: ${error.message}`);
  }
};

const sendStat = async () => {
  try {
    const response = await axios.post(STATS_URL, createStat(), {
      timeout: 5000,
      headers: { "content-type": "application/json" },
    });
    await logStat(`Stat sent successfully. HTTP ${response.status}`);
  } catch (e) {
    // Telemetry must never affect installation, updates, or startup.
    await logStat(`Failed to send telemetry data: ${e.message}`);
  }
};

module.exports = sendStat;
