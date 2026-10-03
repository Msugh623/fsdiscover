const sendStat = require("./send_stat");

sendStat().finally(() => process.exit(0));
