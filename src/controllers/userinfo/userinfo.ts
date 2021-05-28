import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { createQueryBuilder, getConnection,getRepository } from "typeorm";
import { Tag } from "../../entity/tag";
import { User } from "../../entity/user";
import { Comment } from "../../entity/comment";
import { Wine } from "../../entity/wine";

dotenv.config();

const userinfo = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const userRepository = getRepository(User)
    const user = await userRepository.find({
        where: { id: req.session!.passport!.user },
        relations: ["tags", "good", "bad", "wines"] });
    if (user) {
      const userInfo = user[0]


      return res.status(200).send(
        {
          data: {
            userInfo
          },
          message: "ok"
        }
      );
    }
  } catch (error) {
    console.error(error.message);
    res.status(401).send({ data: null, message: "not authorized" });

  }
};

export default userinfo;
