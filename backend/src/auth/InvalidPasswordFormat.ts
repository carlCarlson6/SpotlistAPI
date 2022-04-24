import { DomainError } from "../common/domain-error";

export class InvalidPasswordFormat extends DomainError {
    get code(): number {
        return 401;
    }

    constructor() {
        super("the password does not accomplish the minium requirements");
        this.name = "invalid password format";
        Object.setPrototypeOf(this, InvalidPasswordFormat.prototype);
    }
}

export const invalidPasswordFormat = new InvalidPasswordFormat();