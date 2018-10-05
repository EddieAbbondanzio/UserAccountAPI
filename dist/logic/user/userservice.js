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
const datamodule_1 = require("../../data/datamodule");
/**
 * Business logic pertaining to users. This allows for
 * registering new ones, or retrieving existing ones.
 */
class UserService {
    /**
     * Construct a new User Service for CRUD principles of the Users
     * in the system.
     * @param userRepo The user repo to use for running the
     * @param emailService The service for sending out emails.
     * service with.
     */
    constructor(connection, emailService) {
        this.userRepo = connection.getCustomRepository(datamodule_1.UserRepository);
        this.emailService = emailService;
    }
    /**
     * User forgot their username and wants it emailed to them.
     * @param email The user's email to send it to.
     */
    emailUserTheirUsername(email) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * User forgot their email and wants a temporary access password
     * emailed to them. This will not remove their existing password.
     * @param username The username of the user to email.
     */
    emailUserTempPassword(username) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * Checks if a username is available for taking.
     * @param username The username to check for.
     * @returns True if the username is available.
     */
    isUsernameAvailable(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username) {
                return false;
            }
            try {
                return yield this.userRepo.isUsernameAvailable(username);
            }
            catch (error) {
                console.log('UserService.isUsernameAvailable(): ', error);
                return false;
            }
        });
    }
    /**
     * Search for a user by their username.
     * @param username The username to look for
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    findByUsername(username, includeDeleted = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username) {
                return null;
            }
            try {
                return this.userRepo.findByUsername(username, includeDeleted);
            }
            catch (error) {
                console.log('UserService.findByUsername(): ', error);
                return null;
            }
        });
    }
    /**
     * Search for a user by their unique id. This is primarily for
     * API calls.
     * @param id The numeric id of the user to look for.
     * @param includeDeleted If we should include deleted users in the results.
     * @returns {Promise<User>} The user if found.
     */
    findById(id, includeDeleted = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(id)) {
                return null;
            }
            try {
                return this.userRepo.findById(id, includeDeleted);
            }
            catch (error) {
                console.log('UserService.findById(): ', error);
                return null;
            }
        });
    }
    /**
     * Update an existing user in the database.
     * @param user The user to update
     * @returns True if no errors occured.
     */
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user) {
                return;
            }
            try {
                this.userRepo.update(user);
            }
            catch (error) {
                console.log('UserService.update(): ', error);
            }
        });
    }
    /**
     * Delete a user from the database
     * @param user The user to delete
     */
    delete(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user || isNaN(user.id)) {
                return;
            }
            try {
                this.userRepo.delete(user);
            }
            catch (error) {
                console.log('UserService.delete(): ', error);
            }
        });
    }
    /**
     * Register a new user with the system.
     * @param registration The user's registration.
     */
    register(registration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!registration.validate()) {
                return false;
            }
            else {
                try {
                    let user = yield datamodule_1.User.fromRegistration(registration);
                    yield this.userRepo.add(user);
                    return true;
                }
                catch (error) {
                    console.log('UserService.register(): Failed to register new user: ', error);
                    return false;
                }
            }
        });
    }
}
exports.UserService = UserService;

//# sourceMappingURL=userservice.js.map
