import passport from "passport";
import dotenv from 'dotenv'
const express = require("express");
const router = express.Router();
dotenv.config()

const client = process.env.client || 'https://localhost:3000'
const { signup, signin, sociallogin, logout } = require("../controllers/auth");

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/logout", logout);//변경 적용 확인

router.get("/kakao", passport.authenticate('kakao', { scope: ['profile','account_email'] }));
router.get("/kakao/callback", passport.authenticate('kakao',{ failureRedirect: `${client}`}), sociallogin);

router.get('/google', passport.authenticate('google',{ scope: ['profile','email'], accessType: "offline" }));
router.get('/google/callback', passport.authenticate('google',{ failureRedirect: `${client}`}), sociallogin);

export default router;
