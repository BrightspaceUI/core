import '../../validation/validation-custom.js';
import './form-element.js';

import { defineCE, expect, fixture } from '@brightspace-ui/testing';
import { html, LitElement } from 'lit';
import { LocalizeCoreElement } from '../../../helpers/localize-core-element.js';
import { localizeFormElement } from '../form-element-localize-helper.js';

const formTag = defineCE(
	class extends LocalizeCoreElement(LitElement) {}
);

const formFixture = `<${formTag}></${formTag}`;

describe('form-element-localize-helper', () => {

	let localize;

	beforeEach(async() => {
		const form = await fixture(formFixture);
		localize = form.localize.bind(form);
	});

	describe('basic', () => {

		const inputFixture = html`<input type="text"/>`;

		let input;

		beforeEach(async() => {
			input = await fixture(inputFixture);
		});

		it('should localize required error', async() => {
			input.required = true;
			const errorMessage = localizeFormElement(localize, input);
			expect(errorMessage).to.equal('Field is required.');
		});

		it('should localize unknown error', async() => {
			input.pattern = '[A-Za-z]{3}';
			input.value = 'A';
			const errorMessage = localizeFormElement(localize, input);
			expect(errorMessage).to.equal('Field is invalid.');
		});

	});

	describe('input', () => {

		describe('number', () => {

			const inputFixture = html`<input type="number"/>`;

			let input;

			beforeEach(async() => {
				input = await fixture(inputFixture);
			});

			it('should localize range underflow error', async() => {
				input.min = '100';
				input.value = '10';

				const errorMessage = localizeFormElement(localize, input);
				expect(errorMessage).to.equal('Number must be greater than or equal to 100.');
			});

			it('should localize range overflowflow error', async() => {
				input.max = '9';
				input.value = '100';

				const errorMessage = localizeFormElement(localize, input);
				expect(errorMessage).to.equal('Number must be less than or equal to 9.');
			});

		});

		describe('url', () => {

			const inputFixture = html`<input type="url"/>`;

			let input;

			beforeEach(async() => {
				input = await fixture(inputFixture);
			});

			it('should localize type mismatch error', async() => {
				input.value = 'notaurl';

				const errorMessage = localizeFormElement(localize, input);
				expect(errorMessage).to.equal('URL is not valid');
			});

		});

		describe('email', () => {

			const inputFixture = html`<input aria-label="Contact" type="email"/>`;

			let input;

			beforeEach(async() => {
				input = await fixture(inputFixture);
			});

			it('should localize type mismatch error', async() => {
				input.value = 'notanemail';

				const errorMessage = localizeFormElement(localize, input);
				expect(errorMessage).to.equal('Email is not valid');
			});

		});

	});

});
