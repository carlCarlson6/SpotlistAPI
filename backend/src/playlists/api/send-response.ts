import { Response } from "express";
import { DomainError } from "../../common/domain-error";
import { SongListDto } from "./models/songlist-dto";
import { FromDomainError } from "../../infrastructure/express/api-error";

export const sendOkResponse = (response: Response) => (songList: SongListDto): Response => response.status(200).send(songList);
export const sendKoResponse = (response: Response) => (error: DomainError): Response => response.status(error.code).send(FromDomainError(error));