import { Request, Response } from "express";
import { getConnection, Like } from "typeorm";
import { Tag } from "../entity/tag";
import { Wine } from "../entity/wine";

interface sortedWine {
  [index: number]: Wine[];
  random3?: Wine[];
}

const getRandomThree = (sorted: sortedWine): Wine[] => {
  let random3: Wine[] = [];
  const sortedKeys: number[] = Object.keys(sorted)
    .map((el) => Number(el))
    .sort((a, b) => b - a);

  for (let key of sortedKeys) {
    let len = sorted[key].length;
    while (len !== 0 && random3.length < 3) {
      let idx = Math.floor(Math.random() * len);
      random3 = [...random3, sorted[key][idx]];
      len--;
    }
  }
  return random3;
};
export = {
  tags: async (req: Request, res: Response) => {
    const connection = getConnection();
    const tags: string[] = req.body.tags;
    const sort: string[] = req.body.sort;

    const wineRepo = await connection.getRepository(Wine);
    const tagRepo = await connection.getRepository(Tag);

    if (tags.length === 0) {
      res.status(204).send("tag not existed");
      return;
    }
    for (let tag of tags) {
      let result = await tagRepo.find({ name: tag });
      if (result.length === 0) {
        res.status(204).send({ message: "tag not existed" });
        return;
      }
    }

    const wines: Wine[] = await wineRepo
      .createQueryBuilder("wine")
      .innerJoinAndSelect("wine.tags", "tag")
      .where("tag.name IN (:...name)", { name: tags })
      .andWhere("sort IN (:...sort)", { sort })
      .getMany();

    const sorted: sortedWine = {};
    for (let wine of wines) {
      if (sorted[wine.tags.length] === undefined) {
        sorted[wine.tags.length] = [];
      }
      sorted[wine.tags.length].push(wine);
    }

    sorted["random3"] = getRandomThree(sorted);
    res.status(200).send({
      message: "ok.",
      data: {
        wines: {
          sorted,
        },
      },
    });
    return;
  },
  search: async (req: Request, res: Response) => {
    const word = req.query.word;
    const connection = getConnection();

    const wineRepo = await connection.getRepository(Wine);

    let searchResult: Wine[] = await wineRepo
      .createQueryBuilder("wine")
      .innerJoinAndSelect("wine.tags", "tag")
      .where("tag.name like :word", { word: `%${word}%` })
      .orWhere("wine.name like :word", { word: `%${word}%` })
      .orWhere("wine.sort like :word", { word: `%${word}%` })
      .orWhere("wine.description like :word", { word: `%${word}%` })
      .getMany();

    if (searchResult.length === 0 || !searchResult) {
      res.status(204).send({ message: "search not existed" });
    } else {
      res.status(200).send({
        message: "ok.",
        data: {
          wines: searchResult,
        },
      });
    }
  },
};
