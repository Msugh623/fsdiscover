const create = require("create-desktop-shortcuts");
const args = process.argv.slice(2);
const os = require("os");

const icon = args[2];
const outputPath = args[1];
const filePath = args[0];

create({
  windows: {
    filePath,
    outputPath,
    name: "FSDiscover",
    icon,
  },
  verbose: false,
  onlyCurrentOS: true,
});
create({
  windows: {
    filePath,
    outputPath: "/$_ICO_IMPOSSIBLE_TO_FIND_outputPath",
    name: "FSDiscover",
    icon,
  },
  linux: {
    filePath,
    outputPath: outputPath,
    name: "FSDiscover",
    icon,
    terminal: true,
  },
  osx: {
    filePath,
    outputPath: outputPath,
    name: "FSDiscover",
    icon,
    terminal: true,
  },
  onlyCurrentOS: true,
  verbose: false,
});

create({
  windows: {
    filePath,
    outputPath: "/$_ICO_IMPOSSIBLE_TO_FIND_outputPath",
    name: "FSDiscover",
    icon,
  },
  linux: {
    filePath,
    outputPath: os.homedir() + "/Desktop",
    name: "FSDiscover",
    icon,
    terminal: true,
  },
  osx: {
    filePath,
    outputPath: os.homedir() + "/Desktop",
    name: "FSDiscover",
    icon,
    terminal: true,
  },
  onlyCurrentOS: true,
  verbose: false,
});

// ARG_ORDER: target, shortcut, icon
