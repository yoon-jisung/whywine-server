import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
const express = require("express");
const router = express.Router();

const { signup, signin, refreshTokenReq } = require("../controllers/auth");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/refreshTokenReq", refreshTokenReq);
router.get("/logout", (req: Request, res: Response) => {
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
});

router.get("/kakao",passport.authenticate('kakao', { scope: ['profile','account_email'] }));
router.get("/kakao/callback",passport.authenticate('kakao',{ failureRedirect: 'https://localhost:3000'}),
    function (req:Request, res:Response) {
        console.log('카카오콜백성공')
        res.redirect('back')
    });

router.get('/google',
    passport.authenticate('google',{ scope: ['profile','email'], accessType: "offline" })
    );
router.get('/google/callback',
    passport.authenticate('google',{ failureRedirect: 'https://localhost:3000'}),
    function (req:Request, res:Response) {
        // Successful authentication, redirect home.
        console.log('구글콜백성공')
        res.redirect('back')
    });


export default router;
