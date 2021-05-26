import { getConnection } from "typeorm";
import ormconfig from "../../ormconfig";
import { Wine } from "../entity/wine";
import wineData from "../../wineData/wineData.json";
import { Tag } from "../entity/tag";
import { Request, Response } from "express";
require("dotenv").config();

export = {
  sync: async (req: Request, res: Response) => {
    const connection = await getConnection();
    let wineRepo = await connection.getRepository(Wine);
    let tagRepo = await connection.getRepository(Tag);

    let { taste, wines } = Object(wineData);
    let winesSort = ["red", "white", "rose", "sparkling"];
    let tasteSort = ["body", "tannins", "acidity", "sweetness", "sparkling"];

    for (let sort of tasteSort) {
      // 태그 저장
      for (let tag of taste[sort]) {
        if (!(await tagRepo.findOne({ name: `${sort}_${tag}` }))) {
          let newTag = new Tag();
          newTag.name = `${sort}_${tag}`;
          await connection.manager.save(newTag);
        }
      }
    }
    const allTags = await tagRepo.find();
    for (let sortname of winesSort) {
      for (let wine of wines[sortname]) {
        if (!(await wineRepo.findOne({ name: wine.name, price: wine.price }))) {
          let newWine = new Wine();
          newWine.name = wine.name;
          newWine.likeCount = 0;
          newWine.description = wine.description;
          newWine.image = wine.image;
          newWine.price = wine.price;
          newWine.sort = sortname;
          let spk;

          let body = (await tagRepo.findOne({
            name: `body_${wine.taste.body}`,
          })) as Tag;
          let tannins = (await tagRepo.findOne({
            name: `tannins_${wine.taste.tannins}`,
          })) as Tag;
          let sweetness = (await tagRepo.findOne({
            name: `sweetness_${wine.taste.sweetness}`,
          })) as Tag;
          let acidity = (await tagRepo.findOne({
            name: `acidity_${wine.taste.acidity}`,
          })) as Tag;

          if (sortname === "sparkling") {
            spk = (await tagRepo.findOne({
              name: `sparkling_${wine.taste.sparkling}`,
            })) as Tag;
            newWine.tags = [spk, body, tannins, sweetness, acidity];
          } else {
            newWine.tags = [body, tannins, sweetness, acidity];
          }
          await connection.manager.save(newWine);
        }
      }
    }
    res.status(200).send({
      message: "ok.",
      data: {
        wine: await wineRepo.find(),
        tag: await tagRepo.find(),
      },
    });
  },
};
