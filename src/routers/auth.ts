import { Router, Request, Response, NextFunction } from 'express';
const express = require("express");
const router = express.Router();
const { signup, signin, google } = require('../controllers/auth')

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/google", google);
router.get("/refreshTokenReq",);
router.get("/logout",);
//router.get("/userinfo",);




export default router;