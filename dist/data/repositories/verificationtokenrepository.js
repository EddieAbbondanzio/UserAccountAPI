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
const verificationtoken_1 = require("../../logic/models/verificationtoken");
const nullargumenterror_1 = require("../../common/errors/nullargumenterror");
const mysqlerror_1 = require("../mysqlerror");
const duplicateerror_1 = require("../../common/errors/duplicateerror");
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
            if (user == null) {
                throw new nullargumenterror_1.NullArgumentError('user');
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
     */
    add(verificationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (verificationToken == null) {
                throw new nullargumenterror_1.NullArgumentError('verificationToken');
            }
            try {
                yield this.repository.insert(verificationToken);
            }
            catch (error) {
                //Is it an error we know about?
                if (error instanceof typeorm_1.QueryFailedError) {
                    let errorCode = error.errno;
                    if (errorCode == mysqlerror_1.MySqlErrorCode.DuplicateKey) {
                        throw new duplicateerror_1.DuplicateError('A verification token for the user already exists.');
                    }
                }
                //Pass it higher up, no clue what it is.
                throw error;
            }
        });
    }
    /**
     * Delete an existing validation token from the database.
     * @param validationtoken The validation token to delete.
     */
    delete(verificationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            if (verificationToken == null) {
                throw new nullargumenterror_1.NullArgumentError('verificationToken');
            }
            yield this.repository.delete(verificationToken);
        });
    }
};
VerificationTokenRepository = __decorate([
    typeorm_1.EntityRepository(verificationtoken_1.VerificationToken)
], VerificationTokenRepository);
exports.VerificationTokenRepository = VerificationTokenRepository;
//# sourceMappingURL=verificationtokenrepository.js.map