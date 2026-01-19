export class InternalServerError extends Error {
    constructor(message = "Internal Server Error", status = 500) {
        super();
        this.message = message;
        this.name = "InternalServerError";
        this.status = status;
    }
}

export class BadRequestError extends Error {
    constructor(message = "Bad Request", status = 400) {
        super();
        this.message = message;
        this.name = "BadRequestError";
        this.status = status;
    }
}

export class NotFoundError extends Error {
    constructor(message = "Not Found", status = 404) {
        super();
        this.message = message;
        this.name = "NotFoundError";
        this.status = status;
    }
}

export class ForbiddenError extends Error {
    constructor(message = "Forbidden", status = 403) {
        super();
        this.message = message;
        this.name = "ForbiddenError";
        this.status = status;
    }
}

export class ConflictError extends Error {
    constructor(message = "Conflict", status = 409) {
        super();
        this.message = message;
        this.name = "ConflictError";
        this.status = status;
    }
}

export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized", status = 401) {
        super();
        this.message = message;
        this.name = "UnauthorizedError";
        this.status = status;
    }
}

export class TokenExpried extends Error {
    constructor(message = "Token Expired", status = 401) {
        super();
        this.message = message;
        this.name = "TokenExpried";
        this.status = status;
    }
}

export class JsonWebTokenError extends Error {
    constructor(message = "Json Web Token Error", status = 401) {
        super();
        this.message = message;
        this.name = "JsonWebTokenError";
        this.status = status;
    }
}