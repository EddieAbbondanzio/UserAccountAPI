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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_1 = require("../user/user");
const randomutils_1 = require("../../util/randomutils");
/**
 * Token that is sent to a user to validate their
 * email address. User's aren't considered active
 * unless they have a valid email.
 */
let VerificationToken = VerificationToken_1 = class VerificationToken {
    /**
     * Generate a new validation token.
     * @param user The user to generate a token for.
     * @returns The newly generated token.
     */
    static generateToken(user) {
        let vToken = new VerificationToken_1();
        vToken.user = user;
        vToken.code = randomutils_1.RandomUtils.generateRandomString(VerificationToken_1.CODE_LENGTH);
        return vToken;
    }
};
/**
 * The ideal code length for validation tokens.
 */
VerificationToken.CODE_LENGTH = 6;
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], VerificationToken.prototype, "id", void 0);
__decorate([
    typeorm_1.JoinColumn(),
    typeorm_1.OneToOne(type => user_1.User, user => user.stats, { primary: true }),
    __metadata("design:type", user_1.User)
], VerificationToken.prototype, "user", void 0);
__decorate([
    typeorm_1.Column("char", { length: VerificationToken_1.CODE_LENGTH, nullable: false }),
    __metadata("design:type", String)
], VerificationToken.prototype, "code", void 0);
VerificationToken = VerificationToken_1 = __decorate([
    typeorm_1.Entity({ name: "VerificationToken" })
], VerificationToken);
exports.VerificationToken = VerificationToken;
var VerificationToken_1;

//# sourceMappingURL=verificationtoken.js.map
