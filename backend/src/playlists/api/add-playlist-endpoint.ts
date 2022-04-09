import { IRouter, Request, Response } from "express";
import { Either, Result } from "typescript-monads";
import { DomainError } from "../../common/domain-error";
import { Id } from "../../common/id";
import { promiseResultError } from "../../common/promise-result-error";
import { ExpressEndpoint } from "../../infrastructure/express/express-endpoint";
import { sendKoResponse, sendOkResponse } from "../../infrastructure/express/send-response";
import { AddListToUserCommand, addPlaylistToUser } from "../add-playlist";
import { Playlist } from "../playlist";
import { FromPlaylist, SongList, Song as SongDto, Songs as SongDtos } from "./api-models";

type AddPlaylistRequest = Request<{userId: string}, {}, {songs: SongDtos}>;

const BuildCommand = (request: AddPlaylistRequest): Result<AddListToUserCommand, DomainError> => 
    Id.create(request.params.userId).map(id => ({
        Owner: id,
        Songs: request.body.songs,
    }));

export class AddPlaylistEnpoint implements ExpressEndpoint {
    constructor(
        private readonly router: IRouter
    ) { }

    declareEndpoint(): void {
        this.router.post("/", this.excute);
    }

    async excute(request: AddPlaylistRequest, response: Response): Promise<Response> {
        const result = await BuildCommand(request).match({
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
}