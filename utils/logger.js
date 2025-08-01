const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

class Logger {
  constructor() {
    try {
      this.logs = fs.readdirSync(path.join(__dirname, "..", "logs"));
    } catch (error) {
      process.emit("uncaughtException", error)
    }
    this.name =
      "fsdiscover-log-" +
      new Date().toString().replaceAll(" ", "_").replaceAll("(", "").replaceAll(")", "").replaceAll(":", "-");
    this.netname = this.name.replace("log", "netlog");
    this.nethistory = [];
    this.allhistory = [];
    this.logPath = path.join(__dirname, "..", "logs", this.name + ".log");
    this.logs = fs.readdirSync(path.join(__dirname, "..", "logs"));
    exec(
      "echo. > " +
        '"' +
        this.logPath +
        '"' +
        " || echo > " +
        '"' +
        this.logPath +
        '"',
      (err) => {
        if (!err) {
          this.useLog = true;
        } else {
          console.log(err);
        }
      }
    );
    if (this.logs.length >= 20) {
      this.allhistory.push(
        "Logger: " +
        new Date().toString() +
        " Log history has recoreded upto 20 logs, old logs will be deleted to make room for new logs as " + __dirname + "/../logs cannot hold more that 20 logs"
      );
      const toRem = this.logs.pop();
      fs.unlinkSync(path.join(__dirname, "..", "logs", toRem));
    }
  }

  lognet(message, user, toConsole = true) {
    toConsole && console.log(message);
    const entry = {
      message: message,
      user: user,
      timestamp: new Date().toISOString(),
    };
    this.nethistory.push(entry);
    this.allhistory.push(message);
    this.saveLog();
    this.io.emit("netlog", entry);
  }

  log(message, toConsole = true) {
    toConsole && console.log(message);
    this.allhistory.push(message);
    this.saveLog();
  }

  saveLog() {
    this.useLog && fs.writeFileSync(this.logPath, this.allhistory.join("\n"), "utf8");
  }
}

const logger = new Logger();

class LogIoParser {
  parseIo(io) {
    logger.io = io;
  }
}

class UseLogger {
  constructor() {
    this.logger = logger;
  }
}

module.exports = {
  LogIoParser,
  UseLogger,
};
