import { DomainError } from "./domain-error";

export class DbError extends DomainError {
    get code(): number {
        return 500;
    }

    constructor(message: string) {
        super(message);
        this.name = "database error"
        Object.setPrototypeOf(this, DbError.prototype);
    }
}