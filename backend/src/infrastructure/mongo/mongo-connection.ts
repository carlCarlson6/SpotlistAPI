import { MongoClient } from "mongodb";
import { mongoSettings } from "./mongo-settings";

const mongoClient = new MongoClient(mongoSettings.ConnectionString);

class MongoConnection {
    private static intance: MongoConnection;

    private constructor(
        private readonly mongoClient: MongoClient,
    ) {}

    static async getConnectionInstance() : Promise<MongoConnection> {
        if (MongoConnection.intance!) {
            await mongoClient.connect();
            MongoConnection.intance = new MongoConnection(mongoClient);
        }
        return MongoConnection.intance;
    }
}
