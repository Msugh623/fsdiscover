const express = require('express')
const NetworkProbe = require('./utils/networkProbe')
const handlers = require('./utils/handlers')
const os = require('os')
const path = require('path')
const dirname = require('./dirname')

const app = express()
const port = 3000
const netProb =new NetworkProbe(port,null,true,null)
const netFace = netProb.autoDetect()

app.use(express.static(path.join(dirname(), 'public')))
app.use(express.static(path.join(dirname(), 'public', 'client')))

app.use(express.static(os.homedir(), {
    index: false
}))

app.use('/fs', handlers.getPath)
app.head('*', handlers.header)

app.listen(port,netFace.address, () => {
    console.log(`\nSprint FS Explorer is serving home directory @ http://${netFace.address}:${port}\n`)
})
