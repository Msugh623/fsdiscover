const express = require('express')
const handlers = require('./handlers')
const router = express.Router({})

router.route('/').get(handlers.sendUi())
router
    .route('/rq/config')
    .get(handlers.authHandler.getSafeConfig)
    .put(handlers.config.updateConfig)

module.exports=router