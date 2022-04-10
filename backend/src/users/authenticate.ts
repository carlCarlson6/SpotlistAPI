import { IMaybe } from "typescript-monads"
import { Id } from "../common/id"
import { getUser } from "./get-user"
import { Password, validatePassword } from "./password"
import { User } from "./user"

export interface AuthorizeInput {
    UserId: string
    UserName: string
    Password: string
}

export type Authenticate = (input: AuthorizeInput) => Promise<boolean>

const validateUserCredentials = (user: User, input: AuthorizeInput): boolean => {
    if (user.name !== input.UserName)
        return false;

    return Password.create(input.Password).match({
        ok: inputPassword => validatePassword(inputPassword, user.password),
        fail: _ => false
    });
}

const authenticateUser = async (promiseMaybeUser: Promise<IMaybe<User>>, input: AuthorizeInput): Promise<boolean> => {
    const maybeUser = await promiseMaybeUser;
    return maybeUser.match({
        some: (user: User) => validateUserCredentials(user, input),
        none: () => false
    });
}

export const authenticate: Authenticate = (input: AuthorizeInput) => 
    Id.create(input.UserId)
        .match({
            ok: id => authenticateUser(getUser(id), input),
            fail: _ => Promise.resolve(false),
        });