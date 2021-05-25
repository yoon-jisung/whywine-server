import { Request, Response } from "express";
import { getConnection } from "typeorm";
import ormconfig, { name } from "../../ormconfig";
import { Tag } from "../entity/tag";
import { Wine } from "../entity/wine";

export = {
  tags: async (req: Request, res: Response) => {
    interface sortedWine {
      [index: number]: object[];
    }
    const connection = getConnection();
    const tags: string[] = req.body.tags;

    const wineRepo = await connection.getRepository(Wine);
    const tagRepo = await connection.getRepository(Tag);

    for (let tag of tags) {
      console.log(tag);
      let result = await tagRepo.find({ name: tag });
      console.log(result);
      if (result.length === 0) {
        res.status(204).send({ message: "tag not existed" });
        return;
      }
    }

    const wines: Wine[] = await wineRepo
      .createQueryBuilder("wine")
      .innerJoinAndSelect("wine.tags", "tag")
      .where("tag.name IN (:...name)", { name: tags })
      .getMany();

    const sorted: sortedWine = {};
    for (let wine of wines) {
      if (sorted[wine.tags.length] === undefined) {
        sorted[wine.tags.length] = [];
      }
      sorted[wine.tags.length].push(wine);
    }

    res.status(200).send({
      message: "ok.",
      data: {
        wines: {
          sorted,
        },
      },
    });
  },
  search: async (req: Request, res: Response) => {},
};
