const express = require("express");
const router = express.Router();
const { authenticate_admin } = require("../middleware/auth");

const admin = require("../controller/admin.controller");
const { upload_store } = require("../middleware/upload");

router.post("/login", admin.adminLogin);
router.get("/getAllUser", authenticate_admin, admin.getAllUsers);
router.post("/blockUser", authenticate_admin, admin.updateUser);
router.post("/recharge", authenticate_admin, admin.updateUser);
router.post("/add-store", upload_store, admin.addItemStore);
router.get("/get-all-store", admin.getAllStores);

module.exports = router;
