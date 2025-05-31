const express = require('express')
const handlers = require('./handlers')
const adminRouter = express.Router({})

adminRouter.route('/rq/config')
    .get(handlers.authHandler.getSafeConfig)
    
adminRouter.route('/rq/forbidden')
    .get(handlers.authHandler.getForbidden)
    .put(handlers.authHandler.updateForbidden)
    
adminRouter.route('/rq/forbidden/pardon')
    .post(handlers.authHandler.remForbidden)
    
adminRouter.route('/rq/change-password')
    .post(handlers.authHandler.updatePassword)
    
adminRouter.route('/rq/logout')
    .post(handlers.authHandler.logout)

adminRouter.route('/rq/protectedroutes')
    .get(handlers.authHandler.getProtectedRoutes)
    .post(handlers.authHandler.protectroute)
    .put(handlers.authHandler.remprotected)
    
adminRouter.route('*')
    .get(handlers.sendUi)

module.exports=adminRouter