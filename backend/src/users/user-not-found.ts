import { DomainError } from "../common/domain-error";

export class UserNotFound extends DomainError {
    get code(): number {
        return 404;
    }

    constructor() {
        super();
        this.name = "user not found"
        Object.setPrototypeOf(this, UserNotFound.prototype);
    }
}
