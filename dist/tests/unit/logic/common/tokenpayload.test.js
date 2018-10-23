"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const tokenpayload_1 = require("../../../../logic/common/tokenpayload");
describe('TokenPayload', () => {
    describe('constructor()', () => {
        let tokenPL;
        it('userId is defined.', () => {
            let tokenPL = new tokenpayload_1.TokenPayload(100);
            chai_1.expect(tokenPL.userId).to.equal(100);
        });
        it('userId is undefined.', () => {
            let tokenPL = new tokenpayload_1.TokenPayload();
            chai_1.expect(tokenPL.userId).to.be.undefined;
        });
    });
});
//# sourceMappingURL=tokenpayload.test.js.map