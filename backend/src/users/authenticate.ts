import { fail, ok, Result } from "typescript-monads"
import { DomainError } from "../common/domain-error"
import { GetUserByName } from "./get-user"
import { validatePassword } from "./password"
import { UnauthorizedUser } from "./unauthorized-user"
import { User } from "./user"
import { UserNotFound } from "./user-not-found"

export interface AuthorizeInput {
    UserId: string
    UserName: string
    Password: string
}

export type Authenticate = (input: AuthorizeInput) => Promise<Result<User, DomainError>>

const validateUserCredentials = (user: User, input: AuthorizeInput): boolean => 
    user.name === input.UserName && validatePassword(user.password, input.Password);

export const authenticate: (getUser: GetUserByName) => Authenticate = (getUser: GetUserByName) => (input: AuthorizeInput) => 
    getUser(input.UserName).then(maybeUser => maybeUser.match({
        some: (user: User) => validateUserCredentials(user, input) ? ok(user) : fail(new UnauthorizedUser()),
        none: () => fail(new UserNotFound())
    }))
