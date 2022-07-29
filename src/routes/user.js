const express = require("express");
const {
  login,
  register,
  me,
  refreshToken,
  logout,
  getUser,
  getUsers,
} = require("../controllers/user");
const checkAccessToken = require("../middlewares/checkAccessToken");

const router = express.Router();

router.get("/me", checkAccessToken, me);
router.get("/:userId", checkAccessToken, getUser);
router.get("/", checkAccessToken, getUsers);
router.post("/login", login);
router.post("/register", register);
router.post("/refresh-token", refreshToken);
router.post("/logout", checkAccessToken, logout);

module.exports = router;
