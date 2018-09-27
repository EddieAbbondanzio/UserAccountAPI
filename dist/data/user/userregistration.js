"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringutils_1 = require("../../util/stringutils");
const user_1 = require("./user");
/**
 * Information of a user that wants to register with
 * the system.
 */
class UserRegistration {
    /**
     * Validate the registration to see if everything is
     * okay. This will check the username, and more.
     * @returns True if the user is accepted.
     */
    validate() {
        //Check if the username is valid
        if (!/^[-\w\_]{4,24}$/.test(this.username)) {
            return false;
        }
        //Check the password
        if (stringutils_1.StringUtils.isBlank(this.password) || this.password.length < user_1.User.MIN_PASSWORD_LENGTH) {
            return false;
        }
        //Check the name
        if (stringutils_1.StringUtils.isBlank(this.name)) {
            return false;
        }
        //Check the email
        if (stringutils_1.StringUtils.isBlank(this.email)) {
            return false;
        }
        //Made it this far, it must be good.
        return true;
    }
}
exports.UserRegistration = UserRegistration;

//# sourceMappingURL=userregistration.js.map
