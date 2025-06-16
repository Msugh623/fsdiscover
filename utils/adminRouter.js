const express = require("express");
const { handlers, authHandler } = require("./handlers");
const adminRouter = express.Router({});

adminRouter.route("/rq/config").get(authHandler.getSafeConfig);

adminRouter.route("/rq/devices/rem")
  .post(authHandler.remDevice)

adminRouter
  .route("/rq/forbidden")
  .get(authHandler.getForbidden)
  .put(authHandler.updateForbidden);

adminRouter.route("/rq/forbidden/pardon").post(authHandler.remForbidden);

adminRouter.route("/rq/change-password").post(authHandler.updatePassword);

adminRouter.route("/rq/logout").post(authHandler.logout);

adminRouter
  .route("/rq/protectedroutes")
  .get(authHandler.getProtectedRoutes)
  .post(authHandler.protectroute)
  .put(authHandler.remprotected);

adminRouter.route("*").get(handlers.sendUi);

module.exports = adminRouter;
