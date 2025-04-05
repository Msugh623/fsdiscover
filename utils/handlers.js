// const dirname = require("../dirname")
const path = require('path')
const os = require('os')
const { exec } = require("child_process")
// const { createReadStream } = require("fs")
// const { outputfile, tempdir } = require("../variables")
const render = require("./render")
const errorHandlers = require('./errorHandlers')
const { readFileSync } = require('fs')
const dirname = require('../dirname')

const {homedir,platform}=os

class Handlers {
    header = (_, res) => {
        res.send('Heartbeat Live')
    }
    getHost = (_, res) => {
        const hn = os.hostname()
        res.send(hn)
    }
    sendUi = async (_, res) => {
         const boilerplate = await readFileSync(path.join(dirname(), 'public','client', 'index.html'), {
            encoding: 'utf-8'
         })
        const psr = boilerplate.replace('$title', os.hostname() + " - Fs Discover")
        res.send(psr)
    }
    getPath =  (req, res) => {
        try {
            const pathname = req.url.replace('/fs','')
            this[('fs' + platform())](pathname,async (data) => {
                if (data.startsWith('$ERR')) {
                    errorHandlers.ENOENT(data, res)
                    return
                }
                const prsData = await render('Sprint FS Explorer - index of: ' + pathname, data, true)
                if (typeof prsData == 'object') {
                    res.json(prsData)
                } else {
                    res.send(prsData)
                }
            })
        } catch (error) {
            // console.error(error)
            res.status(500).send(error)
        }
    }
    fswin32 = (pathname,useData) => {
        // const outputFilePath = path.join(dirname(), tempdir,  outputfile)
        exec(`dir /B ${path.join(homedir(), pathname)}`, (error, stdout, stderr) => {
            if (error) {
                useData(`$ERR${error}`)
                console.error(`exec error: ${error}`)
                return
            }
            if (stderr) {
                useData(`$ERR${error}`)
                console.error(`exec error: ${stderr}`)
                return
            }
            if (stderr) {
                throw stderr
            }
            
            return useData(stdout)
        })
    }

    fsdarwin = (pathname, useData) => {
        exec(`ls ${path.join(homedir(), pathname)}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`)
                useData(`$ERR${error}`)
                return
            }
            if (stderr) {
                useData(`$ERR${error}`)
                console.error(`exec error: ${stderr}`)
                return
            }
            
            return useData(stdout)
        })
    }
    
    fslinux = (pathname,useData) => {
        // const outputFilePath = path.join(dirname(), tempdir, 'paths.txt')
        exec(`ls ${path.join(homedir(), pathname)} `, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`)
                useData(`$ERR${error}`)
                return
            }
            if (stderr) {
                useData(`$ERR${error}`)
                console.error(`exec error: ${stderr}`)
                return
            }
            
            return useData(stdout)
        })
    }
}

class Middleware{
    logger = (req, _, next) => {
        const date=new Date()
        req.url!=='/' && console.log(`${(''+date).split('(')[0]} ${req.method}  Request from ${req.socket.remoteAddress} to ${req.url} `)
        next()
    }
}

module.exports = new Handlers()
module.exports.middleware = new Middleware()