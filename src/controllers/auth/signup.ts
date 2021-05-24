import { Request, Response, NextFunction} from 'express';
import { getRepository } from "typeorm";
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import dotenv from 'dotenv';
import { User } from '../../entity/user';

dotenv.config();


const signup = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = await getRepository(User);
    
    if (req.body.nickname === '' || req.body.email === '' || req.body.password === ''){
        return res.status(400).json({ data: null,  message: "fill email, password and nickname" })
    }

    const email:string = req.body.email;
    const nickname:string = req.body.email;
    const password:string = req.body.password;
    const tags:string[] = req.body.tags
    const saltedPassword = password + process.env.SALT
    const hashPassword = crypto
    .createHmac('sha512', process.env.CRYPTOKEY!)
    .update(saltedPassword)
    .digest('hex');
    console.log('암호화된 패스워드---', hashPassword);
    
    const findEmail = await userRepository.findOne({ where: { email } });
    if(findEmail){
        return res.status(401).json({ data: null, message: "email already existed"});
    }
    const userInfo = new User
    userInfo.email = email
    userInfo.nickname = nickname
    userInfo.password = hashPassword
    userInfo.likes = 0
    userInfo.image = ''
    //userInfo.tags = tags
    const saveData = await userRepository.save(userInfo)
    console.log('저장됨',saveData)
    console.log('userInfo-------',userInfo)
    try {
        const accessToken:string = jwt.sign(
            {userInfo},
            process.env.ACCTOKEN_SECRET!,
            { expiresIn: '30m' }
        );
        const refreshToken:string = jwt.sign(
            {userInfo},
            process.env.REFTOKEN_SECRET!,
            { expiresIn: '1h' }
        );
        return res
        .status(201)
        .cookie('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }).json({ data: accessToken,  message: 'ok' })
    } catch (error) {
        console.log(error)
    }
}
export default signup;