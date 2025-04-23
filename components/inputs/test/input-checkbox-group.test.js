import '../input-checkbox.js';
import '../input-checkbox-group.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';
import { createMessage } from '../../../mixins/property-required/property-required-mixin.js';

describe('d2l-input-checkbox-group', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-checkbox-group');
		});

	});

	describe('validation', () => {
		it('should throw when label is missing', async() => {
			const elem = await fixture(html`<d2l-input-checkbox-group></d2l-input-checkbox-group>`);
			expect(() => elem.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(elem, 'label'));
		});

		it('should not throw when label is provided', async() => {
			const elem = await fixture(html`<d2l-input-checkbox-group label="group"></d2l-input-checkbox-group>`);
			expect(() => elem.flushRequiredPropertyErrors()).to.not.throw();
		});
	});

});
