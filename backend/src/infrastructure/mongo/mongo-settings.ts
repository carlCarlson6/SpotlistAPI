import { config as readEnvConfig } from "dotenv";

class MongoSettings {
    constructor(
        readonly ConnectionString: string,
        readonly DatabaseName: string,
        readonly UsersCollectionName: string,
        readonly Playlists: string
    ) {}
}

readEnvConfig();

export const mongoSettings = new MongoSettings(
    process.env.MONGO_CONNECTION_STRING!,
    process.env.MONGO_SPOTLIST_DB_NAME!,
    process.env.MONGO_USERS_COLLECTION_NAME!,
    process.env.MONGO_PLAYLISTS_COLLECTION_NAME!
);