import { none, some } from "typescript-monads";
import { ExpressMiddleware } from "../../../src/infrastructure/express/express-middleware";
import { authorizeMiddleware } from "../../../src/auth/api/authorize-middleware";
import { authenticate } from "../../../src/auth/authenticate";
import { GetUserByName } from "../../../src/auth/get-user";
import { Password } from "../../../src/auth/password";
import { User } from "../../../src/auth/user";
import { testUsers } from "./test-users";

const inMemoryGetUserByName: GetUserByName = (userName: string) => {
    const user = testUsers.find(user => user.name === userName);
    return !user 
        ? Promise.resolve(none())
        : User.create(user.id, user.name, Password.create(user.password), new Date())
        .match({
            ok: user => Promise.resolve(some(user)),
            fail: _ => Promise.resolve(none())
        })
}

export const inMemoryAuthorizeMiddleware: ExpressMiddleware = authorizeMiddleware(authenticate(inMemoryGetUserByName));