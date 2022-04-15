import { Response } from "express";
import { Either, Result } from "typescript-monads";
import { DomainError } from "../../common/domain-error";
import { left, right } from "../../common/either-utils";
import { sendKoResponse, sendOkResponse } from "./send-response";
import { Playlist } from "../playlist";
import { FromPlaylist, SongListDto } from "./models/songlist-dto";

export const handleResultFromEndpoint = (response: Response, result: Result<Playlist, DomainError>) =>
    result.match<Either<SongListDto, DomainError>>({
        ok: playlist => left(FromPlaylist(playlist)),
        fail: right
    })
    .match({
        left: sendOkResponse(response),
        right: sendKoResponse(response)});
