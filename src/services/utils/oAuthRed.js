const { FE_URL_DEV } = process.env;

export const oAuthRedController = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.user.tokens;
    req.cookie("accessToken", accessToken, { hettpOnly: true });
    res.cookie("rehreshToken", refreshToken, {
      httpOnly: true,
      path: "/refreshToken",
    });
    res.status(200);
  } catch {
    console.log(error);
    next(error);
  }
};
