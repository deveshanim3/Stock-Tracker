const express = require("express");
const router = express.Router();
const holdingController = require("../controller/holding.controller");
const auth = require("../middleware/auth");

router.get("/hl", auth, holdingController.getHoldings);
router.post("/ha", auth, holdingController.addHolding);
router.delete("/hd/:id", auth, holdingController.deleteHolding);

module.exports = router;
