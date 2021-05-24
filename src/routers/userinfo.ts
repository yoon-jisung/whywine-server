import { Router, Request, Response, NextFunction } from 'express';
const express = require("express");
const router = express.Router();
const { userinfo, nickname, password, leave } = require('../controllers/userinfo')

router.get("/",userinfo);
router.post("/",nickname);
router.post("/",password);
router.get("/",leave);


export default router;