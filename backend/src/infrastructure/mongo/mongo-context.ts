import { Collection } from "mongodb";
import { User } from "../../users/user";

export interface MongoContext {
    users: Collection<User> // TODO create new model
}