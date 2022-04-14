import { ok, Result } from "typescript-monads"
import { DomainError } from "../common/domain-error"
import { GetUserByName } from "./get-user"
import { validatePassword } from "./password"
import { User } from "./user"

export interface AuthorizeInput {
    UserId: string
    UserName: string
    Password: string
}

class UserNotFound extends DomainError {
    get code(): number {
        throw new Error("Method not implemented.")
    }
}

class Unauthorized extends DomainError {
    get code(): number {
        throw new Error("Method not implemented.")
    }
}

export type Authenticate = (input: AuthorizeInput) => Promise<Result<User, DomainError>>

const validateUserCredentials = (user: User, input: AuthorizeInput): boolean => 
    user.name === input.UserName && validatePassword(user.password, input.Password);

export const authenticate: (getUser: GetUserByName) => Authenticate = (getUser: GetUserByName) => (input: AuthorizeInput) => 
    getUser(input.UserName).then(maybeUser => maybeUser.match({
        some: (user: User) => validateUserCredentials(user, input) ? ok(user) : fail(new Unauthorized()),
        none: () => fail(new UserNotFound())
    }))
