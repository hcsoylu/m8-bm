import express from "express";
// import passport from 'passport'
import UserModel from "./schema.js";
import { JWTAuthenticate } from "../../auth/tools.js";
import { JWTAuthMiddleware } from "../../auth/index.js";

const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  try {
    const user = new UserModel(req.body);
    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.checkCredentials(email, password);
    const tokens = await JWTAuthenticate;
    user;
    res.cookie("accessToken", tokens.accesToken, {
      sameSite: "lax",
      httpOnly: true,
    });
    res.cookie("refreshToken", tokens.refresh, {
      sameSite: "lax",
      httpOnly: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.get("/user/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/user/me/accomodation", hostOnly, async (req, res, next) => {});

// userRouter.get('/me', isAuthorized, async (req, res, next) => {
//   try {
//     const { user } = req
//     res.status(200).send(user)
//   } catch (error) {
//     next(error)
//   }
// });

// userRouter.post('/auth/refresh', async (req, res, next) => {
//   try {
//     const { refreshToken } = req.cookies.refreshToken
//     const decoded = verifyToken(refreshToken, 'refresh')
//     const user = await UserModel.findById(decoded.id)
//     if(!isRefreshValid) throw new Error('Refresh Token is not valid')
//     const tokens = generateTokens(user)
//     user.refreshToken = tokens.accessToken
//     res.cookie('accessToken', tokens.accessToken, {httpOnly: true})
//     res.cookie('refreshToken', tokens.refreshToken, {httpOnly: true})
//   } catch (error) {
//     const err = new Error('Not authorized!')
//     err.code= 401
//     next(error)
//   }
// })

export default userRouter;
