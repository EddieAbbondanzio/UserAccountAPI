"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const validatorresult_1 = require("../../../../logic/validation/validatorresult");
/**
 * Test module for ValidatorResult
 */
describe('ValidatorResult', () => {
    describe('constructor()', () => {
        it('defaults to false when no isValid is passed', () => {
            let valResult = new validatorresult_1.ValidatorResult();
            chai_1.expect(valResult.isValid).to.be.false;
        });
        it('assigns isValid when passed', () => {
            let valResult = new validatorresult_1.ValidatorResult(true);
            chai_1.expect(valResult.isValid).to.be.true;
        });
        it('assigns a single error', () => {
            let valResult = new validatorresult_1.ValidatorResult(false, 'foo');
            chai_1.expect(valResult.errors).to.be.an('array').of.length(1).and.have.members(['foo']);
        });
    });
});
//# sourceMappingURL=validatorresult.test.js.map