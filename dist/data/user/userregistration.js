"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Information of a user that wants to register with
 * the system.
 */
class UserRegistration {
    /**
     * Create a new UserRegistration.
     * @param username The username the user wants.
     * @param password Their desired password. (Pre-hash)
     * @param name Their actual name.
     * @param email Their contact email.
     */
    constructor(username, password, name, email) {
        if (username != undefined) {
            this.username = username;
        }
        if (password != undefined) {
            this.password = password;
        }
        if (name != undefined) {
            this.name = name;
        }
        if (email != undefined) {
            this.email = email;
        }
    }
}
exports.UserRegistration = UserRegistration;
//# sourceMappingURL=userregistration.js.map