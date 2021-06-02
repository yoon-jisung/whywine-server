import { Request, Response, NextFunction } from "express";

import dotenv from "dotenv";
dotenv.config();

const profileImage = {
  upload: async (req: Request, res: Response) => {
    console.log(req.file);
    if (req.file === undefined) {
      return res.status(400).send("이미지가 존재하지 않습니다");
    } else {
      res.status(200).send("요청 성공 - ");
    }
  },
};

export default profileImage;
