import { Router, Request, Response, NextFunction } from "express";

const logout = async (req: Request, res: Response) => {
    console.log(req.body);
  console.log("로그 아웃");
  res
    .clearCookie("refreshToken", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .redirect("/");
}

export default logout;