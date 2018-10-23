"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const authenticationerror_1 = require("../../../../logic/common/authenticationerror");
describe('AuthenticationError', () => {
    describe('constructor()', () => {
        let error = new authenticationerror_1.AuthenticationError('message');
        it('message is defined.', () => {
            chai_1.expect(error.message).to.equal('message');
        });
    });
});
//# sourceMappingURL=authenticationerror.test.js.map