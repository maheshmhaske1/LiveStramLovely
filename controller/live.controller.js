const { default: mongoose } = require("mongoose");
const liveModel = require("../model/live.model");

exports.goLive = async (req, res) => {
  const { userId, liveCode } = req.body;

  await new liveModel({
    userId: userId,
    liveCode: liveCode,
    isEnded: isEnded,
  })
    .save()
    .then((success) => {
      return res.json({
        status: true,
        message: "live session added",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "something went wrong",
      });
    });
};

exports.requestJoin = async (req, res) => {
  const { liveId, userId } = req.body;

  const isLiveFound = await liveModel.findOne({
    _id: mongoose.Types.ObjectId(liveId),
  });

  if (!isLiveFound) {
    return res.json({
      status: false,
      message: "invalid live id",
    });
  }

  if (isLiveFound.isEnded == true) {
    return res.json({
      status: false,
      message: "live was ended",
    });
  }

  if (isLiveFound.liveCode !== liveCode) {
    return res.json({
      status: false,
      message: "invalid live code",
    });
  }

  liveModel
    .findOneAndUpdate({ _id: liveId }, { $push: { waitingUsers: userId } })
    .then((success) => {
      return res.json({
        status: true,
        message: "you are waiting in live",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "something went wrong",
      });
    });
};

exports.joinLive = async (req, res) => {
  const { liveId, userId, liveCode } = req.body;

  const isLiveFound = await liveModel.findOne({
    _id: mongoose.Types.ObjectId(liveId),
  });

  if (!isLiveFound) {
    return res.json({
      status: false,
      message: "invalid live id",
    });
  }

  if (isLiveFound.isEnded == true) {
    return res.json({
      status: false,
      message: "live was ended",
    });
  }

  if (isLiveFound.liveCode !== liveCode) {
    return res.json({
      status: false,
      message: "invalid live code",
    });
  }

  liveModel
    .findOneAndUpdate({ _id: liveId }, { $push: { joinedUsers: userId } })
    .then((success) => {
      return res.json({
        status: true,
        message: "you are added in live",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "something went wrong",
      });
    });
};

exports.updateLive = async (req, res) => {
  const { liveId } = req.params;
  const updateData = req.body;

  const isLiveFound = await liveModel.findOne({
    _id: mongoose.Types.ObjectId(liveId),
  });

  if (!isLiveFound) {
    return res.json({
      status: false,
      message: "invalid live id",
    });
  }

  await liveModel
    .findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(liveId) },
      {
        $set: updateData,
      }
    )
    .then((success) => {
      return res.json({
        status: true,
        message: "live updated",
      });
    })
    .catch((error) => {
      return res.json({
        status: false,
        message: "something went wrong",
      });
    });
};

exports.getLiveDetails = async(req,res)=>{
    const {liveId} = req.params

    
}