const create = require('create-desktop-shortcuts');
const args = process.argv.slice(2)

const icon = args[2]
const outputPath = args[1]
const filePath = args[0]

create({
    windows: {
        filePath,
        outputPath,
        name: 'FSDiscover',
        icon,
    }, verbose: false
});
create({
    windows: {
        filePath,
        outputPath:"/$_ICO_IMPOSSIBLE_TO_FIND_outputPath",
        name: 'FSDiscover',
        icon,
    }, verbose: false
});

// ARG_ORDER: target, shortcut, icon