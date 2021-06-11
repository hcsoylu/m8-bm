import { verifyToken } from "./tokens";
import UserModel from "../services/users/schema";

export const isAuthorized = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    const decoded = verify(accessToken, "access");
    if (!decoded) throw new Error("Token not valid");
    const user = await UserModel.findById(decoded.id);
    if (!user) throw new Error("User not authorized!");
    req.user = user;
    next();
  } catch (error) {
    new Error("Not authorized!");
    error.code = 401;
    next(error);
  }
};
