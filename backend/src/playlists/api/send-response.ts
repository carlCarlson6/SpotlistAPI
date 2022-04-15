import { Response } from "express";
import { DomainError } from "../../common/domain-error";
import { FromDomainError } from "../../infrastructure/express/api-error";

export const sendOkResponse = <T>(response: Response) => (responseDto: T): Response => response.status(200).send(responseDto);
export const sendKoResponse = (response: Response) => (error: DomainError): Response => response.status(error.code).send(FromDomainError(error));

export const matchSendOkOrKoResponse = <T>(response: Response) => ({
    left: sendOkResponse<T>(response),
    right: sendKoResponse(response)
})