import { Result } from "typescript-monads";
import { v4 as uuidV4, validate as validateUuid } from "uuid";

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

    static create(value: string): Result<Id, Error> {
        return validateUuid(value)
            ? Result.ok(new Id(value))
            : Result.fail(new Error("invalid uuid"))
    }
}