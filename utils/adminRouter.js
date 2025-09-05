const express = require("express");
const { handlers, authHandler } = require("./handlers");
const { UseRuntimeConfig } = require("./useRuntimeConfig");
const adminRouter = express.Router({});
const {runtimeConfig}=new UseRuntimeConfig()

adminRouter.route("/rq/config").get(authHandler.getSafeConfig);
adminRouter
  .route("/rq/runtime")
  .get(authHandler.runtimeConfig.getSafeRuntimeConfig)
  .put(authHandler.runtimeConfig.updateConfig);

adminRouter.route("/rq/sessions").get(runtimeConfig.getSessions);

adminRouter.route("/rq/devices/rem").post(authHandler.remDevice);

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
