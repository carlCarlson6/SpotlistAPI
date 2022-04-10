import { compare, compareSync, hash, hashSync } from "bcryptjs";
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
        throw new Error("TODO - not implemented- validations");
        return Result.ok(new Password(hashSync(input, 10)));
    }
}

export type ValidatePassword = (storedPassword: Password, inputPassword: string) => boolean;

export const validatePassword: ValidatePassword = (storedPassword: Password, inputPassword: string) => 
    compareSync(inputPassword, storedPassword.toString());

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