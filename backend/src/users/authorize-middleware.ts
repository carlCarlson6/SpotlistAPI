import { NextFunction, Request, Response } from "express";
import { ExpressMiddleware } from "../infrastructure/express/express-middleware";

const authorizeMiddleware: ExpressMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

function loggerMiddleware(request: Request, response: Response, next: NextFunction) {
    console.log(`${request.method} ${request.path}`);
    next();
  }