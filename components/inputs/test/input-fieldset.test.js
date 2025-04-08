import '../input-fieldset.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';
import { createMessage } from '../../../mixins/property-required/property-required-mixin.js';

describe('d2l-input-fieldset', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-fieldset');
		});

	});

	describe('validation', () => {
		it('should throw when label is missing', async() => {
			const elem = await fixture(html`<d2l-input-fieldset></d2l-input-fieldset>`);
			expect(() => elem.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(elem, 'label'));
		});

		it('should not throw when label is provided', async() => {
			const elem = await fixture(html`<d2l-input-fieldset label="fieldset"></d2l-input-fieldset>`);
			expect(() => elem.flushRequiredPropertyErrors()).to.not.throw();
		});
	});

});
