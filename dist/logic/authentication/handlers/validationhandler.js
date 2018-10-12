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
const datamodule_1 = require("../../../data/datamodule");
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
        this.loginRepo = connection.getCustomRepository(datamodule_1.UserLoginRepository);
    }
    /**
     * Validate that a user is who they claim to be. This will check their username
     * against the login provided in the database.
     * @param user The user to validate.
     * @param loginCode Their login guid.
     * @returns True if the user is who they claim to be.
     */
    validateUser(user, loginCode) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user) {
                throw new Error('No user passed in');
            }
            //Try to find the login.
            let userLogin = yield this.loginRepo.findByUser(user);
            if (userLogin && userLogin.code == loginCode) {
                return true;
            }
            else {
                return false;
            }
        });
    }
}
exports.ValidationHander = ValidationHander;

//# sourceMappingURL=validationhandler.js.map
