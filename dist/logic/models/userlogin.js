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
var UserLogin_1;
const typeorm_1 = require("typeorm");
const randomutils_1 = require("../../util/randomutils");
const user_1 = require("./user");
/**
 * A login gives user access to portions of the
 * API that are locked down. Logins are simple ways
 * to track a users login from some device.
 */
let UserLogin = UserLogin_1 = class UserLogin {
    /**
     * Create a new user login.
     * @param user The user to create a login for.
     */
    constructor(user) {
        if (user) {
            this.user = user;
            this.code = randomutils_1.RandomUtils.generateRandomString(UserLogin_1.CODE_LENGTH);
        }
    }
};
/**
 * The ideal code length for the unique code.
 */
UserLogin.CODE_LENGTH = 16;
__decorate([
    typeorm_1.JoinColumn(),
    typeorm_1.OneToOne(type => user_1.User, { primary: true }),
    __metadata("design:type", user_1.User)
], UserLogin.prototype, "user", void 0);
__decorate([
    typeorm_1.Column("char", { length: UserLogin_1.CODE_LENGTH, nullable: false }),
    __metadata("design:type", String)
], UserLogin.prototype, "code", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], UserLogin.prototype, "loginDate", void 0);
UserLogin = UserLogin_1 = __decorate([
    typeorm_1.Entity({ name: "UserLogin" }),
    __metadata("design:paramtypes", [user_1.User])
], UserLogin);
exports.UserLogin = UserLogin;
//# sourceMappingURL=userlogin.js.map