import { IMaybe } from "typescript-monads";
import { getContext } from "../infrastructure/mongo/mongo-connection";
import { mongoGetUser } from "../infrastructure/mongo/mongo-context";
import { User, UserId } from "./user";

export type GetUser = (id: UserId) => Promise<IMaybe<User>>

export const getUser: GetUser = async (id: UserId) => mongoGetUser(getContext())(id);