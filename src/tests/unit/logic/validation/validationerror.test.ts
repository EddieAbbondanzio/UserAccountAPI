import { expect } from 'chai';
import 'mocha';
import { ValidatorResult } from '../../../../logic/validation/validatorresult';
import { ValidationError } from '../../../../logic/validation/validationerror';

/**
 * Test module for ValidationErrors
 */
describe('ValidationError', () => {
    describe('constructor()', () => {
        it('assigns the message', () => {
            let valError: ValidationError = new ValidationError('error message');
            expect(valError.message).to.be.a('string').that.equals('error message');
        });

        it('assigns the validatorResult', () => {
            let valResult: ValidatorResult = new ValidatorResult(false, 'error');
            let valError: ValidationError = new ValidationError('error message', valResult);

            expect(valError.validatorResult).to.equal(valResult);
        });
    });
});