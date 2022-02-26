
export class AuthTokenError extends Error {
    constructor() {
        super('Errror with authentication token');
    }
}