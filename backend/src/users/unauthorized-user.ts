import { DomainError } from "../common/domain-error";

export class UnauthorizedUser extends DomainError {
    get code() { return 401; }

    constructor() {
        super();
        this.name = "unauthorized user"
        Object.setPrototypeOf(this, UnauthorizedUser.prototype);
    }
}
