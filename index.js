const express = require('express')
const NetworkProbe = require('./utils/networkProbe')
const handlers = require('./utils/handlers')
const os = require('os')
const path = require('path')
const dirname = require('./dirname')

const app = express()
const port = 3000
const netProb =new NetworkProbe()
const netFace = netProb.autoDetect()

app.use(express.static(path.join(dirname(), 'public')))

app.use(express.static(os.homedir(), {
    index: false
}))

app.head('*', handlers.header)
app.get('*', handlers.getPath)

app.listen(port,netFace.address, () => {
    console.log(`\nFS Explorer is live @ http://${netFace.address}:${port}`)
})
