import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { createQueryBuilder, getConnection } from "typeorm";
import { Tag } from "../../entity/tag";
import { User } from "../../entity/user";
import { Comment } from "../../entity/comment";
import { Wine } from "../../entity/wine";

dotenv.config();

const userinfo = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const user = await createQueryBuilder("user")
      .where("id = :id", { id: req.session!.passport!.user })
      .execute();
    if (user.length !== 0) {
      console.log(user)
      const connection = await getConnection();
      let userRepo = connection.getRepository(User)
      let tagRepo = connection.getRepository(Tag)
      let commentRepo = connection.getRepository(Comment)
      let wineRepo = connection.getRepository(Wine)

      const finduser = await userRepo.findOne({ id : req.session!.passport!.user });
      


      return res.status(200).send(
        {
          data: {
            id: user[0].User_id,
            email: user[0].User_email,
            nickname: user[0].User_nickname,
            likes: user[0].User_likes,
            image: user[0].User_image
          },
          message: "successfully got user info"
        }
      );
    }
  } catch (error) {
    console.error(error.message);
    res.status(401).send({ data: null, message: "not authorized" });

  }
};

export default userinfo;
