import { expect } from 'chai';
import 'mocha';
import { ValidatorResult } from '../../../../logic/validation/validatorresult';

/**
 * Test module for ValidatorResult
 */
describe('ValidatorResult', () => {
    describe('constructor()', () => {
        it('defaults to false when no isValid is passed', () => {
            let valResult: ValidatorResult = new ValidatorResult();
            expect(valResult.isValid).to.be.false;
        });

        it('assigns isValid when passed', () => {
            let valResult: ValidatorResult = new ValidatorResult(true);
            expect(valResult.isValid).to.be.true;
        });

        it('assigns a single error', () => {
            let valResult: ValidatorResult = new ValidatorResult(false, 'foo');
            expect(valResult.errors).to.be.an('array').of.length(1).and.have.members(['foo']);
        });
    });
});