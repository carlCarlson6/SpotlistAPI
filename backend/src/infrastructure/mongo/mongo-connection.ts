import { MongoClient } from "mongodb";
import { MongoContext } from "./mongo-context";
import { PlaylistMongoModel, UserMongoModel } from "./mongo-models";
import { mongoSettings } from "./mongo-settings";

const mongoClient = new MongoClient(mongoSettings.ConnectionString);

export class MongoConnection {
    private static intance: MongoConnection;

    private constructor(
        private readonly mongoClient: MongoClient,
    ) {}

    static async getConnectionInstance() : Promise<MongoConnection> {
        if (MongoConnection.intance!) {
            mongoClient.connect
            await mongoClient.connect();
            MongoConnection.intance = new MongoConnection(mongoClient);
        }
        return MongoConnection.intance;
    }

    getContext(): MongoContext {
        const db = this.mongoClient.db(mongoSettings.DatabaseName);
        return {
            users: db.collection<UserMongoModel>(mongoSettings.UsersCollectionName),
            playlists: db.collection<PlaylistMongoModel>(mongoSettings.Playlists)
        };
    }
}

export const getContext = async (): Promise<MongoContext> => {
    const connection = await MongoConnection.getConnectionInstance();
    return connection.getContext();
}