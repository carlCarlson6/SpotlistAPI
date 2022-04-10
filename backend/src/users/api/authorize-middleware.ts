import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../infrastructure/express/api-error";
import { ExpressMiddleware } from "../../infrastructure/express/express-middleware";
import { authenticate } from "../authenticate";

export const authorizeMiddleware: ExpressMiddleware = async (request: Request, response: Response, next: NextFunction) => {
	const b64auth = (request.headers.authorization || '').split(' ')[1] || '';
  	const [userName, password] = Buffer.from(b64auth, 'base64').toString().split(':');

	const isAuhenticated = await authenticate({ UserId: request.params.userId, UserName: userName, Password: password });
	if (!isAuhenticated) {
		const error: ApiError = { message: "unauthorized" };
		response.status(401).send(error);
	} else {
		next();
	}

	return Promise.resolve();
}
