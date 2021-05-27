import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { Comment } from "../entity/comment";
import { Tag } from "../entity/tag";
import { Wine } from "../entity/wine";
import jwt from "jsonwebtoken";
import { User } from "../entity/user";
require("dotenv").config();
interface TokenInterface {
  // verified accessToken의 인터페이스
  id: number;
  email: string;
  nickname: string;
  likes?: number;
  image?: Buffer;
  tags: Tag[];
  good?: Comment[];
  bad?: Comment[];
  wines?: Wine[];
}
export = {
  post: async (req: Request, res: Response) => {
    const connection = getConnection();
    const userRepo = await connection.getRepository(User);
    const wineRepo = await connection.getRepository(Wine);
    const commentRepo = await connection.getRepository(Comment);
    const { wineId, text, accessToken } = req.body;

    const userinfo = jwt.verify(
      accessToken,
      process.env.ACCTOKEN_SECRET!
    ) as TokenInterface;

    const user = await userRepo.findOne({ id: userinfo.id });
    const wine = await wineRepo.findOne({ id: wineId });
    if (user === undefined || wine === undefined || text === "") {
      res
        .status(404)
        .send({ message: "text, wineId or accessToken not existed" });
      return;
    } else {
      let comment = new Comment();
      comment.text = text;
      comment.user = user;
      comment.wine = wine;
      comment.good_count = 0;
      comment.bad_count = 0;
      const newComment = await connection.manager.save(comment);

      res.status(200).send({
        data: {
          newComment,
        },
        message: "ok.",
      });
      return;
    }
  },
  get: async (req: Request, res: Response) => {
    const wineId: number = Number(req.query.wineid);
    const accessToken = req.headers["authorization"]?.split(" ")[1];
    const connection = getConnection();
    const userRepo = await connection.getRepository(User);
    const wineRepo = await connection.getRepository(Wine);
    const commentRepo = await connection.getRepository(Comment);

    try {
      if (accessToken) {
        const userinfo = jwt.verify(
          accessToken,
          process.env.ACCTOKEN_SECRET!
        ) as TokenInterface;

        const user = await userRepo.findOne({ id: userinfo.id });
        const wine = await wineRepo.findOne({ id: wineId });

        if (user && wine) {
          const comments: Comment[] = await commentRepo.find({
            where: { wine: wineId },
          });

          console.log(comments);
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      res.status(404).send({ message: "wineId or accessToken not found." });
    }
  },
  delete: async (req: Request, res: Response) => {},
  put: async (req: Request, res: Response) => {},
};
