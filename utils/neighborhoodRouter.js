const express = require("express");
const { UseNeighborhood } = require("./neighborhood");
const { neighborhood } = new UseNeighborhood();
const router = express.Router();
router.use(express.json());

const execute = (action, msg) => async (req, res) => {
  try {
    await action(req.body);
    res.status(201).send(`${msg} ${req.body.hostname || ""}`.trim());
  } catch (err) {
    res.status(500).send(err.message || err);
  }
};

router.post(
  "/pair-request",
  execute(neighborhood.handleParingRequest.bind(neighborhood), "Requested"),
);
router.post(
  "/pair-accepted",
  execute(neighborhood.handlePairAccepted.bind(neighborhood), "Accepted"),
);
router.post(
  "/pair-rejected",
  execute(neighborhood.handlePairRejected.bind(neighborhood), "Rejected"),
);
router.post(
  "/request-pairing",
  execute(neighborhood.requestPairing.bind(neighborhood), "Sent to"),
);
router.post(
  "/accept-pairing",
  execute(neighborhood.acceptPair.bind(neighborhood), "Paired"),
);
router.post(
  "/reject-pairing",
  execute(neighborhood.rejectParing.bind(neighborhood), "Rejected"),
);
router.get("/config", (_, res) =>
  res.status(200).json(neighborhood.getConfig()),
);

module.exports = router;
