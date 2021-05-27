import { Router, Request, Response, NextFunction } from "express";
import upload from "../utils/upload";
import controller from "../controllers/comment";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  controller.post(req, res);
});

router.get("/", (req: Request, res: Response) => {
  controller.get(req, res);
});

router.delete("/", (req: Request, res: Response) => {
  controller.delete(req, res);
});

router.put("/", (req: Request, res: Response) => {
  controller.put(req, res);
});

export default router;
