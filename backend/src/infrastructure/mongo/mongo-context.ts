import { Collection } from "mongodb";
import { none, some } from "typescript-monads";
import { User } from "../../auth/user";
import { MongoConnection } from "./mongo-connection";
import { dbModelToUser, PlaylistMongoModel, UserMongoModel } from "./mongo-models";

export interface MongoContext {
    users: Collection<UserMongoModel>
    playlists: Collection<PlaylistMongoModel>
}

export const getContext = async (): Promise<MongoContext> => {
    const connection = await MongoConnection.getConnectionInstance();
    return connection.getContext();
}

export const findOneUser = async (finder: {}) => {
    const context = await getContext();
    const mongoUser = await context.users.findOne({ ...finder })
    return !mongoUser? none<User>() : some<User>(dbModelToUser(mongoUser));
}
