"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uservalidator_1 = require("./uservalidator");
const usernotdeletedvalidationrule_1 = require("../rules/usernotdeletedvalidationrule");
/**
 * Validator to validate a user being deleted.
 */
class UserDeleteValidator extends uservalidator_1.UserValidator {
    /**
     * Create a new user creation validator.
     */
    constructor() {
        super();
        this.rules = [
            new usernotdeletedvalidationrule_1.UserNotDeletedValidatorRule()
        ];
    }
}
exports.UserDeleteValidator = UserDeleteValidator;

//# sourceMappingURL=userdeletevalidator.js.map
