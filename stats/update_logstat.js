const { statTypes } = require("../utils/schemas");
const sendStat = require("./send_stat");

sendStat(statTypes.UPDATE).finally(() => process.exit(0));
