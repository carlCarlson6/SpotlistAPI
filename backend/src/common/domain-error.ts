export abstract class DomainError extends Error {
    abstract get code(): number;
}