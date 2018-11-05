"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const typeorm_1 = require("typeorm");
const userlogin_1 = require("../../logic/models/userlogin");
const argumenterror_1 = require("../../common/error/types/argumenterror");
const nullargumenterror_1 = require("../../common/error/types/nullargumenterror");
const mysqlerror_1 = require("../mysqlerror");
const duplicateerror_1 = require("../../common/error/types/duplicateerror");
/**
 * Storage interface for logins of users. Allows for adding a new
 * login of a user, or removing every
 */
let UserLoginRepository = class UserLoginRepository extends typeorm_1.AbstractRepository {
    /**
     * Search for a login for a specific user.
     * @param user The user to look for a login for.
     * @returns The login found (or null).
     */
    findByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            else if (isNaN(user.id)) {
                throw new argumenterror_1.ArgumentError('user', 'does not have an id');
            }
            return this.repository.createQueryBuilder('login')
                .leftJoinAndSelect('login.user', 'user')
                .where('login.userId = :id', user)
                .getOne();
        });
    }
    /**
     * Add a new user login to the database.
     * @param userLogin The userlogin to add to the database.
     */
    add(userLogin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userLogin == null) {
                throw new nullargumenterror_1.NullArgumentError('userLogin');
            }
            try {
                yield this.repository.insert(userLogin);
            }
            catch (error) {
                //Is it an error we know about?
                if (error instanceof typeorm_1.QueryFailedError) {
                    let errorCode = error.errno;
                    if (errorCode == mysqlerror_1.MySqlErrorCode.DuplicateKey) {
                        throw new duplicateerror_1.DuplicateError('A login for the user already exists');
                    }
                }
                //Pass it higher up, no clue what it is.
                throw error;
            }
        });
    }
    /**
     * Remove an existing login from the database.
     * @param userlogin The userlogin to remove from the database.
     */
    delete(userlogin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userlogin == null) {
                throw new nullargumenterror_1.NullArgumentError('userLogin');
            }
            yield this.repository.delete(userlogin);
        });
    }
    /**
     * Delete all logins for a user.
     * @param user The user to remove all logins for.
     */
    deleteForUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof user === 'number') {
                yield this.repository.createQueryBuilder()
                    .delete()
                    .where('userId = :id', { id: user })
                    .execute();
            }
            else {
                yield this.repository.createQueryBuilder()
                    .delete()
                    .where('userId = :id', user)
                    .execute();
            }
        });
    }
};
UserLoginRepository = __decorate([
    typeorm_1.EntityRepository(userlogin_1.UserLogin)
], UserLoginRepository);
exports.UserLoginRepository = UserLoginRepository;
//# sourceMappingURL=userloginrepository.js.map