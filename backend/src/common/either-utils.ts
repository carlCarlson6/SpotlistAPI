import { Either } from "typescript-monads";

export const left = <T,J>(value: T) => new Either<T,J>(value, undefined);
export const right = <T,J>(value: J) => new Either<T,J>(undefined, value);