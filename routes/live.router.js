var express = require("express");
var router = express.Router();
const live = require("../controller/live.controller");

router.post("/add", live.goLive); //
router.get("/get", live.getLives);
router.post("/block/user", live.addUserInBlockList);
router.get("/end/:liveId", live.endLive);
router.post("/watch", live.watchLive); //
router.delete("/stopWatching", live.stopWatchingLive); //
router.post("/request-join", live.requestToJoinWithLive); //
router.put("/request-update", live.updateLiveJoinRequest); //
router.get("/get-pending-request/:liveId", live.getPendingRequests); //
router.get("/get-accepted-request/:liveId", live.getAcceptedRequests); //

module.exports = router;
