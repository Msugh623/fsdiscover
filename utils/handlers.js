class Handlers {
    header = (_, res) => {
        res.send('Heartbeat Live')
    }
    getPath=(req, res) => {
        console.log('Site Visited @ path:'+req.url)
        res.send('Hello World!')
    }
}

module.exports=new Handlers()