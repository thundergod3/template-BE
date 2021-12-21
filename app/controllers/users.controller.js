import pkg from "sequelize";

import validatePassword from "../../utils/validatePassword.js";
import hashPassword from "../../utils/hashPassword.js";

import UsersModel from "../models/users.model.js";

const { Op } = pkg;

// [GET]
export const getUserData = async (req, res) => {
  const user = await UsersModel.findOne({
    where: {
      id: req.user.id,
    },
  });

  delete user?.dataValues?.password;

  res.status(200).json(user);
};

// [POST]

//[PUT]
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await UsersModel.findOne({ where: { id: req.user.id } });

  if (validatePassword(oldPassword, user.password)) {
    await user.update({ password: hashPassword(newPassword) });

    res.status(200).json({
      msg: "Update password successfully",
    });
  } else
    res.status(404).json({
      msg: "Invalid password. Please try again",
    });
};
