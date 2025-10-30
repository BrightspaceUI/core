import '../alert.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-alert', () => {

	[
		'default',
		'warning',
		'critical',
		'success',
		'call-to-action',
		'error'
	].forEach((testCase) => {
		it(`passes aXe tests for type "${testCase}"`, async() => {
			/**
			 * @type {'default'|'critical'|'success'|'warning'}
			 */
			const type = testCase;
			const el = await fixture(html`<d2l-alert type="${type}">message</d2l-alert>`);
			await expect(el).to.be.accessible();
		});
	});

	it('accessible with action button only', async() => {
		const el = await fixture(html`<d2l-alert type="default" button-text="Act">Message</d2l-alert>`);
		await expect(el).to.be.accessible();
	});

	it('accessible with close button only', async() => {
		const el = await fixture(html`<d2l-alert type="default" has-close-button>Message</d2l-alert>`);
		await expect(el).to.be.accessible();
	});

	it('accessible with action + close + subtext', async() => {
		const el = await fixture(html`<d2l-alert type="success" button-text="Resolve" has-close-button subtext="More details about the success state.">Success!</d2l-alert>`);
		await expect(el).to.be.accessible();
	});

	it('accessible with action + close + subtext + no-padding', async() => {
		const el = await fixture(html`<d2l-alert type="critical" button-text="Undo" has-close-button no-padding subtext="Critical information requiring attention.">Problem occurred.</d2l-alert>`);
		await expect(el).to.be.accessible();
	});

	it('has no unintended default role', async() => {
		const el = await fixture(html`<d2l-alert type="default">Message</d2l-alert>`);
		expect(el.hasAttribute('role')).to.be.false; // explicit contract: no ARIA role unless added later
		await expect(el).to.be.accessible();
	});

	it('stacked alerts container accessible', async() => {
		const el = await fixture(html`<div>
			<d2l-alert type="default">One</d2l-alert>
			<d2l-alert type="success" button-text="Act">Two</d2l-alert>
			<d2l-alert type="critical" has-close-button subtext="Further detail for three.">Three</d2l-alert>
		</div>`);
		await expect(el).to.be.accessible();
	});

});
