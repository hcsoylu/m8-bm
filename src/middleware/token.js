import jwt from "jsonwebtoken";

export const genareteTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expressIn: "1hr",
    }
  );

  const refreshToken = jwt.sign(
    {
      id: user.name,
    },
    process.env.REFRESH_JWT_TOKEN,
    {
      expiresIn: "1d",
    }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token, key) => {
  let decoded;
  if (key == "access") {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } else if (key == "refresh") {
    decoded = jwt.verify(token, process.env.REFRESH_JWT_SECRET);
  }
  if (!decoded) return new Error();
  return decoded;
};
