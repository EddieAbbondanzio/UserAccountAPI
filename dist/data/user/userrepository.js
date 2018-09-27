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
const user_1 = require("./user");
const userstats_1 = require("./userstats");
/**
 * Storage interface for Users in the database. Handles loading
 * relationships with other objects such as roles during find operations,
 * and provides the ability to update and remove Users as well.
 */
let UserRepository = class UserRepository extends typeorm_1.AbstractRepository {
    /**
     * Search for a user via their automatically generated
     * id that is assigned to them after inserting them into
     * the database.
     * @param id The unique numeric id of the desired user.
     * @param includeDeleted If deleted entries should be included
     * in the search as well.
     * @returns {Promise<User>} The user found. (if any)
     */
    findById(id, includeDeleted = false) {
        return __awaiter(this, void 0, void 0, function* () {
            //Why bother searching?
            if (id == null) {
                return null;
            }
            if (includeDeleted) {
                return this.repository.createQueryBuilder('user')
                    .leftJoinAndSelect('user.stats', 'stats')
                    .where('user.id = :id', { id: id })
                    .getOne();
            }
            else {
                return this.repository.createQueryBuilder('user')
                    .leftJoinAndSelect('user.stats', 'stats')
                    .where('user.id = :id', { id: id })
                    .andWhere('user.isDeleted = false')
                    .getOne();
            }
        });
    }
    /**
     * Search for a user via their unique id. Usernames are unique,
     * and case insensitive to prevent overlap or copy cats.
     * @param username The username of the user to look for.
     * @param includeDeleted If deleted entries should be included
     * in the search as well.
     * @returns {Promise<User>} The user found. (if any)
     */
    findByUsername(username, includeDeleted = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username) {
                return null;
            }
            if (includeDeleted) {
                return this.repository.createQueryBuilder('user')
                    .leftJoinAndSelect('user.stats', 'stats')
                    .where('user.username = :username', { username: username })
                    .getOne();
            }
            else {
                return this.repository.createQueryBuilder('user')
                    .leftJoinAndSelect('user.stats', 'stats')
                    .where('user.username = :username', { username: username })
                    .andWhere('user.isDeleted = false')
                    .getOne();
            }
        });
    }
    /**
     * Add a new user to the database. This automatically generates
     * a unique id for them after being inserted.
     * @param user The user to add to the database.
     */
    add(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                return;
            }
            //Start a transaction so we don't get orphan objects in
            //the event of failures.
            yield this.manager.connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                let userRepo = manager.getRepository(user_1.User);
                let statRepo = manager.getRepository(userstats_1.UserStats);
                //Deleted users still reserve their username since we 
                //don't want any copy cats.
                let foundCount = yield userRepo.createQueryBuilder()
                    .select()
                    .where('LOWER(username) = LOWER(:username)', user).getCount();
                if (foundCount > 0) {
                    throw new Error("Username is already claimed.");
                }
                //We have to await the user repo insert since
                //we need a user id for the stat insert.
                yield userRepo.insert(user);
                yield statRepo.insert(user.stats);
            }));
        });
    }
    /**
     * Update an existing user in the database. This will
     * not allow for changing of usernames or id since these
     * are considered primary keys.
     * @param user The user to update.
     */
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                return;
            }
            yield this.manager.connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                let userRepo = manager.getRepository(user_1.User);
                //We don't allow everything to be changed since username should NEVER change.
                yield userRepo.createQueryBuilder()
                    .update(user_1.User)
                    .set({
                    passwordHash: user.passwordHash,
                    name: user.name,
                    email: user.email
                })
                    .where('id = :id', { id: user.id })
                    .execute();
            }));
        });
    }
    /**
     * Mark a user as deleted. This will prevent them from being
     * included in any search results when using the find functions.
     * @param user The user to delete.
     */
    delete(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                return;
            }
            yield this.manager.connection.transaction((manager) => __awaiter(this, void 0, void 0, function* () {
                let userRepo = manager.getRepository(user_1.User);
                //We just need to mark the user as deleted
                yield userRepo.createQueryBuilder()
                    .update()
                    .set({ isDeleted: true })
                    .where('id = :id', { id: user.id }).execute();
            }));
        });
    }
    /**
     * Checks if a username is free for use.
     * @param username The username to check for availability.
     * @returns {Promise<boolean>} True if the username is free
     * for the grabbing.
     */
    isUsernameAvailable(username) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username) {
                return false;
            }
            //Deleted users still reserve their username
            let foundCount = yield this.repository.createQueryBuilder()
                .select()
                .where('LOWER(username) = LOWER(:username)', { username: username })
                .getCount();
            return foundCount == 0;
        });
    }
};
UserRepository = __decorate([
    typeorm_1.EntityRepository(user_1.User)
], UserRepository);
exports.UserRepository = UserRepository;

//# sourceMappingURL=userrepository.js.map
