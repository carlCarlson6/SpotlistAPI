import { ok, Result } from "typescript-monads";
import { Playlist } from "./playlist";
import { DomainError } from "../common/domain-error";
import { getContext } from "../infrastructure/mongo/mongo-connection";
import { PlaylistToDbModel } from "../infrastructure/mongo/mongo-models";
import { DbError } from "../common/db-error";

export type StorePlaylist = (plalist: Playlist) => Promise<Result<Playlist, DomainError>>;

export const mongoStoreNewPlaylist: StorePlaylist = async (playlist: Playlist): Promise<Result<Playlist, DomainError>> => {
    const constext = await getContext();
    const insertOneResult = await constext.playlists.insertOne(PlaylistToDbModel(playlist))
    
    return insertOneResult.acknowledged
        ? ok(playlist)
        : fail(new DbError("error while adding playlist"));
}

export const mongoUpdatePlaylist: StorePlaylist = async (playlist: Playlist): Promise<Result<Playlist, DomainError>> => {
    throw new Error("TODO - not implemented");
}