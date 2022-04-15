import { Response } from "express";
import { Either, Result } from "typescript-monads";
import { DomainError } from "../../common/domain-error";
import { left, right } from "../../common/either-utils";
import { matchSendOkOrKoResponse } from "./send-response";

export const handleResultFromEndpoint = <T, U>(response: Response, result: Result<T, DomainError>, map: (t: T) => U) =>
    result.match<Either<U, DomainError>>({
        ok: t => left(map(t)),
        fail: right
    })
    .match(matchSendOkOrKoResponse(response));