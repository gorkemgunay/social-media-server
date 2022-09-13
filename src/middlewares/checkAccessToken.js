const { verifyAccessToken } = require("../utils/jwt");

const checkAccessToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).send("unauthorized");
    }
    const token = authorization.split(" ")[1];
    const payload = verifyAccessToken(token);
    req.payload = payload;
  } catch (error) {
    return res.status(403).send({ error: error.message });
  }
  return next();
};

module.exports = checkAccessToken;
