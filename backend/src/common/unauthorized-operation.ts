import { DomainError } from "./domain-error";

export class UnauthorizedOperation extends DomainError {
    get code(){ return 401; }

    constructor() {
        super();
        this.name = "unauthorized operation"
        Object.setPrototypeOf(this, UnauthorizedOperation.prototype);
    }
}
