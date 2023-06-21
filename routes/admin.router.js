const express = require("express");
const router = express.Router();
const { authenticate_admin } = require("../middleware/auth");

const admin = require("../controller/admin.controller");
const { upload_store } = require("../middleware/upload");

router.post("/login", admin.adminLogin);
router.get("/getAllUser", authenticate_admin, admin.getAllUsers);
router.post("/blockUser", authenticate_admin, admin.updateUser);
router.post("/recharge", authenticate_admin, admin.recharge);
router.post(
  "/addDeviceInBlockList",
  authenticate_admin,
  admin.addDeviceIntoBlock
);
router.get("/getRechargeHistory", authenticate_admin, admin.getRechargeHistory);
router.post("/add-store", upload_store, admin.addItemStore);
router.post("/add-levels", upload_store, admin.addLevelMaster);
router.post("/delete-levels", upload_store, admin.deleteLevelMaster);
router.get("/get-all-store", admin.getAllStores);

module.exports = router;
