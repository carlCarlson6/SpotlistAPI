import { IRouter, Request, Response } from "express";
import { ExpressEndpoint } from "../../infrastructure/express/express-endpoint";

export class GetPlaylistsEndpoint implements ExpressEndpoint {
    constructor(
        private readonly router: IRouter
    ) { }
    
    declareEndpoint(): void {
        this.router.get("/", this.execute)
    }

    execute(request: Request, response: Response): Promise<Response> {
        throw new Error("Method not implemented.");
    }
}