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
const taskresult_1 = require("../../common/results/taskresult");
/**
 * Handler related to users. Manages users such as finding,
 * removing, or updating them.
 */
class UserHandler extends logichandler_1.LogicHandler {
    /**
     * Create a new user handler for managing users.
     * @param connection The database connection.
     * @param serviceLocator The dependency locator.
     */
    constructor(connection, serviceLocator) {
        super(connection, serviceLocator);
        this.userRepo = connection.getCustomRepository(datamodule_1.UserRepository);
    }
    /**
     * Checks if a username is available for taking.
     * @param username The username to check for.
     * @returns True if the username is available.
     */
    isUsernameAvailable(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username) {
                return taskresult_1.TaskResult.errorResult('No username was passed in.');
            }
            else {
                let isAvailable = yield this.userRepo.isUsernameAvailable(username);
                return taskresult_1.TaskResult.successResult(isAvailable);
            }
        });
    }
    /**
     * Search for a user by their username.
     * @param username The username to look for
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    findByUsername(username, includeDeleted) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username) {
                return taskresult_1.TaskResult.errorResult('No username was passed in');
            }
            else {
                let user = yield this.userRepo.findByUsername(username, includeDeleted);
                return taskresult_1.TaskResult.successResult(user);
            }
        });
    }
    /**
     * Search for a user by their unique id. This is primarily for
     * API calls.
     * @param id The numeric id of the user to look for.
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    findById(id, includeDeleted = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(id)) {
                return taskresult_1.TaskResult.errorResult('No user id passed in.');
            }
            else {
                let user = yield this.userRepo.findById(id, includeDeleted);
                return taskresult_1.TaskResult.successResult(user);
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
            if (!user || isNaN(user.id) || user.isDeleted) {
                return false;
            }
            else {
                return yield this.userRepo.update(user);
            }
        });
    }
    /**
     * Delete a user from the database
     * @param user The user to delete
     * @returns True if no errors occured.
     */
    delete(user) {
        return __awaiter(this, void 0, void 0, function* () {
            //Bad data
            if (!user || isNaN(user.id)) {
                return taskresult_1.TaskResult.errorResult('No user passed in, or user has no id.');
            }
            else {
                yield this.userRepo.delete(user);
                return taskresult_1.TaskResult.successResult(true);
            }
        });
    }
}
exports.UserHandler = UserHandler;

//# sourceMappingURL=userhandler.js.map
