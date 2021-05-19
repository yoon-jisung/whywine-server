import { Router, Request, Response, NextFunction } from 'express';
const { signup } = require('../controllers/auth')

const router = Router();

router.post("/signup",signup);
router.post("/signin",);
router.post("/googlesignin",);
router.get("/refreshTokenReq",);
router.get("/logout",);
//router.get("/userinfo",);




export default router;