import { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import dotenv from 'dotenv';
import passport from 'passport';
import google from 'passport-google-oauth';
import axios, { AxiosResponse } from "axios";
//import { user } from '../../models/user';
dotenv.config();

const googlesignin = async (req: Request, res: Response, next: NextFunction) => {

}

export default googlesignin;