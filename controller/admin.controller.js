const adminModel = require("../model/admin.model");
const jwtMiddleware = require("../middleware/auth");
const { default: mongoose } = require("mongoose");
const userModel = require("../model/user.model");
const storeModel = require("../model/store.model");
const bannedDeviceModel = require("../model/bannedDevice.model");
const rechargeHistoryModel = require("../model/rechargeHistory.model");
const levelMasterModel = require("../model/levelMaster.model");

exports.adminLogin = async (req, res) => {
  let { username, password } = req.body;

  const isUserFound = await adminModel.findOne({ username: username });
  console.log(isUserFound);
  if (!isUserFound) {
    return res.json({
      success: false,
      message: "user not registered please register",
    });
  }

  if (password === isUserFound.password) {
    const token = await jwtMiddleware.generate_token_admin(
      isUserFound._id,
      isUserFound.username
    );

    console.log(token);
    await adminModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(isUserFound._id) },
      {
        $set: { token: token },
      }
    );

    return res.json({
      success: true,
      message: `logged in`,
      data: isUserFound,
    });
  } else {
    return res.json({
      success: false,
      message: `incorrect password`,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  const isUserFound = await userModel.find();
  if (!isUserFound) {
    return res.json({
      success: false,
      message: "user not found",
    });
  } else {
    return res.json({
      success: true,
      message: "user details",
      data: isUserFound,
    });
  }
};

exports.getUser = async (req, res) => {
  let { userId } = req.params;

  if (!userId) {
    return res.json({
      success: false,
      message: "please provide userId",
    });
  }

  const isUserFound = await userModel.findOne({
    _id: mongoose.Types.ObjectId(userId),
  });
  if (!isUserFound) {
    return res.json({
      success: false,
      message: "user not found",
    });
  } else {
    return res.json({
      success: true,
      message: "user details",
      data: isUserFound,
    });
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const update_data = req.body;

  if (!userId) {
    return res.json({
      success: false,
      message: "please provide userId",
    });
  }

  await userModel
    .findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      {
        $set: update_data,
      },
      { returnOriginal: false }
    )
    .then((success) => {
      return res.json({
        success: false,
        message: "user details updated",
        success: success,
      });
    })
    .catch((error) => {
      return res.json({
        success: false,
        message: "something went wrong",
      });
    });
};

exports.addItemStore = async (req, res) => {
  const { price, name, validity, status } = req.body;

  console.log(req.file);
  if (!req.file)
    return res.json({
      status: false,
      message: `please select image`,
    });

  const displayPhoto = req.file.filename;
  console.log(displayPhoto);
  await new storeModel({
    price: price,
    name: name,
    validity: validity,
    storeUrl: displayPhoto,
    status: status,
  })
    .save()
    .then(async (success) => {
      return res.json({
        status: true,
        message: `store added successfully successfully`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.getAllStores = async (req, res) => {
  await storeModel
    .find({})
    .then(async (success) => {
      return res.json({
        status: true,
        message: `All Stores`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.addDeviceIntoBlock = async (req, res) => {
  const { bannedDevice } = req.body;

  await new bannedDeviceModel({
    bannedDevice: bannedDevice,
  })
    .save()
    .then(async (success) => {
      return res.json({
        status: true,
        message: `device added into blocklist`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.recharge = async (req, res) => {
  const { userId, coin } = req.body;

  await userModel
    .findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(userId) },
      {
        $set: { coin: coin },
      },
      { returnOriginal: false }
    )
    .then(async (success) => {
      await new rechargeHistoryModel({
        usrId: userId,
        coinAdded: coin,
      }).save();
      return res.json({
        status: true,
        message: "coin added",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.getRechargeHistory = async (req, res) => {
  await rechargeHistoryModel
    .aggregate([
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "usrId",
          as: "users",
        },
      },
    ])
    .then((success) => {
      return res.json({
        status: true,
        message: "recharge history",
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};



exports.addLevel = async (req, res) => {
  const { price, name, validity, status } = req.body;

  console.log(req.file);
  if (!req.file)
    return res.json({
      status: false,
      message: `please select image`,
    });

  const displayPhoto = req.file.filename;
  console.log(displayPhoto);
  await new storeModel({
    price: price,
    name: name,
    validity: validity,
    storeUrl: displayPhoto,
    status: status,
  })
    .save()
    .then(async (success) => {
      return res.json({
        status: true,
        message: `store added successfully successfully`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};


exports.addLevelMaster = async (req, res) => {
  const { coinRequire } = req.body;

  console.log(req.file);
  if (!req.file)
    return res.json({
      status: false,
      message: `please select image`,
    });

  const displayPhoto = req.file.filename;
  await new levelMasterModel({
    coinRequire: coinRequire,
    levelImgUrl: displayPhoto,
  })
    .save()
    .then(async (success) => {
      return res.json({
        status: true,
        message: `level added successfully`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};

exports.deleteLevelMaster = async (req, res) => {
  const { levelId } = req.body;

 await levelMasterModel.findOneAndDelete({_id:mongoose.Types.ObjectId(levelId)})
    .then(async (success) => {
      return res.json({
        status: true,
        message: `level deleted successfully`,
        data: success,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: `error`,
        error,
      });
    });
};