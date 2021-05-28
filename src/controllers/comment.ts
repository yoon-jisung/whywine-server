import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { Comment } from "../entity/comment";
import { Tag } from "../entity/tag";
import { Wine } from "../entity/wine";
import jwt from "jsonwebtoken";
import { User } from "../entity/user";
import { Recomment } from "../entity/recomment";
require("dotenv").config();

export = {
  good: async (req: Request, res: Response) => {
    const connection = getConnection();
    const userRepo = await connection.getRepository(User);
    const commentRepo = await connection.getRepository(Comment);
    const { commentId } = req.body;

    // const userId: number = req.session!.passport!.user;
    const userId = 2;
    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ["good"],
    });
    const comment = await commentRepo.findOne({ id: commentId });

    if (user && comment) {
      // user.good = [...user.good, comment];
      // comment.good_count++;

      // await connection.manager.save(user);
      // await connection.manager.save(comment);

      console.log(user);
      res.status(200).send({
        data: {
          goodCount: comment.good_count,
        },
      });
    } else {
      res.status(404).send({ message: "user or commentId not existed." });
    }
  },
  bad: async (req: Request, res: Response) => {},
};
