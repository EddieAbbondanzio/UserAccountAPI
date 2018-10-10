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
    }
    /**
     * Checks if a username is available for taking.
     * @param username The username to check for.
     * @returns True if the username is available.
     */
    isUsernameAvailable(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
            // if(!username){
            //     return false;
            // }
            // try {
            //     return await this.userRepo.isUsernameAvailable(username);
            // }
            // catch(error) {
            //     console.log('UserService.isUsernameAvailable(): ', error);
            //     return false;
            // }
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
            return null;
            // if(!username){
            //     return null;
            // }
            // try {
            //     return this.userRepo.findByUsername(username, includeDeleted);
            // }
            // catch(error){
            //     console.log('UserService.findByUsername(): ', error);
            //     return null;
            // }
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
            return null;
            // if(isNaN(id)){
            //     return null;
            // }
            // try {
            //     return this.userRepo.findById(id, includeDeleted);
            // }
            // catch(error){
            //     console.log('UserService.findById(): ', error);
            //     return null;
            // }
        });
    }
    /**
     * Update an existing user in the database.
     * @param user The user to update
     * @returns True if no errors occured.
     */
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return;
            // if(!user){
            //     return;
            // }
            // try {
            //     this.userRepo.update(user);
            // }
            // catch(error){
            //     console.log('UserService.update(): ', error);
            // }
        });
    }
    /**
     * Delete a user from the database
     * @param user The user to delete
     */
    delete(user) {
        return __awaiter(this, void 0, void 0, function* () {
            //Bad data
            if (!user || isNaN(user.id) || user.isDeleted) {
                return;
            }
            return null;
            // if(!user || isNaN(user.id)){
            //     return;
            // }
            // try {
            //     this.userRepo.delete(user);
            // }
            // catch(error){
            //     console.log('UserService.delete(): ', error);
            // }
        });
    }
}
exports.UserHandler = UserHandler;

//# sourceMappingURL=userhandler.js.map
