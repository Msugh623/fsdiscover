const express = require('express')
const NetworkProbe = require('./utils/discoverNetwork')

const app = express()
const port = 3000
const netProb =new NetworkProbe()

app.get('*', (req, res) => {
	console.log('Site Visited @ path:'+req.url)
    res.send('Hello World!')
})

const netFace = netProb.autoDetect()

app.listen(port,netFace.address, () => {
    console.log(`FS Explorer is live @ http://${netFace.address}:${port}`)
})
