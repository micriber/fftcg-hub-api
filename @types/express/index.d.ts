declare namespace Express {
    interface Request {
        user: import('../../src/users/entities/user').default;
    }
}
