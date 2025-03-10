const express = require('express')
const NetworkProbe = require('./utils/networkProbe')
const handlers = require('./utils/handlers')

const app = express()
const port = 3000
const netProb =new NetworkProbe()
const netFace = netProb.autoDetect()

app.head('*', handlers.header)
app.get('*', handlers.getPath)

app.listen(port,netFace.address, () => {
    console.log(`\nFS Explorer is live @ http://${netFace.address}:${port}`)
})
