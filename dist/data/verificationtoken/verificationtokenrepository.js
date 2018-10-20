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
const verificationtoken_1 = require("./verificationtoken");
const inversify_1 = require("inversify");
/**
 * Storage interface for validation tokens of users. Allows for basic
 * CRUD operations with the database.
 */
let VerificationTokenRepository = class VerificationTokenRepository extends typeorm_1.AbstractRepository {
    /**
     * Searches for a user's validation token.
     * @param user The user to look for a validation token for.
     * @returns The token found (or null).
     */
    findByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            //Stop bad data
            if (!user) {
                return null;
            }
            return this.repository.createQueryBuilder('token')
                .leftJoinAndSelect('token.user', 'user')
                .where('token.userId = :id', user)
                .getOne();
        });
    }
    /**
     * Add a new validation token to the database.
     * @param verificationToken The token to add to the database.
     * @returns True if no errors.
     */
    add(verificationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            //Stop bad data.
            if (!verificationToken) {
                return false;
            }
            let result = yield this.repository.insert(verificationToken);
            return result.raw.affectedRowCount == 1;
        });
    }
    /**
     * Delete an existing validation token from the database.
     * @param validationtoken The validation token to delete.
     * @returns True if no errors.
     */
    delete(verificationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            //Stop bad data.
            if (!verificationToken) {
                return false;
            }
            let result = yield this.repository.delete(verificationToken);
            return result.raw.affectedRowCount == 1;
        });
    }
};
VerificationTokenRepository = __decorate([
    inversify_1.injectable(),
    typeorm_1.EntityRepository(verificationtoken_1.VerificationToken)
], VerificationTokenRepository);
exports.VerificationTokenRepository = VerificationTokenRepository;
//# sourceMappingURL=verificationtokenrepository.js.map