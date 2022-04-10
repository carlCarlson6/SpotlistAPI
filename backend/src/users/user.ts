import { Id } from "../common/id";
import { Password } from "./password";

export type UserId = Id;

export class User {
    private constructor(
        readonly id: UserId,
        readonly name: string,
        readonly password: Password,
        readonly createdAt: Date
    ) {}
}