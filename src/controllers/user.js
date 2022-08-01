const {
  userLoginSchema,
  userRegisterSchema,
} = require("../validations/schemas");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
} = require("../utils/jwt");

const getUsers = async (req, res) => {
  const users = await User.find({});
  return res.send(users);
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate("posts")
      .populate("followers")
      .populate("following");
    return res.send(user);
  } catch (error) {
    return res.send(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validateUserLoginSchema = await userLoginSchema.validate(
      {
        email,
        password,
      },
      { abortEarly: false },
    );
    if (validateUserLoginSchema) {
      const checkUser = await User.findOne({ email })
        .select("+password")
        .select("+refreshToken");
      if (checkUser) {
        const checkUserPassword = await bcrypt.compare(
          password,
          checkUser.password,
        );

        if (checkUserPassword) {
          const accessToken = createAccessToken(checkUser._id);
          const refreshToken = createRefreshToken(checkUser._id);
          checkUser.refreshToken = refreshToken;
          await checkUser.save();
          return res.send({ accessToken, refreshToken });
        }
        return res.send({ error: "Email or password is wrong" });
      }
      return res.send({ error: "Email or password is wrong" });
    }
    return res.send({ error: "Please enter correct values" });
  } catch (error) {
    return res.send(error);
  }
};

const register = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 12);
    const valideteUserRegisterSchema = await userRegisterSchema.validate(
      req.body,
      { abortEarly: false },
    );
    // password hash
    const newUser = await User.create(valideteUserRegisterSchema);
    return res.send(newUser);
  } catch (error) {
    return res.send(error);
  }
};

const me = async (req, res) => {
  try {
    const { userId } = req.payload;
    const user = await User.findById(userId).populate("posts");
    return res.send(user);
  } catch (error) {
    return res.send(error);
  }
};

const refreshToken = async (req, res) => {
  try {
    if (req.body.refreshToken) {
      const chechRefreshToken = verifyRefreshToken(req.body.refreshToken);
      if (chechRefreshToken) {
        const { userId } = chechRefreshToken;
        const user = await User.findById(userId).select("+refreshToken");
        const newAccessToken = createAccessToken(userId);
        const newRefreshToken = createRefreshToken(userId);
        user.refreshToken = newRefreshToken;
        await user.save();
        return res.send({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      }
      return res.status(403).send({ error: "invalid token" });
    }
    return res.status(401).send({ error: "unauthorized" });
  } catch (error) {
    return res.status(403).send(error);
  }
};

const logout = async (req, res) => {
  try {
    if (req.body.refreshToken) {
      const chechRefreshToken = verifyRefreshToken(req.body.refreshToken);
      if (chechRefreshToken) {
        const { userId } = chechRefreshToken;
        const user = await User.findById(userId).select("+refreshToken");
        user.refreshToken = null;
        await user.save();
        return res.send(true);
      }
      return res.send(false);
    }
    return res.send(false);
  } catch (error) {
    return res.status(403).send(error);
  }
};

const verifyEmail = async (req, res) => {};

const passwordReset = async (req, res) => {};

const updateProfile = async (req, res) => {
  const { userId } = req.payload;

  await User.findByIdAndUpdate(userId, {
    biography: req.body.biography,
  });

  return res.send(true);
};

module.exports = {
  getUsers,
  getUser,
  login,
  register,
  me,
  refreshToken,
  logout,
  verifyEmail,
  passwordReset,
  updateProfile,
};
