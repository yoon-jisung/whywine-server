import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import passport from 'passport';
import { User } from "../../entity/user";
import { createQueryBuilder, getRepository } from "typeorm";
import jwt from 'jsonwebtoken';
const KakaoStrategy = require('passport-kakao').Strategy;
dotenv.config();
export default () => {
    passport.use(new KakaoStrategy({
        clientID:     process.env.KAKAO_CLIENT_ID,
        callbackURL: "https://localhost:4000/auth/kakao/callback",
    },async function(accessToken:string, refreshToken:string, profile:any, cb:any){
                        
        try {
            console.log(profile)
            const { _json: { id, properties: {nickname, profile_image, thumbnail_image } } } = profile;
            const userRepository = await getRepository(User);
            const findEmail = await userRepository.findOne({ where: { id } });
            if(findEmail){
                console.log('카카오기존 가입자')
                const accessToken:string = jwt.sign(
                    {findEmail},
                    process.env.ACCTOKEN_SECRET!,
                    { expiresIn: '30m' }
                );
                const refreshToken:string = jwt.sign(
                    {findEmail},
                    process.env.REFTOKEN_SECRET!,
                    { expiresIn: '1h' }
                );
                const tokens = {accessToken,refreshToken}
                return cb(null,tokens)
            }
            console.log('카카오 처음 로그인')
            const userInfo = new User
            userInfo.email = id
            userInfo.nickname = nickname
            userInfo.password = id
            userInfo.likes = 0
            userInfo.image = profile_image
            const saveData = await userRepository.save(userInfo)
            // const accessToken:string = jwt.sign(
            //     {saveData},
            //     process.env.ACCTOKEN_SECRET!,
            //     { expiresIn: '30m' }
            // );
            // const refreshToken:string = jwt.sign(
            //     {saveData},
            //     process.env.REFTOKEN_SECRET!,
            //     { expiresIn: '1h' }
            // );
            const tokens = {accessToken,refreshToken}
            return cb(null,tokens);
        } catch (error) {
            console.log('에러',error)
            return cb(error)
        }
    }
    ));
}