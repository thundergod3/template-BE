import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import UsersModel from "../app/models/users.model.js";

export const authentication = asyncHandler(async (req, res, next) => {
  let token = "";

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await UsersModel.findOne({ where: { id: decoded.id } });

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export const activeUserAuthentication = asyncHandler(async (req, res, next) => {
  try {
    const dataUser = await UsersModel.findOne({ where: { id: req.user.id } });

    if (dataUser?.status === "active") next();
    else
      throw new Error(
        "Your account are not active!!!. Please check mail to active your account"
      );
  } catch (error) {
    console.error(error);
    res.status(401);
    throw new Error(
      "Your account are not active!!!. Please check mail to active your account"
    );
  }
});

export const adminAuthentication = asyncHandler(async (req, res, next) => {
  try {
    const dataUser = await UsersModel.findOne({ where: { id: req.user.id } });

    if (dataUser?.roles?.includes("admin")) next();
    else throw new Error("You are not admin!!!. Please try again");
  } catch (error) {
    console.error(error);
    res.status(401);
    throw new Error("You are not admin!!!. Please try again");
  }
});
