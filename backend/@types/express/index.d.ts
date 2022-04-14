import { User } from "../../src/users/user";

declare global {
    namespace Express {
        interface Request {
            currentUser: User
        }
    }
}