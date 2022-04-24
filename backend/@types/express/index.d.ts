import { User } from "../../src/auth/user";

declare global {
    namespace Express {
        interface Request {
            currentUser: User
        }
    }
}