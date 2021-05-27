import passport from 'passport';
import { createQueryBuilder, getRepository } from "typeorm";
import { User } from "../../entity/user";
import dotenv from 'dotenv';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
dotenv.config();

export default () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${process.env.SERVER_URL}/auth/google/callback`
            },
            async function (accessToken:string, refreshToken:string, profile:any, cb:any) {
                
                try {
                    console.log(profile)
                    const { _json: { email, name, picture, sub} } = profile;
                    const userRepository = await getRepository(User);
                    const findEmail = await userRepository.findOne({ where: { email } });
                    if(findEmail){
                        console.log('구글기존 가입자')
                        return cb(null,findEmail)
                    }
                    console.log('구글 처음 로그인')
                    const userInfo = new User
                    userInfo.email = email
                    userInfo.nickname = name
                    userInfo.password = sub
                    userInfo.likes = 0
                    userInfo.image = picture
                    const saveData = await userRepository.save(userInfo)
                    
                    return cb(null,saveData);
                } catch (error) {
                    console.log('에러',error)
                    return cb(error)
                }
            }
        )
    )
}