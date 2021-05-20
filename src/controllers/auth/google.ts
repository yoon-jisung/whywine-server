import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import dotenv from 'dotenv';
import passport from 'passport';
import axios, { AxiosResponse } from "axios";
dotenv.config();

const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://localhost:4000/auth/google/callback",
    passReqToCallback   : true
},(accesToken:string,refreshToken:string)=>{console.log('토큰들',accesToken,refreshToken)}
));

const google = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
}
export default google;