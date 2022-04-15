import { IRouter, Request, Response } from "express";
import { ExpressEndpoint } from "../../../infrastructure/express/express-endpoint";

export class GetPlaylistEndpoint implements ExpressEndpoint {
    constructor(
        private readonly router: IRouter
    ) { }
    
    declareEndpoint(): void {
        this.router.get(
            "/:listId",
            (request: Request, response: Response) => Promise.resolve(response));
    }
}