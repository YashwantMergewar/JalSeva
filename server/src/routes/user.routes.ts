import { Router } from "express";
import {
  loginUser,
  logoutAllController,
  logoutController,
  meController,
  refreshController,
  registerCitizen,
} from "../controller/user.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerCitizen);
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh").post(refreshController);
userRouter.route("/logout").post(logoutController);
userRouter.route("/logout-all").post(authenticate, logoutAllController);
userRouter.route("/me").get(authenticate, meController);

export { userRouter };
