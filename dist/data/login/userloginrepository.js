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
const userlogin_1 = require("./userlogin");
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
            if (user == undefined) {
                return undefined;
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
     * @returns True if no errors.
     * @param transactionManager The transaction manager to use when
     * a database transaction is in progress.
     */
    add(userLogin, transactionManager) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userLogin) {
                return false;
            }
            let loginRepo = transactionManager ? transactionManager.getRepository(userlogin_1.UserLogin) : this.repository;
            let result = yield loginRepo.insert(userLogin);
            return result.raw.affectedRowCount == 1;
        });
    }
    /**
     * Remove an existing login from the database.
     * @param userlogin The userlogin to remove from the database.
     * @param transactionManager The transaction manager to use when
     * a database transaction is in progress.
     * @returns True if no errors.
     */
    delete(userlogin, transactionManager) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userlogin) {
                return false;
            }
            let loginRepo = transactionManager ? transactionManager.getRepository(userlogin_1.UserLogin) : this.repository;
            let result = yield loginRepo.delete(userlogin);
            return result.raw.affectedRowCount == 1;
        });
    }
    /**
     * Remove an existing login from the database via it's id.
     * @param id The login id to look for.
     * @param transactionManager The transaction manager to use when a database
     * transaction is in progress.
     * @returns True if no errors.
     */
    deleteById(id, transactionManager) {
        return __awaiter(this, void 0, void 0, function* () {
            if (isNaN) {
                throw new Error('Invalid id passed.');
            }
            let result;
            if (transactionManager) {
                result = yield transactionManager.createQueryBuilder()
                    .delete()
                    .where('id = :id', { id: id })
                    .execute();
            }
            else {
                result = yield this.repository.createQueryBuilder()
                    .delete()
                    .where('id = :id', { id: id })
                    .execute();
            }
            return result.raw.affectedRowCount == 1;
        });
    }
};
UserLoginRepository = __decorate([
    typeorm_1.EntityRepository(userlogin_1.UserLogin)
], UserLoginRepository);
exports.UserLoginRepository = UserLoginRepository;
//# sourceMappingURL=userloginrepository.js.map