import { IRouter, Request, Response } from "express";
import { ExpressEndpoint } from "../../infrastructure/express/express-endpoint";

export class GetPlaylistEndpoint implements ExpressEndpoint {
    constructor(
        private readonly router: IRouter
    ) { }
    
    declareEndpoint(): void {
        this.router.get("/:listId", this.execute)
    }

    execute(request: Request, response: Response): Promise<Response> {
        throw new Error("Method not implemented.");
    }
}