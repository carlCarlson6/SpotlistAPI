import { Result } from "typescript-monads";
import { DomainError } from "../common/domain-error";

export class Password {
    private constructor(
        private readonly value: string
    ) {}

    toString(): string {
        return this.value;
    }

    static create(input: string): Result<Password, InvalidPasswordFormat> {
        throw new Error("TODO - not implemented");
    }
}

export type ValidatePassword = (passwordA: Password, passwordB: Password) => boolean;

export const validatePassword: ValidatePassword = (passwordA: Password, passwordB: Password) => {
    throw new Error("not implemented");
}

class InvalidPasswordFormat extends DomainError {
    get code(): number {
        return 401;
    }

    constructor() {
        super("the password does not accomplish the minium requirements");
        this.name = "invalid password format"
        Object.setPrototypeOf(this, InvalidPasswordFormat.prototype);
    }
}