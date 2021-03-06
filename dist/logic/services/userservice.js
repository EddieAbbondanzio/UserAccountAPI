"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const validationerror_1 = require("../validation/validationerror");
const userdeletevalidator_1 = require("../validation/user/validators/userdeletevalidator");
const database_1 = require("../common/database");
const servicetype_1 = require("../common/servicetype");
const argumenterror_1 = require("../../common/error/types/argumenterror");
const stringutils_1 = require("../../util/stringutils");
const usernamevalidatorrule_1 = require("../validation/user/rules/usernamevalidatorrule");
const nullargumenterror_1 = require("../../common/error/types/nullargumenterror");
const usernamevalidator_1 = require("../validation/user/validators/usernamevalidator");
const databaseservice_1 = require("../common/databaseservice");
const userregistrationvalidator_1 = require("../validation/user/validators/userregistrationvalidator");
const errorhandler_1 = require("../../common/error/errorhandler");
const typeorm_1 = require("typeorm");
const duplicateerror_1 = require("../../common/error/types/duplicateerror");
const inversify_1 = require("inversify");
const ioctypes_1 = require("../../common/ioc/ioctypes");
/**
 * The user service for retrieving users from the system.
 */
let UserService = class UserService extends databaseservice_1.DatabaseService {
    /**
     * Create a new user service.
     * @param database The current database.
     */
    constructor(database) {
        super(database);
        /**
         * The type of service it is.
         */
        this.serviceType = servicetype_1.ServiceType.User;
        this.userDeleteValidator = new userdeletevalidator_1.UserDeleteValidator();
        this.userRegistrationValidator = new userregistrationvalidator_1.UserRegistrationValidator();
    }
    /**
     * Checks if a username is available for taking.s
     * @param username The username to check for.
     * @returns True if the username is available.
     */
    isUsernameAvailable(username) {
        return __awaiter(this, void 0, void 0, function* () {
            let usernameValRule = new usernamevalidatorrule_1.UsernameValidatorRule();
            if (username == null) {
                throw new nullargumenterror_1.NullArgumentError('username');
            }
            else {
                let validatorResult = new usernamevalidator_1.UsernameValidator().validate(username);
                if (validatorResult.isValid) {
                    return this.database.userRepo.isUsernameAvailable(username);
                }
                else {
                    throw new validationerror_1.ValidationError('Username is not valid', validatorResult);
                }
            }
        });
    }
    /**
     * Check if an email is already in use by a non-deleted
     * user.
     * @param email The email to check.
     * @returns True if the email is being used.
     */
    isEmailInUse(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (email == null) {
                throw new nullargumenterror_1.NullArgumentError('email');
            }
            return this.database.userRepo.isEmailInUse(email);
        });
    }
    registerNewUser(registration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (registration == null) {
                throw new nullargumenterror_1.NullArgumentError('registration');
            }
            //Is the user even valid?
            let validatorResult = this.userRegistrationValidator.validate(registration);
            if (!validatorResult.isValid) {
                throw new validationerror_1.ValidationError('Failed to register new user.', validatorResult);
            }
            //Generate the user
            let user = yield user_1.User.fromRegistration(registration);
            let vToken;
            try {
                yield this.database.userRepo.add(user);
                return user;
            }
            catch (error) {
                if (this.database.isInTransaction()) {
                    yield this.database.rollbackTransaction();
                }
                new errorhandler_1.ErrorHandler(error)
                    .catch(typeorm_1.QueryFailedError, (error) => {
                    if (error.message.includes('ER_DUP_ENTRY')) {
                        throw new duplicateerror_1.DuplicateError('Username or email is already in use.');
                    }
                })
                    .otherwiseRaise();
                return null;
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
            if (username == null) {
                throw new nullargumenterror_1.NullArgumentError('username');
            }
            return this.database.userRepo.findByUsername(username, includeDeleted);
        });
    }
    /**
     * Search for a user by their unique id. This is primarily for
     * API calls.
     * @param id The numeric id of the user to look for.
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    findById(id, includeDeleted) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN(id)) {
                throw new argumenterror_1.ArgumentError('id');
            }
            return this.database.userRepo.findById(id, includeDeleted);
        });
    }
    /**
     * Search for a user via their email.
     * @param email The email to look for.
     * @param includeDeleted If deleted users should be included in the result.
     */
    findByEmail(email, includeDeleted) {
        return __awaiter(this, void 0, void 0, function* () {
            if (stringutils_1.StringUtils.isBlank(email)) {
                throw new argumenterror_1.ArgumentError('email');
            }
            return this.database.userRepo.findByEmail(email, includeDeleted);
        });
    }
    /**
     * Delete a user from the database
     * @param user The user to delete
     */
    delete(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user || isNaN(user.id)) {
                throw new argumenterror_1.ArgumentError('user');
            }
            let validatorResult = this.userDeleteValidator.validate(user);
            if (!validatorResult.isValid) {
                throw new validationerror_1.ValidationError('Failed to delete user.', validatorResult);
            }
            yield this.database.userRepo.delete(user);
        });
    }
};
UserService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(ioctypes_1.IOC_TYPES.Database)),
    __metadata("design:paramtypes", [database_1.Database])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=userservice.js.map