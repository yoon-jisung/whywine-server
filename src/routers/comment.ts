import { Router, Request, Response, NextFunction } from "express";
import upload from "../utils/upload";
import controller from "../controllers/comment";

const router = Router();

router.post("/recomment", (req: Request, res: Response) => {
  controller.re_post(req, res);
});

router.delete("/recomment", (req: Request, res: Response) => {
  controller.re_delete(req, res);
});

router.put("/recomment", (req: Request, res: Response) => {
  controller.re_put(req, res);
});

router.post("/good", (req: Request, res: Response) => {
  controller.good(req, res);
});

router.post("/bad", (req: Request, res: Response) => {
  controller.bad(req, res);
});
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
