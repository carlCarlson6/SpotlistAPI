import { IRouter, Request, Response } from "express";
import { ExpressEndpoint } from "../../infrastructure/express/express-endpoint";

export class AddSongtoPlaylistEndpoint implements ExpressEndpoint {
    constructor(
        private readonly router: IRouter
    ) { }
    
    declareEndpoint(): void {
        this.router.post("/:listId/songs", this.execute)
    }

    execute(request: Request, response: Response): Promise<Response> {
        throw new Error("Method not implemented.");
    }
}