import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { Comment } from "../entity/comment";
import { Tag } from "../entity/tag";
import { Wine } from "../entity/wine";
import { User } from "../entity/user";
import { Recomment } from "../entity/recomment";

require("dotenv").config();

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
    try {
      const connection = getConnection();
      const userRepo = await connection.getRepository(User);
      const wineRepo = await connection.getRepository(Wine);
      const { wineId, text } = req.body;

      let userId: number;

      if (req.session!.passport!.user) {
        userId = req.session!.passport!.user;
      } else {
        throw new Error("userId");
      }

      if (!wineId) {
        throw new Error("wineId");
      }

      if (!text) {
        throw new Error("text");
      }

      const user = await userRepo.findOne({ id: userId });
      const wine = await wineRepo.findOne({ id: wineId });
      if (!user) {
        throw new Error("user");
      } else if (!wine) {
        throw new Error("wine");
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
    } catch (e) {
      if (e.message === "userId") {
        res.status(404).send({ message: "userId not existed" });
      } else if (e.message === "wineId") {
        res.status(404).send({ message: "wineId not existed" });
      } else if (e.message === "text") {
        res.status(404).send({ message: "text is empty" });
      } else if (e.message === "user") {
        res.status(404).send({ message: "user not existed" });
      } else if (e.message === "wine") {
        res.status(404).send({ message: "wine not existed" });
      } else {
        res.status(404).send({ message: "something wrong" });
      }
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

      if (!user) {
        throw new Error("user");
      }
      if (!wine) {
        throw new Error("wine");
      }

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
          recomments: await recommentRepo.find({
            where: { comment: c.id },
          }),
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
    } catch (e) {
      if (e.message === "user") {
        res.status(404).send({ message: "user not existed" });
      } else if (e.message === "wine") {
        res.status(404).send({ message: "wine not existed" });
      }
    }
  },
  delete: async (req: Request, res: Response) => {
    try {
      let commentId: number;
      let userId: number;

      if (req.session.passport) {
        userId = req.session.passport.user;
      } else {
        throw new Error("userId");
      }

      if (req.body.commentId) {
        commentId = req.body.commentId;
      } else {
        throw new Error("commentId");
      }

      const connection = await getConnection();
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
          throw new Error("user");
        }
      } else {
        throw new Error("comment");
      }
    } catch (e) {
      if (e.message === "userId") {
        res.status(401).send({ message: "you are unauthorized." });
      } else if (e.message === "commentId") {
        res.status(404).send({ message: "commentId not existed." });
      } else if (e.message === "user") {
        res.status(401).send({ message: "you are not writer." });
      } else if (e.message === "comment") {
        res.status(404).send({ message: "comment not existed." });
      }
    }
  },
  put: async (req: Request, res: Response) => {
    try {
      const { text, commentId } = req.body;
      let userId: number;

      if (req.session!.passport!.user) {
        userId = req.session!.passport!.user;
      } else {
        throw new Error("userId");
      }

      if (!commentId) {
        throw new Error("commentId");
      }

      if (!text || text === "") {
        throw new Error("text");
      }

      const connection = await getConnection();
      const commentRepo = await connection.getRepository(Comment);
      const comment = await commentRepo.findOne({
        where: { id: commentId },
        relations: ["user"],
      });
      if (comment) {
        if (comment.user.id === userId) {
          //1=>userId
          await connection
            .createQueryBuilder()
            .update(Recomment)
            .set({ text: text })
            .where("id = :commentId", { commentId })
            .execute();

          res.status(200).send({ message: "comment successfully changed." });
        } else {
          throw new Error("unauthorized");
        }
      } else {
        throw new Error("comment");
      }
    } catch (e) {
      if (e.message === "userId") {
        res.status(404).send({ message: "userId not existed" });
      } else if (e.message === "commentId") {
        res.status(404).send({ message: "commentId not existed" });
      } else if (e.message === "text") {
        res.status(404).send({ message: "text not existed" });
      } else if (e.message === "unauthorized") {
        res.status(401).send({ message: "you are unauthorized." });
      } else if (e.message === "comment") {
        res.status(404).send({ message: "comment not existed" });
      }
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
      if (req.session!.passport!.user) {
        userId = req.session!.passport!.user;
      } else {
        throw new Error("user");
      }

      const connection = getConnection();
      const userRepo = await connection.getRepository(User);
      const commentRepo = await connection.getRepository(Comment);

      const user = await userRepo.findOne({
        where: { id: userId },
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
      if (req.session!.passport!.user) {
        userId = req.session!.passport!.user;
      } else {
        throw new Error("user");
      }

      const connection = getConnection();
      const userRepo = await connection.getRepository(User);
      const commentRepo = await connection.getRepository(Comment);

      const user = await userRepo.findOne({
        where: { id: userId },
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
  re_post: async (req: Request, res: Response) => {
    try {
      const connection = getConnection();
      const userRepo = await connection.getRepository(User);
      const commentRepo = await connection.getRepository(Comment);
      const { commentId, text } = req.body;

      let userId: number;

      if (req.session!.passport!.user) {
        userId = req.session!.passport!.user;
      } else {
        throw new Error("userId");
      }

      if (!commentId) {
        throw new Error("commentId");
      }

      if (!text || text === "") {
        throw new Error("text");
      }

      const user = await userRepo.findOne({ id: userId }); // userId=>1
      const comment = await commentRepo.findOne({ id: commentId });
      if (!user) {
        throw new Error("user");
      } else if (!comment) {
        throw new Error("comment");
      } else {
        let recomment = new Recomment();
        recomment.text = text;
        recomment.comment = comment;
        recomment.user = user;
        const newRecomment = await connection.manager.save(recomment);
        newRecomment.user.password = "";
        res.status(200).send({
          data: {
            newRecomment,
          },
          message: "ok.",
        });
        return;
      }
    } catch (e) {
      console.log(e.message);
      if (e.message === "userId") {
        res.status(404).send({ message: "userId not existed" });
        return;
      } else if (e.message === "commentId") {
        res.status(404).send({ message: "commentId not existed" });
        return;
      } else if (e.message === "text") {
        res.status(401).send({ message: "text is empty" });
        return;
      } else if (e.message === "user") {
        res.status(404).send({ message: "user not existed" });
        return;
      } else if (e.message === "comment") {
        res.status(404).send({ message: "comment not existed" });
        return;
      } else {
        res
          .status(404)
          .send({ message: "text, wineId or accessToken not existed" });
      }
    }
  },
  re_delete: async (req: Request, res: Response) => {
    try {
      let commentId: number;
      let userId: number;

      if (req.body.commentId) {
        commentId = req.body.commentId;
      } else {
        throw new Error("commentId");
      }

      if (req.session!.passport!.user) {
        userId = req.session!.passport!.user;
      } else {
        throw new Error("userId");
      }

      const connection = getConnection();
      const recomment = await connection
        .getRepository(Recomment)
        .findOne({ where: { id: commentId }, relations: ["user"] });

      if (recomment) {
        if (recomment.user.id === userId) {
          // 1=> userId
          await connection
            .createQueryBuilder()
            .delete()
            .from(Recomment)
            .where("id = :commentId", { commentId })
            .execute();

          res.status(200).send({ message: "comment successfully deleted." });
        } else {
          throw new Error("unauthorized");
        }
      } else {
        throw new Error("comment");
      }
    } catch (e) {
      if (e.message === "commentId") {
        res.status(404).send({ message: "commentId not existed." });
      } else if (e.message === "userId") {
        res.status(404).send({ message: "userId not existed." });
      } else if (e.message === "comment") {
        res.status(404).send({ message: "comment not existed." });
      } else if (e.message === "unauthorized") {
        res.status(401).send({ message: "you are unauthorized." });
      }
    }
  },
  re_put: async (req: Request, res: Response) => {
    try {
      const { text, commentId } = req.body;
      let userId: number;

      if (req.session!.passport!.user) {
        userId = req.session!.passport!.user;
      } else {
        throw new Error("userId");
      }

      if (!commentId) {
        throw new Error("commentId");
      }

      if (!text || text === "") {
        throw new Error("text");
      }

      const connection = await getConnection();
      const recommentRepo = await connection.getRepository(Recomment);
      const comment = await recommentRepo.findOne({
        where: { id: commentId },
        relations: ["user"],
      });
      if (comment) {
        if (comment.user.id === userId) {
          //1=>userId
          await connection
            .createQueryBuilder()
            .update(Recomment)
            .set({ text: text })
            .where("id = :commentId", { commentId })
            .execute();

          res.status(200).send({ message: "comment successfully changed." });
        } else {
          throw new Error("unauthorized");
        }
      } else {
        throw new Error("comment");
      }
    } catch (e) {
      if (e.message === "userId") {
        res.status(404).send({ message: "userId not existed" });
      } else if (e.message === "commentId") {
        res.status(404).send({ message: "commentId not existed" });
      } else if (e.message === "text") {
        res.status(404).send({ message: "text not existed" });
      } else if (e.message === "unauthorized") {
        res.status(401).send({ message: "you are unauthorized." });
      } else if (e.message === "comment") {
        res.status(404).send({ message: "comment not existed" });
      }
    }
  },
};
