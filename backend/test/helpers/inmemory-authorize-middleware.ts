import { none, some } from "typescript-monads";
import { ExpressMiddleware } from "../../src/infrastructure/express/express-middleware";
import { authorizeMiddleware } from "../../src/users/api/authorize-middleware";
import { authenticate } from "../../src/users/authenticate";
import { GetUserByName } from "../../src/users/get-user";
import { Password } from "../../src/users/password";
import { User } from "../../src/users/user";
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