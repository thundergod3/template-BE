import { Router } from "express";
import asyncHandler from "express-async-handler";

import {
  forgotPassword,
  resetPassword,
  signIn,
  signUp,
  verifiedResetToken,
} from "../app/controllers/auths.controller.js";

const authsRoute = Router();

// [GET]

// [POST]
authsRoute.post("/login", asyncHandler(signIn));
authsRoute.post("/register", asyncHandler(signUp));
authsRoute.post("/forgot-password", asyncHandler(forgotPassword));
authsRoute.post("/reset-password", asyncHandler(resetPassword));
authsRoute.post("/verified-token", verifiedResetToken);

export default authsRoute;
