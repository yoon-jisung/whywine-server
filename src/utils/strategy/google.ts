import passport from 'passport';
import { createQueryBuilder, getRepository } from "typeorm";
import { User } from "../../entity/user";
import dotenv from 'dotenv';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
dotenv.config();
const server = process.env.SERVER || 'https://localhost:4000'
export default () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${server}/auth/google/callback`
            },
            async function (accessToken:string, refreshToken:string, profile:any, cb:any) {
                try {
                    const { _json: { email, name, picture, sub} } = profile;
                    
                    const users = (await createQueryBuilder("user")
                        .where("email = :email", { email })
                        .execute());
                    for (let user of users) {
                        if (user && user.User_password == null && user.User_email.split('@')[1] === 'gmail.com') {
                            return cb(null, user)
                        }
                    }
                    const userRepository = await getRepository(User);
                    console.log('구글 처음 로그인')
                    const userInfo = new User
                    userInfo.email = email
                    userInfo.nickname = name
                    userInfo.likes = 0
                    userInfo.image = picture
                    const saveData = await userRepository.save(userInfo)
                    const userId = { User_id: saveData.id }
                    return cb(null,userId);
                } catch (error) {
                    console.log('에러',error)
                    return cb(error)
                }
            }
        )
    )
}