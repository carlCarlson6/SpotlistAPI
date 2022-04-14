import { IRouter, Request, Response } from "express";
import { Either, ok, fail, Result } from "typescript-monads";
import { DomainError } from "../../common/domain-error";
import { left, right } from "../../common/either-utils";
import { Id } from "../../common/id";
import { promiseResultError } from "../../common/promise-result-error";
import { ExpressEndpoint } from "../../infrastructure/express/express-endpoint";
import { sendKoResponse, sendOkResponse } from "../../infrastructure/express/send-response";
import { AddListToUserCommand, AddPlaylistToUser, addPlaylistToUser } from "../add-playlist";
import { Playlist } from "../playlist";
import { FromPlaylist, SongList, Songs as SongDtos } from "./api-models";
import { UnauthorizedOperation } from "../../common/unauthorized-operation";
import { mongoStoreNewPlaylist } from "../store-playlist";

export class AddPlaylistEnpoint implements ExpressEndpoint {
    constructor(
        private readonly router: IRouter
    ) { }

    declareEndpoint(): void {
        this.router.post(
            "/", 
            addPlaylistEnpoint(addPlaylistToUser(mongoStoreNewPlaylist)));
    }
}

type AddPlaylistRequest = Request<{userId: string}, {}, {songs: SongDtos}>;
type Endpoint = (request: AddPlaylistRequest, response: Response) => Promise<Response>;

const addPlaylistEnpoint = (addPlaylistToUser: AddPlaylistToUser): Endpoint => (request: AddPlaylistRequest, response: Response) => 
    buildCommand(request)
        .flatMap(isCurrentUserOwner(request))
        .match({
            ok: addPlaylistToUser,
            fail: error => promiseResultError<Playlist>(error)
        })
        .then(result => handleResultForEndpoint(response, result));

const buildCommand = (request: AddPlaylistRequest): Result<AddListToUserCommand, DomainError> => 
    Id.create(request.params.userId).map(id => ({
        Owner: id,
        Songs: request.body.songs,
    }));

const isCurrentUserOwner = (request: AddPlaylistRequest): ((command: AddListToUserCommand) => Result<AddListToUserCommand, DomainError>) =>
    command => command.Owner === request.currentUser.id ? ok(command) : fail(new UnauthorizedOperation())

const handleResultForEndpoint = (response: Response, result: Result<Playlist, DomainError>) =>
    result.match<Either<SongList, DomainError>>({
        ok: playlist => left(FromPlaylist(playlist)),
        fail: right
    })
    .match({
        left: sendOkResponse(response),
        right: sendKoResponse(response)});



