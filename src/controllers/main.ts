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
    const tags: string[] = req.body.tags;
    const connection = getConnection();
    const wineRepo = await connection.getRepository(Wine);

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

    console.log(JSON.stringify(sorted, null, 4));

    res.status(200).send({
      message: "ok.",
    });
  },
  search: async (req: Request, res: Response) => {},
};
