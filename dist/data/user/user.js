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
const userstats_1 = require("./userstats");
const passwordhasher_1 = require("../../logic/security/passwordhasher");
/**
 * User object of the service. Represents an individual that
 * has registered with the system and has some roles, and stats.
 */
let User = User_1 = class User {
    /**
     * Update the password hash of the user. This will
     * pass the password through the hasher.
     * @param The new password to hash.
     */
    setPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (password.length < User_1.MIN_PASSWORD_LENGTH) {
                throw new Error("Password is too short!");
            }
            this.passwordHash = yield passwordhasher_1.PasswordHasher.generateHash(password);
        });
    }
    /**
     * Check to see if the passed in password matches the
     * hash stored on the user.
     * @param password The password to test.
     * @returns True if the password matches the hash.
     */
    validatePassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield passwordhasher_1.PasswordHasher.validateHash(password, this.passwordHash);
        });
    }
    /**
     * Generate a new user using the passed in registration.
     * If the registration is invalid, an error will be thrown.
     * Be sure to call .validate() on the registration!
     * @param registration The registration to build the user from.
     */
    static FromRegistration(registration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!registration.validate()) {
                throw new Error("Registration is invalid.");
            }
            //Build the user object.
            let user = new User_1();
            user.username = registration.username;
            user.name = registration.name;
            user.email = registration.email;
            user.stats = new userstats_1.UserStats();
            yield user.setPassword(registration.password);
            return user;
        });
    }
};
/**
 * The minimum number of characters in a username.
 */
User.MIN_USERNAME_LENGTH = 4;
/**
 * The maximum number of characters in a username.
 */
User.MAX_USERNAME_LENGTH = 24;
/**
 * The maximum number of characters in a user's email.
 */
User.MAX_EMAIL_LENGTH = 64;
/**
 * The minimum length to allow for passwords.
 */
User.MIN_PASSWORD_LENGTH = 8;
__decorate([
    typeorm_1.PrimaryGeneratedColumn("increment", { type: "bigint", unsigned: true }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Index("IX_userUsername"),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm_1.Column("varchar"),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: User_1.MAX_USERNAME_LENGTH }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("varchar", { length: User_1.MAX_EMAIL_LENGTH }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isDeleted", void 0);
__decorate([
    typeorm_1.OneToOne(type => userstats_1.UserStats, stats => stats.user),
    __metadata("design:type", userstats_1.UserStats)
], User.prototype, "stats", void 0);
User = User_1 = __decorate([
    typeorm_1.Entity({ name: "User" })
], User);
exports.User = User;
var User_1;

//# sourceMappingURL=user.js.map
