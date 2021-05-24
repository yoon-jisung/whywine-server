import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const refreshTokenReq = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;

    const refreshTokenData = jwt.verify(refreshToken,process.env.REFTOKEN_SECRET!);
    const accessToken = jwt.sign(
        refreshTokenData,
        process.env.ACCTOKEN_SECRET!,
        { expiresIn: '30m' }
    );
    res.status(201).json({ data: accessToken,  message: 'ok' })
}

export default refreshTokenReq;