import { Collection } from "mongodb";
import { IMaybe, Maybe, Result } from "typescript-monads";
import { DbError } from "../../common/db-error";
import { DomainError } from "../../common/domain-error";
import { StorePlaylist } from "../../playlists/add-playlist";
import { Playlist } from "../../playlists/playlist";
import { GetUser } from "../../users/get-user";
import { User, UserId } from "../../users/user";
import { DbModelToUser, PlaylistMongoModel, PlaylistToDbModel, UserMongoModel } from "./mongo-models";

export interface MongoContext {
    users: Collection<UserMongoModel>
    playlists: Collection<PlaylistMongoModel>
}

export const mongoStorePlaylist = (contextPromise: Promise<MongoContext>): StorePlaylist => async (playlist: Playlist): Promise<Result<Playlist, DomainError>> => {
    const constext = await contextPromise;
    const insertOneResult = await constext.playlists.insertOne(PlaylistToDbModel(playlist))
    
    return insertOneResult.acknowledged
        ? Result.ok(playlist)
        : Result.fail(new DbError("error while adding playlist"));
} 

export const mongoGetUser = (contextPromise: Promise<MongoContext>): GetUser => async (userId: UserId): Promise<IMaybe<User>> => {
    const context = await contextPromise;
    const mongoUser = await context.users.findOne({ id: userId.toString() })
    return !mongoUser? Maybe.none() : Maybe.some(DbModelToUser(mongoUser));
}
