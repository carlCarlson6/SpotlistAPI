import { IRouter, Request, Response } from "express";
import { fail, ok, Result } from "typescript-monads";
import { DomainError } from "../../../common/domain-error";
import { Id } from "../../../common/id";
import { promiseResultError } from "../../../common/promise-result-error";
import { UnauthorizedOperation } from "../../../common/unauthorized-operation";
import { ExpressEndpointDeclaration } from "../../../infrastructure/express/express-endpoint";
import { Owner, Playlists } from "../../playlist";
import { GetUserPlaylists } from "../../get-playlist";
import { handleResultFromEndpoint } from "../handle-result-from-endpoint";
import { fromPlaylist } from "../models/songlist-dto";

export const declareGetPlaylistsEndpoint = (get: GetUserPlaylists): ExpressEndpointDeclaration =>
    (router: IRouter) => {
        router.get(
            "/:userId/lists",
            getPlaylistsEndpoint(get)  
        );
        return router;
    }

type GetPlaylistsRequest = Request<{userId: string}, {}, {}>;
type Endpoint = (request: GetPlaylistsRequest, response: Response) => void;

export const getPlaylistsEndpoint = (get: GetUserPlaylists) => async (request: GetPlaylistsRequest, response: Response) => 
    buildQuery(request)
        .flatMap(isCurrentUserOwner(request))
        .match({
            ok: ownerId => get(ownerId).then(playlists => ok<Playlists, DomainError>(playlists)),
            fail: error => promiseResultError<Playlists>(error)
        })
        .then(result => handleResultFromEndpoint(response, result, (playlists: Playlists) => playlists.map(fromPlaylist)));

const buildQuery = (request: GetPlaylistsRequest): Result<Owner, DomainError> => 
        Id.parse(request.params.userId);

const isCurrentUserOwner = (request: GetPlaylistsRequest): ((owner: Owner) => Result<Owner, DomainError>) => (owner: Owner) => 
        owner.toString() === request.currentUser.id.toString()
            ? ok(owner)
            : fail(new UnauthorizedOperation());
