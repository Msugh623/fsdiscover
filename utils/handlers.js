// const dirname = require("../dirname")
const path = require('path')
const os = require('os')
const { exec } = require("child_process")
// const { createReadStream } = require("fs")
// const { outputfile, tempdir } = require("../variables")
const render = require("./render")

const {homedir,platform}=os

class Handlers {
    header = (_, res) => {
        res.send('Heartbeat Live')
    }
    getPath =  (req, res) => {
        try {
            const pathname = req.url
            this[('fs' + platform())](pathname,async (data) => {
                // console.log(data.split('\n'))
                res.set('Content-Type', 'text/html')
                const prsData = await render('Sprint FS Explorer - index of: ' + pathname, data)
                res.send(prsData)
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
                useData('')
                console.error(`exec error: ${error}`)
                return
            }
            if (stderr) {
                useData('')
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
                useData('')
                return
            }
            if (stderr) {
                useData('')
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
                useData('')
                return
            }
            if (stderr) {
                useData('')
                console.error(`exec error: ${stderr}`)
                return
            }
            
            return useData(stdout)
        })
    }
}

module.exports=new Handlers()