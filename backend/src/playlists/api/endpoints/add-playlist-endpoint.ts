import { IRouter, Request, Response } from "express";
import { ok, Result } from "typescript-monads";
import { DomainError } from "../../../common/domain-error";
import { Id } from "../../../common/id";
import { promiseResultError } from "../../../common/promise-result-error";
import { UnauthorizedOperation } from "../../../common/unauthorized-operation";
import { ExpressEndpointDeclaration } from "../../../infrastructure/express/express-endpoint";
import { AddListToUserCommand, AddPlaylistToUser } from "../../add-playlist";
import { Playlist } from "../../playlist";
import { handleResultFromEndpoint } from "./handle-result-from-endpoint";
import { SongsDtos } from "../models/song-dto";
import { fromPlaylist } from "../models/songlist-dto";

export const declareAddPlaylistEndpoint = (addPlaylistToUser: AddPlaylistToUser): ExpressEndpointDeclaration =>
    (router: IRouter) => router.post(
        "/:userId/lists", 
        addPlaylistEnpoint(addPlaylistToUser)
    );

type AddPlaylistRequest = Request<{userId: string}, {}, {songs: SongsDtos}>;
type Endpoint = (request: AddPlaylistRequest, response: Response) => Promise<Response>;

const addPlaylistEnpoint = (addPlaylistToUser: AddPlaylistToUser): Endpoint => (request: AddPlaylistRequest, response: Response) => 
    buildCommand(request)
        .flatMap(isCurrentUserOwner(request))
        .match({
            ok: addPlaylistToUser,
            fail: error => promiseResultError<Playlist>(error)
        })
        .then(result => 
            handleResultFromEndpoint(
                response, 
                result, 
                fromPlaylist
            )
        );

const buildCommand = (request: AddPlaylistRequest): Result<AddListToUserCommand, DomainError> => 
    Id.parse(request.params.userId).map(id => ({
        Owner: id,
        Songs: request.body.songs,
    }));

const isCurrentUserOwner = (request: AddPlaylistRequest): ((command: AddListToUserCommand) => Result<AddListToUserCommand, DomainError>) =>
    command => command.Owner === request.currentUser.id ? ok(command) : fail(new UnauthorizedOperation())
