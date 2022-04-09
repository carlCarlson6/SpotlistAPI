export interface ApiError {
    message: string
}

export const FromDomainError = (error: Error): ApiError => ({
    message: `${error.name} - ${error.message}`
});