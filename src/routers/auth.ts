import { Router, Request, Response, NextFunction } from 'express';
const { signup, signin, google, googlecallback } = require('../controllers/auth')

const router = Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.get("/google",google);
router.get("/google/callback",googlecallback);
router.get("/refreshTokenReq",);
router.get("/logout",);
//router.get("/userinfo",);




export default router;