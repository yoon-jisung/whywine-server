import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const refreshTokenReq = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.refreshToken;
  console.log(token);
  const refreshTokenData = jwt.verify(token, process.env.REFTOKEN_SECRET!);
  console.log(refreshTokenData);
  const accessToken = jwt.sign(
    { refreshTokenData },
    process.env.ACCTOKEN_SECRET!,
    { expiresIn: "30m" }
  );
  res.status(201).json({ data: accessToken, message: "ok" });
};

export default refreshTokenReq;
