const { statTypes } = require("../utils/schemas");
const sendStat = require("./send_stat");

sendStat(statTypes.INSTALL).finally(() => process.exit(0));
