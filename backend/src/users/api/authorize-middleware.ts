import { NextFunction, Request, Response } from "express";
import { ExpressMiddleware } from "../../infrastructure/express/express-middleware";
import { sendKoResponse } from "../../playlists/api/handle-result-from-endpoint";
import { Authenticate } from "../authenticate";

const getBasicAuthorizationHeaders = (request: Request): [string, string] =>  {
	const [userName, password] = Buffer.from((request.headers.authorization || '').split(' ')[1] || '', 'base64').toString().split(':');
	return [userName, password];
}

export const authorizeMiddleware: (authenticate: Authenticate) => ExpressMiddleware = (authenticate: Authenticate) => async (request: Request, response: Response, next: NextFunction) => {
  	const [userName, password] = getBasicAuthorizationHeaders(request);

	const userAuthenticatedResult = await authenticate({ UserId: request.params.userId, UserName: userName, Password: password });
	userAuthenticatedResult.match({
		ok: user => () => {
			request.currentUser = user;
			next();
		},
		fail: error => () => sendKoResponse(response)(error)
	})();
	
	return Promise.resolve();
}
