const { default: mongoose, trusted } = require("mongoose");
const liveModel = require("../model/Live/Live.model");
const liveJoinedModel = require("../model/Live/liveUsers.model");
const requestedUsersLiveModel = require("../model/Live/requesJoin.model");

exports.goLive = async (req, res) => {
  const { userId, liveUniqueId, channelName } = req.body;

  await new liveModel({
    userId: userId,
    liveUniqueId: liveUniqueId,
    channelName: channelName,
  })
    .save()
    .then((success) => {
      return res.json({
        status: true,
        message: "Live details added",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.getLives = async (req, res) => {
  await liveModel
    .aggregate([
      {
        $match: { isEnded: false },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "user",
        },
      },
    ])
    .then((success) => {
      return res.json({
        status: true,
        message: "Live details",
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

exports.watchLive = async (req, res) => {
  const { userId, liveId } = req.body;

  const liveData = await liveModel.findOne({
    _id: mongoose.Types.ObjectId(liveId),
  });

  let blockedUsers = liveData.blockedUsers;

  const isUserBlocked = await liveModel.findOne({
    userId: { $in: blockedUsers },
  });

  if (isUserBlocked) {
    return res.json({
      status: false,
      message: "you are blocked by host not able to join",
    });
  }

  if (!liveData) {
    return res.json({
      status: false,
      message: "invalid live id",
    });
  }

  const isliveEnded = await liveModel.findOne({
    _id: mongoose.Types.ObjectId(liveId),
    isEnded: true,
  });

  if (isliveEnded) {
    return res.json({
      status: false,
      message: "live was ended",
    });
  }

  new liveJoinedModel({
    userId: userId,
    liveId: liveId,
  })
    .save()
    .then((success) => {
      return res.json({
        status: true,
        message: "you are adding to Live watchList",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.addUserInBlockList = async (req, res) => {
  const { userId, liveId } = req.body;

  await liveModel
    .findOneAndUpdate({ _id: liveId }, { $push: { blockedUsers: userId } })
    .then((success) => {
      return res.json({
        status: true,
        message: "user added into blocklist",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.endLive = async (req, res) => {
  const { liveId } = req.params;

  await liveModel
    .findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(liveId) },
      {
        $set: { isEnded: true },
      }
    )
    .then((success) => {
      return res.json({
        status: true,
        message: "live was ended",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.stopWatchingLive = async (req, res) => {
  const { liveId, userId } = req.body;

  await liveJoinedModel
    .findOneAndDelete({
      $and: [
        { userId: mongoose.Types.ObjectId(userId) },
        { liveId: mongoose.Types.ObjectId(liveId) },
      ],
    })
    .then((success) => {
      return res.json({
        status: true,
        message: "you left from live watching list",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.requestToJoinWithLive = async (req, res) => {
  const { userId, liveId } = req.body;

  const liveData = await liveModel.findOne({
    _id: mongoose.Types.ObjectId(liveId),
  });

  let blockedUsers = liveData.blockedUsers;

  const isUserBlocked = await liveModel.findOne({
    userId: { $in: blockedUsers },
  });

  if (isUserBlocked) {
    return res.json({
      status: false,
      message: "you are blocked by host not able to join",
    });
  }

  if (!liveData) {
    return res.json({
      status: false,
      message: "invalid live id",
    });
  }

  const isAlreadyRequestSend = await requestedUsersLiveModel.findOne({
    userId: mongoose.Types.ObjectId(userId),
    liveId: mongoose.Types.ObjectId(liveId),
  });

  console.log("isAlreadyRequestSend ==>", isAlreadyRequestSend);

  if (isAlreadyRequestSend) {
    return res.json({
      status: false,
      message: "you already requested",
    });
  }

  const isRequestSend = await new requestedUsersLiveModel({
    userId: userId,
    liveId: liveId,
  }).save();
  console.log("isRequestSend ==>", isRequestSend);

  if (isRequestSend) {
    return res.json({
      status: true,
      message: "request send to user",
      data: isRequestSend,
    });
  } else {
    return res.json({
      status: false,
      message: "invalid live id",
    });
  }
};

exports.updateLiveJoinRequest = async (req, res) => {
  const { userId, liveId, status } = req.body;

  const liveData = await liveModel.findOne({
    _id: mongoose.Types.ObjectId(liveId),
  });

  let blockedUsers = liveData.blockedUsers;

  const isUserBlocked = await liveModel.findOne({
    userId: { $in: blockedUsers },
  });

  if (isUserBlocked) {
    return res.json({
      status: false,
      message: "you are blocked by host not able to join",
    });
  }

  if (!liveData) {
    return res.json({
      status: false,
      message: "invalid live id",
    });
  }

  await requestedUsersLiveModel
    .findOneAndUpdate(
      {
        userId: userId,
        liveId: liveId,
      },
      {
        $set: {
          status: status,
        },
      }
    )
    .then((success) => {
      return res.json({
        status: true,
        message: `user status changed to ${status}`,
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "error",
      });
    });
};

exports.getPendingRequests = async (req, res) => {
  const { liveId } = req.params;
  console.log(liveId);

  const aggregateResult = await requestedUsersLiveModel.aggregate([
    {
      $match: { liveId: liveId },
    },
  ]);
  console.log("d==>", aggregateResult);

  await requestedUsersLiveModel
    .aggregate([
      {
        $match: { liveId: liveId, status: 0 },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "user",
        },
      },
    ])
    .then((success) => {
      return res.json({
        status: true,
        message: `pending request are`,
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

exports.getAcceptedRequests = async (req, res) => {
  const { liveId } = req.params;

  await requestedUsersLiveModel
    .aggregate([
      {
        $match: { liveId: liveId, status: 1 },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "userId",
          as: "user",
        },
      },
    ])
    .then((success) => {
      return res.json({
        status: true,
        message: `accepted request are`,
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

exports.getLiveById = async (req, res) => {
  const { liveId } = req.params;

  const liveData = await liveModel.findOne({
    _id: mongoose.Types.ObjectId(liveId),
  });

  if (!liveData) {
    return res.json({
      status: false,
      message: "invalid live id",
    });
  }

  if (liveData.isEnded == true) {
    return res.json({
      status: false,
      message: "live is ended",
    });
  }

  await liveModel
    .aggregate([
      { $match: { _id: mongoose.Types.ObjectId(liveId) } },
      {
        // $lookup: {
        //   from: "live_joineds",
        //   foreignField: "liveId",
        //   localField: "_id",
        //   as: "liveUsers",
        // },
        $lookup: {
          from: "live_joineds",
          let: { liveId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$liveId", "$$liveId"] },
              },
            },
            {
              $lookup: {
                from: "users",
                foreignField: "_id",
                localField: "userId",
                as: "user_data",
              },
            },
            {
              $unwind: "$user_data",
            },
          ],
          as: "LiveUser",
        },
      },
    ])
    .then((success) => {
      return res.json({
        status: true,
        message: `joined users`,
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
