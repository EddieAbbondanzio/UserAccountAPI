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
const resettoken_1 = require("./resettoken");
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
            //Stop bad data
            if (user == undefined) {
                return undefined;
            }
            return this.repository.createQueryBuilder('token')
                .leftJoinAndSelect('token.user', 'user')
                .where('token.userId = :id', { user })
                .getOne();
        });
    }
    /**
     * Add a new reset token to the database.
     * @param resetToken The token to add to the database.
     * @param transactionManager The transaction manager to use when
     * a database transaction is in progress.
     * @returns True if no errors.
     */
    add(resetToken, transactionManager) {
        return __awaiter(this, void 0, void 0, function* () {
            //Stop bad data.
            if (!resetToken) {
                return false;
            }
            let tokenRepo = transactionManager ? transactionManager.getRepository(resettoken_1.ResetToken) : this.repository;
            let result = yield tokenRepo.insert(resetToken);
            return result.raw.affectedRowCount == 1;
        });
    }
    /**
     * Delete an existing reset token from the database.
     * @param resetToken The reset token to delete.
     * @param transactionManager The transaction manager to use when
     * a database transaction is in progress.
     * @returns True if no errors.
     */
    delete(resetToken, transactionManager) {
        return __awaiter(this, void 0, void 0, function* () {
            //Stop bad data.
            if (!resetToken) {
                return false;
            }
            let tokenRepo = transactionManager ? transactionManager.getRepository(resettoken_1.ResetToken) : this.repository;
            let result = yield tokenRepo.delete(resetToken);
            return result.raw.affectedRowCount == 1;
        });
    }
};
ResetTokenRespository = __decorate([
    typeorm_1.EntityRepository(resettoken_1.ResetToken)
], ResetTokenRespository);
exports.ResetTokenRespository = ResetTokenRespository;
//# sourceMappingURL=resettokenrepository.js.map