
class defaultError extends Error {
    constructor(message, statusCode, type = "default") {
        super(message);
        this.statusCode = statusCode;
        this.type = type;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = defaultError;