import { Express } from "express";

export type ExpressRouter = (expressApp: Express) => Express;
export type ExpressRouters = ExpressRouter[];