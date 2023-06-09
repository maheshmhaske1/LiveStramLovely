const adminModel = require("../model/admin.model");
const jwtMiddleware = require("../middleware/auth");
const { default: mongoose } = require("mongoose");
const userModel = require("../model/user.model");
const storeModel = require("../model/store.model");
const bannedDeviceModel = require("../model/bannedDevice.model");

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
  const { price, name, validity } = req.body;

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
