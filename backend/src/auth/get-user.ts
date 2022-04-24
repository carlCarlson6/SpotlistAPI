import { IMaybe } from "typescript-monads";
import { findOneUser } from "../infrastructure/mongo/mongo-context";
import { User, UserId } from "./user";

export type GetUserById = (id: UserId) => Promise<IMaybe<User>>
export type GetUserByName = (userName: string) => Promise<IMaybe<User>>

export const mongoGetUserById: GetUserById = (userId: UserId) => findOneUser({ id: userId.toString() });
export const mongoGetUserByName: GetUserByName = (name: string) => findOneUser({ name });
