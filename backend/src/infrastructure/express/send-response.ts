import { Response } from "express";
import { DomainError } from "../../common/domain-error";
import { SongList } from "../../playlists/api/api-models";
import { FromDomainError } from "./api-error";

export const sendOkResponse = (response: Response) => (songList: SongList): Response => response.status(200).send(songList);
export const sendKoResponse = (response: Response) => (error: DomainError): Response => response.status(error.code).send(FromDomainError(error));