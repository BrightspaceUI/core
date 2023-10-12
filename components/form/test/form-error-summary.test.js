import '../form-errory-summary.js';
import { expect, fixture, runConstructor } from '@brightspace-ui/testing';
import { html } from 'lit';

const errorSummaryFixture = html`<d2l-form-error-summary></d2l-form-error-summary>`;

describe('d2l-form-error-summary', () => {

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

		// flaky on Firefox
		it.skip('should focus first error', async() => {
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
