import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import dotenv from 'dotenv';
import {getRepository} from "typeorm";
import {User} from '../../entity/user';


dotenv.config();

const signin = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = await getRepository(User);
    if(req.body.email === '' && req.body.password === ''){
        return res.status(400).json({ data: null, message: "fill email and password" })
    }

    const password = req.body.password
    const saltedPassword = password + process.env.SALT
    const hashPassword = crypto
        .createHmac('sha512', process.env.CRYPTOKEY!)
        .update(saltedPassword)
        .digest('hex');
    console.log('암호화된 패스워드---', hashPassword);

    const findEmail = await userRepository.findOne({
        where: { email: req.body.email },
    });
    if(!findEmail){
        res.status(401).json({
            data: null,
            message: "wrong email",
        });
    }
    const findPassword = await userRepository.findOne({
        where: { password: hashPassword },
    });
    if (!findPassword) {
        res.status(401).json({
            data: null,
            message: "wrong password",
        });
    }
    const userInfo = await userRepository.findOne({
        where: { email:req.body.email, password: hashPassword },
    });
    if(userInfo){
        const accessToken = jwt.sign(
            {userInfo},
            process.env.ACCTOKEN_SECRET!,
            { expiresIn: '30m' }
        );
        const refreshToken = jwt.sign(
            {userInfo},
            process.env.REFTOKEN_SECRET!,
            { expiresIn: '1h' }
        );
        res
        .status(201)
        .cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        }).json({ data: accessToken,  message: 'ok' })
    }
    
}

export default signin;