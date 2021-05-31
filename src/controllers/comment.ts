import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { Comment } from "../entity/comment";
import { Tag } from "../entity/tag";
import { Wine } from "../entity/wine";
import jwt from "jsonwebtoken";
import { User } from "../entity/user";
import { Recomment } from "../entity/recomment";

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

interface CommentInterface {
  id: number;
  text: string;
  userId?: number;
  wineId?: number;
  good_count: number;
  bad_count: number;
  recomments?: Recomment[];
}
export = {
  post: async (req: Request, res: Response) => {
    const connection = getConnection();
    const userRepo = await connection.getRepository(User);
    const wineRepo = await connection.getRepository(Wine);
    const commentRepo = await connection.getRepository(Comment);
    const { wineId, text } = req.body;

    const userId: number = req.session!.passport!.user;

    const user = await userRepo.findOne({ id: userId });
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
    try {
      const connection = getConnection();
      const userRepo = await connection.getRepository(User);
      const wineRepo = await connection.getRepository(Wine);
      const commentRepo = await connection.getRepository(Comment);
      const recommentRepo = await connection.getRepository(Recomment);

      const wineId: number = Number(req.query.wineid);
      const userId: number = req.session!.passport!.user;

      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ["good", "bad"],
      });
      const wine = await wineRepo.findOne({ id: wineId });
      if (user && wine) {
        let comments: Comment[] = await commentRepo.find({
          where: { wine: wineId },
          relations: ["user", "wine"],
        });
        let results: CommentInterface[] = [];
        for (let c of comments) {
          let res: CommentInterface = {
            id: c.id,
            text: c.text,
            userId: c.user.id,
            wineId: c.wine.id,
            good_count: c.good_count,
            bad_count: c.bad_count,
            recomments: await recommentRepo.find({ where: { comment: c.id } }),
          };
          results.push(res);
        }
        const usersgood: number[] = user.good.map((comment) => comment.id);
        const usersbad: number[] = user.bad.map((comment) => comment.id);
        res.status(200).send({
          data: {
            comments: results,
            usersgood,
            usersbad,
          },
          message: "ok.",
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      res.status(404).send({ message: "wineId or accessToken not found." });
    }
  },
  delete: async (req: Request, res: Response) => {
    const commentId = req.body.commentId;
    const userId = req.session!.passport!.user;

    const connection = getConnection();
    const comment = await connection
      .getRepository(Comment)
      .findOne({ where: { id: commentId }, relations: ["user"] });
    if (comment) {
      if (comment.user.id === userId) {
        await connection
          .createQueryBuilder()
          .delete()
          .from(Recomment)
          .where("comment = :commentId", { commentId })
          .execute();

        await connection
          .createQueryBuilder()
          .delete()
          .from(Comment)
          .where("id = :commentId", { commentId })
          .execute();

        res.status(200).send({ message: "comment successfully deleted." });
      } else {
        res.status(401).send({ message: "you are unauthorized." });
      }
    } else {
      res.status(404).send({ message: "commentId not existed." });
    }
  },
  put: async (req: Request, res: Response) => {
    const { text, commentId } = req.body;
    const userId = req.session!.passport!.user;

    const connection = await getConnection();
    const commentRepo = await connection.getRepository(Comment);
    const comment = await commentRepo.findOne({
      where: { id: commentId },
      relations: ["user"],
    });
    if (comment) {
      if (comment.user.id === userId) {
        await connection
          .createQueryBuilder()
          .update(Comment)
          .set({ text: text })
          .where("id = :commentId", { commentId })
          .execute();

        res.status(200).send({ message: "comment successfully deleted." });
      } else {
        res.status(401).send({ message: "you are unauthorized." });
      }
    } else {
      res.status(404).send({ message: "commentId not existed." });
    }
  },
  good: async (req: Request, res: Response) => {
    try {
      let commentId;
      let userId;
      if (req.body.commentId) {
        commentId = req.body.commentId;
      } else {
        throw new Error("commentId");
      }
      // if (req.session!.passport!) {
      //   userId = req.session!.passport!.user;
      // } else {
      //   throw new Error("user");
      // }

      const connection = getConnection();
      const userRepo = await connection.getRepository(User);
      const commentRepo = await connection.getRepository(Comment);

      const user = await userRepo.findOne({
        where: { id: 4 },
      }); // 4==>userId
      const comment = await commentRepo.findOne({ id: commentId });

      if (user) {
        if (comment) {
          let result = await userRepo
            .createQueryBuilder("user")
            .innerJoinAndSelect("user.good", "good")
            .where("good.id = :commentId", { commentId })
            .getOne();

          if (!result) {
            // 좋아요 추가
            await connection
              .createQueryBuilder()
              .relation(User, "good")
              .of(user)
              .add(comment);

            await connection
              .createQueryBuilder()
              .update(Comment)
              .set({ good_count: comment.good_count + 1 })
              .where("id = :commentId", { commentId })
              .execute();
            res.status(200).send({
              data: { goodCount: comment.good_count + 1 },
              message: "good button clicked.",
            });
          } else {
            // 좋아요 취소
            await connection
              .createQueryBuilder()
              .relation(User, "good")
              .of(user)
              .remove(comment);
            await connection
              .createQueryBuilder()
              .update(Comment)
              .set({ good_count: comment.good_count - 1 })
              .where("id = :commentId", { commentId })
              .execute();

            res.status(200).send({
              data: { goodCount: comment.good_count - 1 },
              message: "good button cancelled.",
            });
          }
        } else {
          throw new Error("comment");
        }
      } else {
        throw new Error("user");
      }
    } catch (e) {
      if (e.message === "user") {
        res.status(401).send("no user");
      }
      if (e.message === "commentId") {
        res.status(404).send("commentId not existed");
      }
      if (e.message === "comment") {
        res.status(404).send("comment not existed");
      }
    }
  },
  bad: async (req: Request, res: Response) => {
    try {
      let commentId;
      let userId;
      if (req.body.commentId) {
        commentId = req.body.commentId;
      } else {
        throw new Error("commentId");
      }
      // if (req.session!.passport!) {
      //   userId = req.session!.passport!.user;
      // } else {
      //   throw new Error("user");
      // }

      const connection = getConnection();
      const userRepo = await connection.getRepository(User);
      const commentRepo = await connection.getRepository(Comment);

      const user = await userRepo.findOne({
        where: { id: 4 },
      }); // 4==>userId
      const comment = await commentRepo.findOne({ id: commentId });

      if (user) {
        if (comment) {
          let result = await userRepo
            .createQueryBuilder("user")
            .innerJoinAndSelect("user.bad", "bad")
            .where("bad.id = :commentId", { commentId })
            .getOne();

          if (!result) {
            // 좋아요 추가
            await connection
              .createQueryBuilder()
              .relation(User, "bad")
              .of(user)
              .add(comment);

            await connection
              .createQueryBuilder()
              .update(Comment)
              .set({ bad_count: comment.bad_count + 1 })
              .where("id = :commentId", { commentId })
              .execute();
            res.status(200).send({
              data: { badCount: comment.bad_count + 1 },
              message: "bad button clicked.",
            });
          } else {
            // 좋아요 취소
            await connection
              .createQueryBuilder()
              .relation(User, "bad")
              .of(user)
              .remove(comment);
            await connection
              .createQueryBuilder()
              .update(Comment)
              .set({ bad_count: comment.bad_count - 1 })
              .where("id = :commentId", { commentId })
              .execute();

            res.status(200).send({
              data: { badCount: comment.bad_count - 1 },
              message: "bad button cancelled.",
            });
          }
        } else {
          throw new Error("comment");
        }
      } else {
        throw new Error("user");
      }
    } catch (e) {
      if (e.message === "user") {
        res.status(401).send("no user");
      }
      if (e.message === "commentId") {
        res.status(404).send("commentId not existed");
      }
      if (e.message === "comment") {
        res.status(404).send("comment not existed");
      }
    }
  },
};
