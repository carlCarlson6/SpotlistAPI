import { DomainError } from "./domain-error";

export class UnauthorizedOperation extends DomainError {
    get code(): number {
        throw new Error("TODO - Method not implemented.");
    }
}
