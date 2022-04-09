import { NextFunction, Request, Response } from "express";

export type ExpressMiddleware = (request: Request, response: Response, next: NextFunction) => void;
export type ExpressMiddlewares = ExpressMiddleware[];