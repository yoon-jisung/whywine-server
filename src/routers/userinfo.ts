import { Router, Request, Response, NextFunction } from "express";
const express = require("express");
const router = express.Router();
const {
  userinfo,
  nickname,
  password,
  leave,
} = require("../controllers/userinfo");
import upload from "../utils/upload";

router.get("/", userinfo);
router.post("/nickname", nickname);
router.post("/password", password);
router.get("/leave", leave);
router.get("/upload", upload.single("img"));

export default router;
