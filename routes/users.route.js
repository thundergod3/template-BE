import { Router } from "express";
import asyncHandler from "express-async-handler";

import { authentication } from "../middlewares/authentications.js";

import {
  changePassword,
  getUserData,
} from "../app/controllers/users.controller.js";

const usersRoute = Router();

// [GET]
usersRoute.get("/me", authentication, asyncHandler(getUserData));

// [POST]

// [PUT]
usersRoute.put(
  "/change-password",
  authentication,
  asyncHandler(changePassword)
);

// [DELETE]

export default usersRoute;
