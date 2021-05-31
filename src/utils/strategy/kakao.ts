import dotenv from 'dotenv';
import passport from 'passport';
import { User } from "../../entity/user";
import { createQueryBuilder, getRepository } from "typeorm";
const KakaoStrategy = require('passport-kakao').Strategy;
dotenv.config();
const server = process.env.SERVER || 'https://localhost:4000'
export default () => {
    passport.use(new KakaoStrategy({
        clientID:     process.env.KAKAO_CLIENT_ID,
        callbackURL: `${server}/auth/kakao/callback`,
    },async function(accessToken:string, refreshToken:string, profile:any, cb:any){
                        
        try {
            const { _json: { id, properties: {nickname, profile_image, thumbnail_image } } } = profile;
            
            const users = (await createQueryBuilder("user")
            .where("email = :email", { email: "Kakao " + id })
            .execute());

            for (let user of users) {
                if (user && user.User_password == null && user.User_email.split(' ')[0] === 'Kakao') {
                    return cb(null, user)
                }
            }
            const userRepository = await getRepository(User);
            console.log('카카오 처음 로그인')
            
            
            const userInfo = new User
            userInfo.email = "Kakao " + id
            userInfo.nickname = nickname
            userInfo.likes = 0
            userInfo.image = profile_image
            const saveData = await userRepository.save(userInfo)
            
            const userId = { User_id: saveData.id }
            
            return cb(null,userId);
        } catch (error) {
            console.log('에러',error)
            return cb(error)
        }
    }
    ));
}