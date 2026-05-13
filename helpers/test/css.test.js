import { _isValidCssSelector } from '../internal/css.js';
import { expect } from '@brightspace-ui/testing';

describe('_isValidCssSelector', () => {
	it('should return true for valid selectors', () => {
		expect(_isValidCssSelector('input[type="checkbox"].d2l-input-checkbox')).to.be.true;
		expect(_isValidCssSelector('input[type="checkbox"]')).to.be.true;
		expect(_isValidCssSelector('.d2l-input-checkbox')).to.be.true;
		expect(_isValidCssSelector('.d2l-link')).to.be.true;
	});
});
