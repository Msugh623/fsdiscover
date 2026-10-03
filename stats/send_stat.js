const { default: axios } = require("axios");
const { createStat } = require("../utils/schemas");
const childProcess = require("child_process");
const dirname = require("../dirname");

const STATS_URL = "https://sprintet.com/rq/fsdiscover/stats";

const sendStat = async (statType) => {
  try {
    await axios.post(STATS_URL, createStat(statType), {
      timeout: 5000,
      headers: { "content-type": "application/json" },
    });
    childProcess.exec(
      `echo 'Stat sent successfully. ~<${statType}>~' >> ${dirname()}/stats.log`,
    );
  } catch (e) {
    // Telemetry must never affect installation, updates, or startup.
    childProcess.exec(
      `echo 'Failed to send telemetry data ~<${e.message}>~' >> ${dirname()}/stats.log`,
    );
  }
};

module.exports = sendStat;
