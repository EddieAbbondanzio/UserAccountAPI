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
const stringutils_1 = require("../../util/stringutils");
/**
 * Storage interface for logins of users. Allows for adding a new
 * login of a user, or removing every
 */
let UserLoginRepository = class UserLoginRepository extends typeorm_1.AbstractRepository {
    /**
     * Search for a userlogin via it's unique id.
     * @param id The id of the login to search for.
     * @returns{Promise<UserLogin} The userlogin (if found).
     */
    findByGuid(guid) {
        return __awaiter(this, void 0, void 0, function* () {
            if (stringutils_1.StringUtils.isBlank(guid)) {
                throw new Error("No guid passed in");
            }
            else {
                return yield this.repository.createQueryBuilder('login')
                    .leftJoinAndSelect('login.user', 'user')
                    .where('login.guid = :guid', { guid: guid })
                    .andWhere('user.isDeleted = false')
                    .getOne();
            }
        });
    }
    /**
     * Add a new login for a user to the database. Also prunes
     * old data by removing unused logins.
     * @param userlogin The login to add to the database.
     */
    add(userlogin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userlogin == null) {
                return null;
            }
            //Delete old logins for user
            yield this.repository.createQueryBuilder()
                .delete()
                .from(userlogin_1.UserLogin)
                .where('userId = :id', { id: userlogin.user.id })
                .execute();
            //Save the new one and return it back.
            return this.repository.save(userlogin);
        });
    }
    /**
     * Remove a userlogin from the database.
     * @param userlogin The login to delete.
     */
    delete(userlogin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userlogin == null) {
                return;
            }
            yield this.repository.createQueryBuilder()
                .delete()
                .from(userlogin_1.UserLogin)
                .where('id = :id', userlogin)
                .execute();
        });
    }
    /**
     * Remove an existing login from the database.
     * @param loginId The login id of the login
     * to remove from the database.
     */
    deleteByGuid(guid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.createQueryBuilder()
                .delete()
                .from(userlogin_1.UserLogin)
                .where('guid = :guid', { guid: guid })
                .execute();
        });
    }
};
UserLoginRepository = __decorate([
    typeorm_1.EntityRepository(userlogin_1.UserLogin)
], UserLoginRepository);
exports.UserLoginRepository = UserLoginRepository;

//# sourceMappingURL=userloginrepository.js.map
