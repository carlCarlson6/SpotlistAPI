import { DomainError } from "./domain-error";

export class DbError extends DomainError {
    get code() { return 500; }

    constructor(message: string) {
        super(message);
        this.name = "database error"
        Object.setPrototypeOf(this, DbError.prototype);
    }
}
