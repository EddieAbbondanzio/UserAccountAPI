"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The various types of objects for the Inversion of
 * Control Container.
 */
exports.IOC_TYPES = {
    Config: Symbol.for('Config'),
    Database: Symbol.for('Database'),
    EmailSender: Symbol.for('EmailSender'),
    AccountService: Symbol.for('AccountService'),
    AuthService: Symbol.for('AuthService'),
    TokenService: Symbol.for('TokenService'),
    UserService: Symbol.for('UserService'),
    AccountHandler: Symbol.for('AcountHandler'),
    UserHandler: Symbol.for('UserHandler'),
    AuthHandler: Symbol.for('AuthHandler'),
    Server: Symbol.for('Server')
};
//# sourceMappingURL=ioctypes.js.map