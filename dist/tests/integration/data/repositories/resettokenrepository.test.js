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
const chai_1 = require("chai");
require("mocha");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const confighandler_1 = require("../../../../config/confighandler");
const configtype_1 = require("../../../../config/configtype");
const database_1 = require("../../../../logic/common/database");
const mysqldatabase_1 = require("../../../../data/mysqldatabase");
const nullargumenterror_1 = require("../../../../common/errors/nullargumenterror");
const user_1 = require("../../../../logic/models/user");
const resettoken_1 = require("../../../../logic/models/resettoken");
const argumenterror_1 = require("../../../../common/errors/argumenterror");
/**
 * Test module for the reset token repository.
 */
describe('ResetTokenRepository', () => {
    /**
     * The database to test with.
     */
    let rTokenRepo;
    /**
     * Need to register middleware, and set up the database.
     */
    before(() => __awaiter(this, void 0, void 0, function* () {
        chai.use(chaiAsPromised);
        //Set up the test database
        if (database_1.Database.current == null) {
            let config = yield confighandler_1.ConfigHandler.loadConfig(configtype_1.ConfigType.Test);
            let database = new mysqldatabase_1.MySqlDatabase();
            yield database.initialize(config.database);
            rTokenRepo = database.resetTokenRepo;
        }
    }));
    describe('findByUser()', () => __awaiter(this, void 0, void 0, function* () {
        database_1.Database.current.startTransaction();
        it('throws a null error if no user', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(rTokenRepo.findByUser(null)).to.be.rejectedWith(nullargumenterror_1.NullArgumentError);
        }));
        it('throws an argument error if no user id', () => __awaiter(this, void 0, void 0, function* () {
            let user = new user_1.User();
            chai_1.expect(rTokenRepo.findByUser(user)).to.be.rejectedWith(argumenterror_1.ArgumentError);
        }));
        it('is null if no reset token found', () => __awaiter(this, void 0, void 0, function* () {
            let user = new user_1.User();
            user.id = 999;
            chai_1.expect(rTokenRepo.findByUser(user)).to.be.eventually.null;
        }));
        it('is a valid token if one is found for the user', () => __awaiter(this, void 0, void 0, function* () {
        }));
        database_1.Database.current.rollbackTransaction();
    }));
    describe('add()', () => __awaiter(this, void 0, void 0, function* () {
        it('throws a null error if no token', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(rTokenRepo.add(null)).to.be.rejectedWith(nullargumenterror_1.NullArgumentError);
        }));
        it('throws an argument error if no user', () => __awaiter(this, void 0, void 0, function* () {
            chai_1.expect(rTokenRepo.add(new resettoken_1.ResetToken())).to.be.rejectedWith(argumenterror_1.ArgumentError);
        }));
        it('throws an argument error if no id on the user', () => __awaiter(this, void 0, void 0, function* () {
            let user = new user_1.User();
            chai_1.expect(rTokenRepo.add(new resettoken_1.ResetToken(user))).to.be.rejectedWith(argumenterror_1.ArgumentError);
        }));
        it('throws a duplicate entity error if a token already exists for user', () => __awaiter(this, void 0, void 0, function* () {
        }));
        it('completes successfully if the token is valid', () => __awaiter(this, void 0, void 0, function* () {
        }));
    }));
    describe('delete()', () => __awaiter(this, void 0, void 0, function* () {
        it('throws a null error if no token', () => __awaiter(this, void 0, void 0, function* () {
        }));
        it('throws an argument error if no user, or user id', () => __awaiter(this, void 0, void 0, function* () {
        }));
        it('throws an argument error if no id on the user', () => __awaiter(this, void 0, void 0, function* () {
        }));
        it('completes even if no token was deleted', () => __awaiter(this, void 0, void 0, function* () {
        }));
        it('completes if a token was deleted', () => __awaiter(this, void 0, void 0, function* () {
        }));
    }));
});
//# sourceMappingURL=resettokenrepository.test.js.map