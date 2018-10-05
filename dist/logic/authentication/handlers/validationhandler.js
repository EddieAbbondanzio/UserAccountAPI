"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logichandler_1 = require("../../common/logichandler");
/**
 * Business logic for validating users are who they
 * claim they are.
 */
class ValidationHander extends logichandler_1.LogicHandler {
    /**
     * Create a new validation handler.
     * @param connection The database connection.
     * @param serviceLocator The service locator.
     */
    constructor(connection, serviceLocator) {
        super(connection, serviceLocator);
    }
    /**
     * Validate that a user is who they claim to be. This will check their username
     * against the login provided in the database.
     * @param username The username of the user.
     * @param loginGuid Their login guid.
     * @returns True if the user is who they claim to be.
     */
    validateUser(username, loginGuid) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
}
exports.ValidationHander = ValidationHander;

//# sourceMappingURL=validationhandler.js.map
