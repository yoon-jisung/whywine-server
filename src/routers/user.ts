const express = require("express");
import { Request, Response } from "express";
const router = express.Router();
const controller = require("../controllers/user.ts");

router.post("/update", (req: Request, res: Response) => {
  controller.update(req, res);
});

router.post("/like", (req: Request, res: Response) => {
  controller.like(req, res);
});
export = router;
