import { DomainError } from "./domain-error";

export class UnauthorizedOperation extends DomainError {
    get code(){ return 401; }

    constructor(message: string) {
        super(message);
        this.name = "unauthorized operation"
        Object.setPrototypeOf(this, UnauthorizedOperation.prototype);
    }
}
