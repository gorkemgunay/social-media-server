const { object, string } = require("yup");

const postSchema = object({
  title: string().min(6).required(),
  body: string().min(6).required(),
});

const updatePostSchema = object({
  title: string().min(6),
  body: string().min(6),
});

const userLoginSchema = object({
  email: string().email().required(),
  password: string().min(6).required(),
});

const userRegisterSchema = object({
  name: string().min(3).required(),
  surname: string().min(3).required(),
  email: string().email().required(),
  password: string().min(6).required(),
});

module.exports = {
  postSchema,
  updatePostSchema,
  userLoginSchema,
  userRegisterSchema,
};
