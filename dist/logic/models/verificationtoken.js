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
var VerificationToken_1;
const typeorm_1 = require("typeorm");
const randomutils_1 = require("../../util/randomutils");
const user_1 = require("./user");
/**
 * Token that is sent to a user to validate their
 * email address. User's aren't considered active
 * unless they have a valid email.
 */
let VerificationToken = VerificationToken_1 = class VerificationToken {
    constructor(user) {
        if (user) {
            this.user = user;
            this.code = randomutils_1.RandomUtils.generateRandomString(VerificationToken_1.CODE_LENGTH);
        }
    }
};
/**
 * The ideal code length for validation tokens.
 */
VerificationToken.CODE_LENGTH = 6;
__decorate([
    typeorm_1.JoinColumn(),
    typeorm_1.OneToOne(type => user_1.User, { primary: true }),
    __metadata("design:type", user_1.User)
], VerificationToken.prototype, "user", void 0);
__decorate([
    typeorm_1.Column("char", { length: VerificationToken_1.CODE_LENGTH, nullable: false }),
    __metadata("design:type", String)
], VerificationToken.prototype, "code", void 0);
VerificationToken = VerificationToken_1 = __decorate([
    typeorm_1.Entity({ name: "VerificationToken" }),
    __metadata("design:paramtypes", [user_1.User])
], VerificationToken);
exports.VerificationToken = VerificationToken;
//# sourceMappingURL=verificationtoken.js.map