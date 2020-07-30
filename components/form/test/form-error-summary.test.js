import '../form-errory-summary.js';
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit-element/lit-element.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const errorSummaryFixture = html`<d2l-form-error-summary></d2l-form-error-summary>`;

describe('form-error-summary', () => {

	let errorSummary;

	beforeEach(async() => {
		errorSummary = await fixture(errorSummaryFixture);
	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-form-error-summary');
		});

	});

	describe('focus', () => {

		it('should focus first error', async() => {
			errorSummary.errors = [
				{ href: '#first-error', message: 'An error occured' },
				{ href: '#second-error', message: 'A different error occured' }
			];
			await errorSummary.updateComplete;

			await errorSummary.focus();

			const firstError = errorSummary.shadowRoot.querySelector('[href="#first-error"]');
			expect(errorSummary.shadowRoot.activeElement).to.equal(firstError);
		});

	});

	describe('click', () => {

		it('should trigger callback when error is clicked', async() => {
			let clicked = false;
			errorSummary.errors = [
				{ href: '#first-error', message: 'An error occured', onClick: () => clicked = true },
			];
			await errorSummary.updateComplete;

			const firstError = errorSummary.shadowRoot.querySelector('[href="#first-error"]');
			firstError.click();

			expect(clicked).to.be.true;
		});

	});

});
