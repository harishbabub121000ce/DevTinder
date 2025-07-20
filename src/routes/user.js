import { Router } from "express";
import userAuth from "../middleware/auth.js";
import Connection from "../models/connection.js";
import User from "../models/user.js";

const userRouter = Router();

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connections = await Connection.find({
      $or: [{ fromUser: user._id }, { toUser: user._id }],
      status: "accepted",
    })
      .select("toUser fromUser status")
      .populate("toUser", "firstName lastName email photoUrl about skills")
      .populate("fromUser", "firstName lastName email photoUrl about skills");
    return res.status(200).json({
      success: true,
      data: connections,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const requests = await Connection.find({
      toUser: user._id,
      status: "interested",
    })
      .select("fromUser toUser status")
      .populate("fromUser", "firstName lastName email photoUrl about skills")
      .populate("toUser", "firstName lastName email photoUrl about skills");
    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

userRouter.get("/user/sent-requests", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const requests = await Connection.find({
      fromUser: user._id,
      status: "interested",
    })
      .select("fromUser toUser status")
      .populate("fromUser", "firstName lastName email photoUrl about skills")
      .populate("toUser", "firstName lastName email photoUrl about skills");
    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;
    // find all the connections where toUserId or fromUserId is the user._id
    const connections = await Connection.find({
      $or: [{ toUser: user._id }, { fromUser: user._id }],
    });
    // create a set and push all the toUser and fromUser ids in the connections
    const userIdsToExclude = new Set();
    connections.forEach((connection) => {
      userIdsToExclude.add(connection.toUser.toString());
      userIdsToExclude.add(connection.fromUser.toString());
    });
    // pagination support
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    limit = Math.min(limit, 50);
    // find all the users excluding the users in the connections
    const users = await User.find({
      _id: { $nin: Array.from(userIdsToExclude) },
    }).select("firstName lastName email photoUrl about skills").skip(skip).limit(limit);
    return res.status(200).json({
        success: true,
        data: users,
    });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: error.message,
    });
  }
});

export default userRouter;
