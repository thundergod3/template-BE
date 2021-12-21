import moment from "moment";
import jwt from "jsonwebtoken";

import generateToken from "../../utils/generateToken.js";
import validatePassword from "../../utils/validatePassword.js";
import sendingMail from "../../utils/sendingEmail.js";
import hashPassword from "../../utils/hashPassword.js";

import UsersModel from "../models/users.model.js";
import ResetTokensModel from "../models/resetTokens.model.js";

// [GET]
export const verifiedResetToken = async (req, res) => {
  const { resetToken } = req.body;

  const findResetToken = await ResetTokensModel.findOne({
    where: {
      token: resetToken,
    },
  });

  if (findResetToken) {
    try {
      jwt.verify(resetToken, process.env.JWT_SECRET);
      res.status(200).json({
        msg: "Reset token is valid",
      });
    } catch (error) {
      console.log(error);
      res.status(401).json({
        msg: "Invalid reset token. Please try again",
      });
    }
  } else
    res.status(401).json({
      msg: "Invalid reset token. Please try again",
    });
};

// [POST]
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await UsersModel.findOne({
    where: {
      email,
    },
  });

  if (user && validatePassword(password, user.password)) {
    if (user.status === "active")
      res.status(200).json({
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        roles: user.roles,
        status: user.status,
        token: generateToken(user.id),
      });
    else
      res.status(401).json({
        msg: "Your account is inactive. Please contact support@propertygenie.io for assistance",
      });
  } else {
    res.status(401).json({
      msg: "Invalid email or password",
    });
  }
};
export const signUp = async (req, res) => {
  const { fullName, email, password } = req.body;
  const userExists = await UsersModel.findOne({
    where: {
      email,
    },
  });

  if (userExists) {
    res.status(401).json({
      msg: "User already existed. Please try again with another email",
    });
  } else {
    const user = await UsersModel.create({
      fullName,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        roles: user.roles,
        status: user.status,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({
        msg: "Invalid user data. Please try again",
      });
    }
  }
};
export const forgotPassword = async (req, res) => {
  const userEmail = req?.body?.email;

  const findUser = await UsersModel.findOne({
    where: {
      email: userEmail,
    },
  });

  if (findUser) {
    const resetToken = generateToken(findUser.id, "1h");
    const templateHTML = `
  <h3>Hi ${findUser.fullName}</h3>
  You have requested for a password reset at <b>${moment(new Date())
    .tz("Asia/Singapore")
    .format("MMMM Do YYYY, h:mm:ss a")}</b>
  <p>If this is not you, please ignore the this email.</p>
  <p>Otherwise, please click <a href="${
    process.env.FRONT_END_CALLBACK
  }/auth/reset-password/callback?resetToken=${resetToken}">here</a> to reset your password.</p>
  <p>Alternatively, you can copy this link to reset your password</p>
  ${
    process.env.FRONT_END_CALLBACK
  }/auth/reset-password/callback?resetToken=${resetToken}
  <p>From your PropertyGenie!</p>
      `;
    const result = await sendingMail(
      "Safe Haven <info@safehaven.n3apps.com>",
      userEmail,
      "Reset Password",
      templateHTML
    );
    const findResetToken = await ResetTokensModel.findOne({
      where: {
        userId: findUser.id,
      },
    });

    if (findResetToken) findResetToken.destroy();

    if (result) {
      await ResetTokensModel.create({
        token: resetToken,
        userId: findUser.id,
      });
      res.status(200).json({
        msg: `Reset password has been sent to ${userEmail}`,
      });
    } else
      res.status(500).json({
        msg: `Error in sending email to ${userEmail}`,
      });
  } else
    res.status(200).json({
      msg: `Reset password has been sent to ${userEmail}`,
    });
};
export const resetPassword = async (req, res) => {
  const { newPassword, token } = req.body;

  const resetToken = await ResetTokensModel.findOne({ where: { token } });
  const user = await UsersModel.findOne({ where: { id: resetToken.userId } });

  if (!resetToken || !resetToken.userId)
    return res.status(422).json({
      msg: "Cannot reset a password. Please try again",
    });

  if (!user)
    return res.status(422).json({
      msg: "Cannot reset a password. Please try again",
    });

  await resetToken.destroy();
  await user.update({ password: hashPassword(newPassword) });

  res.status(200).json({
    msg: "Password has been reset!",
  });
};

//[PUT]
