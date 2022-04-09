import { Result } from "typescript-monads";
import { v4 as uuidV4, validate as validateUuid } from "uuid";
import { DomainError } from "./domain-error";

export class Id {
    private constructor (
        private value: string
    ) {}

    toString(): string {
        return this.value;
    }

    static createNew(): Id {
        return new Id(uuidV4());
    }

    static create(value: string): Result<Id, DomainError> {
        return validateUuid(value)
            ? Result.ok(new Id(value))
            : Result.fail(new InvalidUuid())
    }
}

export class InvalidUuid extends DomainError {
    get code(): number {
        return 400;
    }

    constructor() {
        super("invad uuid");
        this.name = "invad uuid";
        Object.setPrototypeOf(this, InvalidUuid.prototype);
    }
}