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
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
    }
}
exports.UserRegistration = UserRegistration;
//# sourceMappingURL=userregistration.js.map