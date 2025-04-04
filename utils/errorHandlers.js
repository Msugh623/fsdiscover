module.exports = {
    ENOENT: (error,res) => {
        const err=error.replace('$ERR','').replace('ls','')
        return res.status(404).send('<pre>'+err+'</pre>')
    }
}