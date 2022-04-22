export interface ApiError {
    message: string
}

export const fromDomainError = (error: Error): ApiError => ({
    message: `${error.name} - ${error.message}`
});