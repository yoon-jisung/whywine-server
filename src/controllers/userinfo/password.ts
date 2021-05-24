import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import dotenv from 'dotenv';
import { getRepository, getConnection } from "typeorm";
import { User } from "../../entity/user";
const userRepository = getRepository(User);
dotenv.config();

const password = async (req: Request, res: Response, next: NextFunction) => {
    const {oldPassword, newPassword, accessToken} = req.body
    interface userInfo {
        id: number;
        password: string;
    }

    const {id, password} = jwt.verify(accessToken,process.env.ACCTOKEN_SECRET!)as userInfo
    
    const oldsaltedPassword = oldPassword + process.env.SALT
    const oldhashPassword = crypto
    .createHmac('sha512', process.env.CRYPTOKEY!)
    .update(oldsaltedPassword)
    .digest('hex');
    console.log('암호화된 패스워드---', oldhashPassword);
    

    if(!accessToken){
        return res
            .status(401)
            .json({ message: 'wrong accessToken' })
    }
    if(password === oldhashPassword){
        return res
            .status(401)
            .json({ message: 'wrong oldPassword' })
    }
    if(newPassword === ''){
        return res
            .status(400)
            .json({ message: 'newPassword is empty' } )
    }

    const newsaltedPassword = newPassword + process.env.SALT
    const newHashPassword = crypto
    .createHmac('sha512', process.env.CRYPTOKEY!)
    .update(newsaltedPassword)
    .digest('hex');
    console.log('새로운 암호화된 패스워드---', newHashPassword);
    await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ 
            password: newHashPassword
        })
        .where("id = :id", { id: id })
        .execute();
    return res
        .status(200)
        .json({ message : 'ok.' })
}

export default password;