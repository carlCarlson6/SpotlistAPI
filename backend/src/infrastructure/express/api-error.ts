export interface ApiError {
    message: string
}

export const fromDomainError = (error: Error): ApiError => ({
    message: !error.message || error.message.length === 0 ? `${error.name}` : `${error.name} - ${error.message}`
});