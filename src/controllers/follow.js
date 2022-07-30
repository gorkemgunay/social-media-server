const User = require("../models/user");

const follow = async (req, res) => {
  const followId = req.params.userId;
  const { userId } = req.payload;

  const checkUser = await User.findOne({
    _id: userId,
    following: followId,
  });

  const checkFollowedUser = await User.findOne({
    _id: followId,
    followers: userId,
  });

  if (!checkUser && !checkFollowedUser) {
    const user = await User.findById(userId);
    const followedUser = await User.findById(followId);

    if (!checkUser && !checkFollowedUser) {
      followedUser.followers.push(user._id);
      user.following.push(followedUser._id);
      await user.save();
      await followedUser.save();

      return res.send(true);
    }
  }

  return res.send(false);
};

const unfollow = async (req, res) => {
  const unfollowId = req.params.userId;
  const { userId } = req.payload;

  const checkUser = await User.findOne({
    _id: userId,
    following: unfollowId,
  });

  const checkUnfollowedUser = await User.findOne({
    _id: unfollowId,
    followers: userId,
  });

  if (checkUser && checkUnfollowedUser) {
    await User.findByIdAndUpdate(userId, {
      $pull: { following: unfollowId },
    });
    await User.findByIdAndUpdate(unfollowId, {
      $pull: { followers: userId },
    });

    return res.send(true);
  }
  return res.send(false);
};

module.exports = { follow, unfollow };
