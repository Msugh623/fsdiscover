const childProcess = require("child_process");
class Exec {
  exec(meta) {
    if (meta.socketid == "host") {
      if (meta?.action == "open") {
        const pathname = meta.pathname;
        childProcess.exec(
          `open "${process.localUrl}?a=/fsexplorer&href=${pathname}" || explorer "${process.localUrl}?a=/fsexplorer&href=${pathname}"`,
          (err, out) => {
            if (err) {
              throw err;
            }
            if (out) {
              console.log(out);
            }
          }
        );
      }
      return;
    }
    process.socket.emit("exec-" + meta.socketid, meta);
  }
}

const executor = new Exec();

class UseExec {
  constructor() {
    this.executor = executor;
  }

  parseIO(socket) {
    this.executor.socket = socket;
  }
}

module.exports = { UseExec };
