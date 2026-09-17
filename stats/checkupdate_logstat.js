const { statTypes } = require("../utils/schemas");
const sendStat = require("./send_stat");

sendStat(statTypes.CHECK_UPDATE).finally(() => process.exit(0));
