import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { createQueryBuilder } from "typeorm";
import { Tag } from "../../entity/tag";
import { User } from "../../entity/user";
import { Comment } from "../../entity/comment";
import { Wine } from "../../entity/wine";

dotenv.config();

interface userInfo {
  // verified accessToken의 인터페이스
  id: number;
  email: string;
  nickname: string;
  likes?: number;
  image?: string;
  tags: Tag[];
  good?: Comment[];
  bad?: Comment[];
  wines?: Wine[];
}

const userinfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.session)
    const user = await createQueryBuilder("user")
      .where("id = :id", { /* id: req.session.passport.user  */})
      .execute();
    if (user.length !== 0) {
      return res.status(200).send(
        {
          data: {
            id: user[0].User_id,
            email: user[0].User_email,
            name: user[0].User_name,
            profileIconURL: user[0].User_profileIconURL,
            isAdmin: user[0].User_isAdmin
          },
          message: "successfully got user info"
        }
      );
    }
  } catch (error) {
    console.error(error.message);
    if (error.message === "Cannot read property 'user' of undefined") {
      res.status(401).send({ data: null, message: "not authorized" });
    } else {
      res.status(400).send({ data: null, message: error.message })
    }
  }
};

export default userinfo;
