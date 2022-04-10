// The string must contain at least 1 lowercase alphabetical character
// The string must contain at least 1 uppercase alphabetical character
// The string must contain at least 1 numeric character
// The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
// The string must be eight characters or longer
const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

export type ValidatePasswordFormat = (input: string) => boolean;

export const validatePasswordFormat: ValidatePasswordFormat = (input: string) => 
    !!input && strongRegex.test(input);