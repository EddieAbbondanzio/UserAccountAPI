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
const user_1 = require("../user/user");
const typeorm_1 = require("typeorm");
const uuidv4 = require("uuid/v4");
/**
 * A login gives user access to portions of the
 * API that are locked down. Logins are simple ways
 * to track a users login from some device.
 */
let UserLogin = UserLogin_1 = class UserLogin {
    /**
     * Generate a new login that has a unique GUID
     * associated with it.
     * @param user The user to build a login for.
     */
    static GenerateLogin(user) {
        let userLogin = new UserLogin_1();
        userLogin.user = user;
        userLogin.guid = uuidv4();
        return userLogin;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn("increment", { type: "bigint", unsigned: true }),
    __metadata("design:type", Number)
], UserLogin.prototype, "id", void 0);
__decorate([
    typeorm_1.Index("IX_loginUserId"),
    typeorm_1.ManyToOne(type => user_1.User),
    __metadata("design:type", user_1.User)
], UserLogin.prototype, "user", void 0);
__decorate([
    typeorm_1.Column("varchar", { nullable: false }),
    __metadata("design:type", String)
], UserLogin.prototype, "guid", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], UserLogin.prototype, "loginDate", void 0);
UserLogin = UserLogin_1 = __decorate([
    typeorm_1.Entity({ name: "UserLogin" })
], UserLogin);
exports.UserLogin = UserLogin;
var UserLogin_1;

//# sourceMappingURL=userlogin.js.map
