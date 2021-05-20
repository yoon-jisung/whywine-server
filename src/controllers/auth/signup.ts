import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import dotenv from 'dotenv';
dotenv.config();

const signup = async (req: Request, res: Response, next: NextFunction) => {
    //res.send("hello typescript express!");
    if (req.body.nickname!=='' && req.body.email!=='' && req.body.password!=='') {
        

        const password = req.body.password
        const saltedPassword = password + process.env.SALT
        const hashPassword = crypto
        .createHmac('sha512', process.env.CRYPTOKEY!)
        .update(saltedPassword)
        .digest('hex');
        console.log('암호화된 패스워드---', hashPassword);

        let [userInfo,created] = await user.findOrCreate({
            where:{email:req.body.email},
            defaults:{
                nickname: req.body.nickname,
                email: req.body.email,
                password: hashPassword,
                tags: req.body.tags
            }
        })

        if(created){

            const accessToken = jwt.sign(
                userInfo,
                process.env.ACCTOKEN_SECRET!,
                { expiresIn: '30m' }
            );
            const refreshToken = jwt.sign(
                userInfo,
                process.env.REFTOKEN_SECRET!,
                { expiresIn: '1h' }
            );
            res
            .status(201)
            .cookie('refreshToken', refreshToken, {
                path: '/main',
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            }).json({ data: accessToken,  message: 'ok' })
        }else{
            res.status(401).json({ data: null, message: "email already existed"});
        }
        
    } else {
        res.status(400).json({ data: null,  message: "fill email, password and nickname" })
    }
}
export default signup;