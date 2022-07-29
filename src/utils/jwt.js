const jwt = require("jsonwebtoken");

const createAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15d" });

const verifyAccessToken = (accessToken) =>
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

const createRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

const verifyRefreshToken = (refreshToken) =>
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

module.exports = {
  createAccessToken,
  verifyAccessToken,
  createRefreshToken,
  verifyRefreshToken,
};
