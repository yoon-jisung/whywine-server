import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getRepository, createConnection } from "typeorm";
import { User } from "../../entity/user";

dotenv.config();

const profileImage = async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    const { accesToken } =req.body
    
    try {
        console.log("req.file: ", req.file); // 테스트 => req.file.location에 이미지 링크(s3-server)가 담겨있음 

        let payLoad = { url: req.file };
    } catch (err) {
        console.log(err);
    }
}

export default profileImage;