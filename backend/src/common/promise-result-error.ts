import { Result } from "typescript-monads";
import { DomainError } from "./domain-error";

export const promiseResultError = <T>(error: DomainError): Promise<Result<T, DomainError>> => Promise.resolve(Result.fail<T, DomainError>(error));