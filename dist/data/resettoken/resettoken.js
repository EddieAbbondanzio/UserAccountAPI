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
var ResetToken_1;
const typeorm_1 = require("typeorm");
const user_1 = require("../user/user");
const randomutils_1 = require("../../util/randomutils");
/**
 * Token that is sent to a user to reset their password.
 * This is required when they attempt to reset their password,
 * else it is rejected.
 */
let ResetToken = ResetToken_1 = class ResetToken {
    /**
     * Create a new reset token for a user.
     * @param user The user to create a reset token for.
     */
    constructor(user) {
        if (user) {
            this.user = user;
            this.code = randomutils_1.RandomUtils.generateRandomString(ResetToken_1.CODE_LENGTH);
        }
    }
};
/**
 * The ideal code length for reset tokens.
 */
ResetToken.CODE_LENGTH = 8;
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ResetToken.prototype, "id", void 0);
__decorate([
    typeorm_1.JoinColumn(),
    typeorm_1.OneToOne(type => user_1.User, user => user.stats, { primary: true }),
    __metadata("design:type", user_1.User)
], ResetToken.prototype, "user", void 0);
__decorate([
    typeorm_1.Column("char", { length: ResetToken_1.CODE_LENGTH, nullable: false }),
    __metadata("design:type", String)
], ResetToken.prototype, "code", void 0);
ResetToken = ResetToken_1 = __decorate([
    typeorm_1.Entity({ name: "ResetToken" }),
    __metadata("design:paramtypes", [user_1.User])
], ResetToken);
exports.ResetToken = ResetToken;
//# sourceMappingURL=resettoken.js.map