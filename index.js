const express = require('express')
const NetworkProbe = require('./utils/networkProbe')
const handlers = require('./utils/handlers')
const os = require('os')
const path = require('path')
const dirname = require('./dirname')
const cors = require('cors')
const multer = require('multer')
const { exec } = require('child_process')

const app = express()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'temp/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname )
    }
})
  
const upload = multer({storage:storage})
const port = 3000
const netProb =new NetworkProbe(port,null,true,null)
const netFace = netProb.autoDetect()
    
app.use(cors({
    origin: '*',
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(handlers.middleware.logger)
app.use('/fsexplorer', express.static(os.homedir(), {
    index: false
}))
app.use(express.json({ limit: '100000mb' }))

app.use(express.urlencoded({ extended: true, limit: '100000mb' }))
app.use(express.static(path.join(dirname(), 'public')))
app.use(express.static(path.join(dirname(), 'public', 'client')))

app.post('/fs/upload', upload.array('files', 10), (req, res) => {
    const dir=req.body.dir
    const absoluteDir = os.homedir() + (dir || '/Downloads')
    exec(`mv temp/* ${absoluteDir}`)
    res.status(201).send('Upload succesful')
})
app.get('/fsexplorer*',handlers.sendUi)
app.get('/hostname', handlers.getHost)
app.get('/fs*', handlers.getPath)
app.head('*', handlers.header)

app.listen(port,netFace.address, () => {
    console.log(`\nSprint FS Explorer is serving home directory @ http://${netFace.address}:${port}\n`)
})
