import { Response } from "express";
import { Either, Result } from "typescript-monads";
import { DomainError } from "../../common/domain-error";
import { left, right } from "../../common/either-utils";
import { fromDomainError } from "../../infrastructure/express/api-error";

export const handleResultFromEndpoint = <T, U>(response: Response, result: Result<T, DomainError>, map: (t: T) => U) =>
    result.match<Either<U, DomainError>>({
        ok: t => left(map(t)),
        fail: right
    })
    .match(matchSendOkOrKoResponse(response));

const matchSendOkOrKoResponse = <T>(response: Response) => ({
    left: sendOkResponse<T>(response),
    right: sendKoResponse(response)
});

export const sendOkResponse = <T>(response: Response) => (responseDto: T): Response => response.status(200).send(responseDto);
export const sendKoResponse = (response: Response) => (error: DomainError): Response => response.status(error.code).send(fromDomainError(error));
