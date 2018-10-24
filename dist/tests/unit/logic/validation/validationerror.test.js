"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const validatorresult_1 = require("../../../../logic/validation/validatorresult");
const validationerror_1 = require("../../../../logic/validation/validationerror");
/**
 * Test module for ValidationErrors
 */
describe('ValidationError', () => {
    describe('constructor()', () => {
        it('assigns the message', () => {
            let valError = new validationerror_1.ValidationError('error message');
            chai_1.expect(valError.message).to.be.a('string').that.equals('error message');
        });
        it('assigns the validatorResult', () => {
            let valResult = new validatorresult_1.ValidatorResult(false, 'error');
            let valError = new validationerror_1.ValidationError('error message', valResult);
            chai_1.expect(valError.validatorResult).to.equal(valResult);
        });
    });
});
//# sourceMappingURL=validationerror.test.js.map