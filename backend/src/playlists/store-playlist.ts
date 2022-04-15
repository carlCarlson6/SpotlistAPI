import { fail, ok, Result } from "typescript-monads";
import { Playlist } from "./playlist";
import { DomainError } from "../common/domain-error";
import { getContext } from "../infrastructure/mongo/mongo-connection";
import { playlistToDbModel } from "../infrastructure/mongo/mongo-models";
import { DbError } from "../common/db-error";

export type StorePlaylist = (plalist: Playlist) => Promise<Result<Playlist, DomainError>>;

export const mongoStoreNewPlaylist: StorePlaylist = (playlist: Playlist): Promise<Result<Playlist, DomainError>> =>
    getContext()
        .then(context => 
            context.playlists.insertOne(playlistToDbModel(playlist)))
        .then(insertOneResult => 
            insertOneResult.acknowledged
                ? ok(playlist)
                : fail(new DbError("error while adding playlist")));

export const mongoUpdatePlaylist: StorePlaylist = async (playlist: Playlist): Promise<Result<Playlist, DomainError>> => 
    getContext()
        .then(context => 
            context.playlists.updateOne({ id: playlist.id.toString() }, { $set: playlistToDbModel(playlist) }))
        .then(updateResult => 
            !updateResult.acknowledged && updateResult.matchedCount !== 1 && updateResult.modifiedCount !== 1 && updateResult.upsertedCount !== 1
                ? fail(new DbError("erro whhile updated playlist"))
                : ok(playlist));
