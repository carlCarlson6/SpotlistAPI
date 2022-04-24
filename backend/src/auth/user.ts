import { Result } from "typescript-monads";
import { DomainError } from "../common/domain-error";
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

    static create(id: UserId, name: string, resultPassword: Result<Password, DomainError>, createdAt: Date) : Result<User, DomainError> {
        return resultPassword.map(password => new User(
            id,
            name,
            password,
            createdAt
        ));
    }

    static createNew(name: string, password: string): Result<User, DomainError> {
        const id = Id.createNew();
        const createdAt = new Date();
        const resultPassword = Password.create(password);
        
        return resultPassword.map(p => new User(
            id,
            name,
            p,
            createdAt
        ));
    }
}