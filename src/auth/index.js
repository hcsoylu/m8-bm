import atob from "atob";

import UserModel from "../services/users/schema.js";
import { verifyJWT } from "./tools.js";

export const JWTAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    const content = await verifyJWT(token);
    const user = await UserModel.findById(content._id);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    const err = new Error("token is not valid");
    err.httpStatusCode = 401;
    next(err);
  }
};

export const basicAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    const error = new Error("No Auth provided!");
    error.httpStatusCode = 401;
    next(error);
  } else {
    const decoded = atob(req.headers.authorization.split(" ")[1]);
    const [email, password] = decoded.split(":");

    const user = await UserModel.checkCredentials(email, password);
    if (user) {
      req.user = user;
      next();
    } else {
      const error = new Error("Wrong credentials");
      error.httpStatusCode = 401;
      next(error);
    }
  }
};

export const hostOnly = (req, res, next) => {
  if (req.user.role === "host") {
    next();
  } else {
    const error = new Error("Host only!");
    error.httpStatusCode = 403;
    next(error);
  }
};
