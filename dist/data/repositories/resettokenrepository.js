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
const resettoken_1 = require("../../logic/models/resettoken");
const nullargumenterror_1 = require("../../common/error/types/nullargumenterror");
const argumenterror_1 = require("../../common/error/types/argumenterror");
const mysqlerror_1 = require("../mysqlerror");
const duplicateerror_1 = require("../../common/error/types/duplicateerror");
/**
 * Storage interface for reset tokens of users. Allows for basic CRUD
 * operations with the database.
 */
let ResetTokenRespository = class ResetTokenRespository extends typeorm_1.AbstractRepository {
    /**
     * Searches for a user's reset token.
     * @param user The user to look for a reset token for.
     * @returns The token found (or null).
     */
    findByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
            }
            else if (isNaN(user.id)) {
                throw new argumenterror_1.ArgumentError('user', 'does not have an id');
            }
            return this.repository.createQueryBuilder('token')
                .leftJoinAndSelect('token.user', 'user')
                .where('token.userId = :id', user)
                .getOne();
        });
    }
    /**
     * Add a new reset token to the database.
     * @param resetToken The token to add to the database.
     * @returns True if no errors.
     */
    add(resetToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (resetToken == null) {
                throw new nullargumenterror_1.NullArgumentError('resetToken');
            }
            else if (resetToken.user == null) {
                throw new argumenterror_1.ArgumentError('resetToken', 'no user for this token');
            }
            else if (isNaN(resetToken.user.id)) {
                throw new argumenterror_1.ArgumentError('resetToken', 'no id on the user of the token');
            }
            //Should more than one be allowed per user?
            try {
                yield this.repository.insert(resetToken);
            }
            catch (error) {
                //Is it an error we know about?
                if (error instanceof typeorm_1.QueryFailedError) {
                    let errorCode = error.errno;
                    if (errorCode == mysqlerror_1.MySqlErrorCode.DuplicateKey) {
                        throw new duplicateerror_1.DuplicateError('A reset token for the user already exists.');
                    }
                }
                //Pass it higher up, no clue what it is.
                throw error;
            }
        });
    }
    /**
     * Delete an existing reset token from the database.
     * @param resetToken The reset token to delete.
     * @returns True if no errors.
     */
    delete(resetToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (resetToken == null) {
                throw new nullargumenterror_1.NullArgumentError('resetToken');
            }
            else if (resetToken.user == null) {
                throw new argumenterror_1.ArgumentError('resetToken', 'no user for this token');
            }
            else if (isNaN(resetToken.user.id)) {
                throw new argumenterror_1.ArgumentError('resetToken', 'no id on the user of the token');
            }
            yield this.repository.delete(resetToken);
        });
    }
};
ResetTokenRespository = __decorate([
    typeorm_1.EntityRepository(resettoken_1.ResetToken)
], ResetTokenRespository);
exports.ResetTokenRespository = ResetTokenRespository;
//# sourceMappingURL=resettokenrepository.js.map