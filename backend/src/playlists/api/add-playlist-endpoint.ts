import { IRouter, Request, Response } from "express";
import { Either, Result } from "typescript-monads";
import { DomainError } from "../../common/domain-error";
import { promiseResultError } from "../../common/promise-result-error";
import { ExpressEndpoint } from "../../infrastructure/express/express-endpoint";
import { sendKoResponse, sendOkResponse } from "../../infrastructure/express/send-response";
import { AddListToUserCommand, addPlaylistToUser } from "../add-playlist";
import { Playlist } from "../playlist";
import { FromPlaylist, SongList, Song as SongDto } from "./api-models";

export class AddPlaylistEnpoint implements ExpressEndpoint {
    private readonly path = "/"; 

    constructor(
        private readonly router: IRouter
    ) {}

    declareEndpoint(): void {
        this.router.post(this.path, this.excute);
    }

    async excute(request: Request, response: Response): Promise<Response> {
        const result = await this.buildCommand(request).match({
            ok: addPlaylistToUser,
            fail: error => promiseResultError<Playlist>(error)
        });
        
        return result.match<Either<SongList, DomainError>>({
            ok: playlist => new Either<SongList, DomainError>(FromPlaylist(playlist)),
            fail: error => new Either<SongList, DomainError>(undefined, error)
        }).match({
            left: sendOkResponse(response),
            right: sendKoResponse(response)
        });
    }
    private buildCommand(request: Request): Result<AddListToUserCommand, DomainError> {
        const songs = request.body.songs as SongDto

        throw new Error("TODO - not implemented");
    }
}