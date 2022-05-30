import '../tooltip.js';
import '../tooltip-help.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

const tooltipFixture = html`<d2l-tooltip-help text="Hover me for tips">If I got a problem then a problem's got a problem.</d2l-tooltip-help>`;

describe('d2l-tooltip-help', () => {

	it('should pass all aXe tests (hide)', async() => {
		const helpTooltip = await fixture(tooltipFixture);
		await helpTooltip.updateComplete;

		await expect(helpTooltip).to.be.accessible();
	});

	it('should pass all aXe tests for state info (show)', async() => {
		const helpTooltip = await fixture(tooltipFixture);
		await helpTooltip.updateComplete;

		const actualTooltip = helpTooltip.shadowRoot.querySelector('d2l-tooltip');

		actualTooltip.setAttribute('state', 'info');
		actualTooltip.setAttribute('showing', 'showing');

		await actualTooltip.updateComplete;
		await helpTooltip.updateComplete;
		await expect(helpTooltip).to.be.accessible();
	});

	it('should pass all aXe tests when the opener is focused', async() => {
		const helpTooltip = await fixture(tooltipFixture);
		await helpTooltip.updateComplete;
		const actualTooltip = helpTooltip.shadowRoot.querySelector('d2l-tooltip');

		setTimeout(() => actualTooltip.focus());
		actualTooltip.focus();

		await actualTooltip.updateComplete;
		await helpTooltip.updateComplete;
		await oneEvent(actualTooltip, 'focus');
		await expect(helpTooltip).to.be.accessible();
	});

});
