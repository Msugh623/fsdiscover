class Exec {
  exec(meta) {
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
