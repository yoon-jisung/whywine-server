import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
const express = require("express");
const router = express.Router();

const { signup, signin } = require('../controllers/auth')

router.post("/signup",signup);
router.post("/signin",signin);
router.get("/refreshTokenReq",);
router.get("/logout",(req:Request, res:Response)=>{
    console.log(req.body)
    console.log('로그 아웃')
    res.clearCookie('refreshToken', {
        path:'/',
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    }).redirect('/')
});


//추후 컨트롤러 부분으로 리팩토링 예정
router.get("/kakao",passport.authenticate('kakao', { scope: ['profile'] }));
router.get("/kakao/callback",passport.authenticate('kakao',{ failureRedirect: 'https://localhost:3000',session: false}),
    function (req:Request, res:Response) {
        // Successful authentication, redirect home.
        console.log('카카오콜백성공')
        console.log('카카오req',req.user)
        interface tokens  {
            accessToken:string;
            refreshToken:string;
        }
        const { accessToken, refreshToken } = req.user as tokens
        res
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        .redirect('https://localhost:3000/main')
    });

router.get('/google',
    passport.authenticate('google',{ scope: ['profile','email'], accessType: "offline" })
    );
router.get('/google/callback',
    passport.authenticate('google',{ failureRedirect: 'https://localhost:3000',session: false}),
    function (req:Request, res:Response) {
        // Successful authentication, redirect home.
        console.log('구글콜백성공')
        console.log('구글req',req.user)
        interface tokens  {
            accessToken:string;
            refreshToken:string;
        }
        const { accessToken, refreshToken } = req.user as tokens
        res
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        .redirect('https://localhost:3000/main')
    });

export default router;

