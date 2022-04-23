export const buildAuthorizationHeader = (name: string, password: string) => ({ 
    Authorization: `Basic ${Buffer.from(name + ':' + password).toString('base64')}` 
});