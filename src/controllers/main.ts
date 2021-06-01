import { Request, Response } from "express";
import { getConnection, Like } from "typeorm";
import { Tag } from "../entity/tag";
import { User } from "../entity/user";
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
    while (random3.length <= 3) {
      if (sorted[key].length <= 3) {
        random3 = [...sorted[key]];
        break;
      }
      let result = sorted[key][Math.floor(Math.random() * sorted[key].length)]; // 랜덤으로 하나 꺼냄
      let flag = false;
      for (let r of random3) {
        if (r.id === result.id) {
          flag = true;
        }
      }
      if (flag === false) {
        random3.push(result);
      }
      if (random3.length === 3) {
        break;
      }
    }
    if (random3.length === 3) {
      break;
    }
  }
  return random3;
};
export = {
  tags: async (req: Request, res: Response) => {
    const connection = getConnection();
    const tags: string[] = req.body.tags;
    let sort: string[] = [];
    if (req.body.sort) {
      sort = req.body.sort;
    }

    const wineRepo = await connection.getRepository(Wine);

    let wines: Wine[] = [];

    if (tags.length === 0 && sort.length === 0) {
      res.status(204).send();
      return;
    } else if (tags.length !== 0 && sort.length === 0) {
      wines = await wineRepo
        .createQueryBuilder("wine")
        .innerJoinAndSelect("wine.tags", "tag")
        .where("tag.name IN (:...name)", { name: tags })
        .getMany();
    } else if (tags.length === 0 && sort.length !== 0) {
      wines = await wineRepo
        .createQueryBuilder("wine")
        .innerJoinAndSelect("wine.tags", "tag")
        .where("sort IN (:...sort)", { sort })
        .getMany();
    } else {
      wines = await wineRepo
        .createQueryBuilder("wine")
        .innerJoinAndSelect("wine.tags", "tag")
        .where("tag.name IN (:...name)", { name: tags })
        .andWhere("sort IN (:...sort)", { sort })
        .getMany();
    }

    const sorted: sortedWine = {};
    for (let wine of wines) {
      let tagLen = wine.tags.length;
      if (sorted[tagLen] === undefined) {
        sorted[tagLen] = [];
      }
      let result = await wineRepo.findOne({
        where: { id: wine.id },
        relations: ["tags"],
      });
      if (result) {
        sorted[tagLen].push(result);
      }
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
