const express = require("express");
const { UseNeighborhood } = require("./neighborhood");
const {neighborhood} = new UseNeighborhood()

const neighborhoodRouter = express.Router();

// Handlers
neighborhoodRouter.route("/pair-request").post((req, res) => {
  try {
    const beam = req.body;
    neighborhood.handleParingRequest(beam);
    res.status(201).send("Pair request registered");
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
});

neighborhoodRouter.route("/pair-accepted").post(async (req, res) => {
  try {
    const beam = req.body;
    await neighborhood.handlePairAccepted(beam);
    res.status(201).send("Pair request rejected");
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
});

neighborhoodRouter.route("/pair-rejected").post(async (req, res) => {
  try {
    const beam = req.body;
    await neighborhood.handlePairRejected(beam);
    res.status(201).send("Pair request rejected");
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
});

// Requestors
neighborhoodRouter.route("/pair-request_pairing").post(async (req, res) => {
  try {
    const beam = req.body;
    await neighborhood.requestPairing(beam);
    res.status(201).send("Pair request sent to " + beam.hostname);
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
});

neighborhoodRouter.route("/pair-accept_pairing").post(async (req, res) => {
  try {
    const beam = req.body;
    await neighborhood.acceptPair(beam);
    res.status(201).send("Paired with " + beam.hostname + " succesfully");
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
});

neighborhoodRouter.route("/pair-reject_pairing").post(async (req, res) => {
  try {
    const beam = req.body;
    await neighborhood.rejectParing(beam);
    res.status(201).send("Pair request from " + beam.hostname + " rejected");
  } catch (err) {
    res.status(500).send("Error: " + err);
  }
});

neighborhoodRouter.route("/config").get((_, res) => {
  res.status(200).json(neighborhood.getConfig());
});

module.exports = neighborhoodRouter;
