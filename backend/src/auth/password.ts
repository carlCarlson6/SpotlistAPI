import { compareSync, hashSync } from "bcryptjs";
import { fail, ok, Result } from "typescript-monads";
import { invalidPasswordFormat, InvalidPasswordFormat } from "./InvalidPasswordFormat";
import { validatePasswordFormat } from "./validate-password-format";


export class Password {
    private constructor(
        private readonly value: string
    ) {}

    toString(): string {
        return this.value;
    }

    static create(input: string): Result<Password, InvalidPasswordFormat> {
        return validatePasswordFormat(input) 
            ? ok(new Password(hashSync(input, 10)))
            : fail(invalidPasswordFormat);
    }
}

export type ValidatePassword = (storedPassword: Password, inputPassword: string) => boolean;

export const validatePassword: ValidatePassword = (storedPassword: Password, inputPassword: string) => 
    compareSync(inputPassword, storedPassword.toString());
