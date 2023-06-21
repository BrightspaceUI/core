import '../tooltip-help.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

const tooltipFixture = html`<d2l-tooltip-help text="Helpful label.">Contents should elaborate on the label (be short and concise)</d2l-tooltip-help>`;

describe('d2l-tooltip-help', () => {

	it('should pass all aXe tests (hide)', async() => {
		const helpTooltip = await fixture(tooltipFixture);

		await expect(helpTooltip).to.be.accessible();
	});

	it('should pass all aXe tests for state info (show)', async() => {
		const helpTooltip = await fixture(tooltipFixture);
		const actualTooltip = helpTooltip.shadowRoot.querySelector('d2l-tooltip');

		actualTooltip.setAttribute('state', 'info');
		actualTooltip.setAttribute('showing', 'showing');

		await actualTooltip.updateComplete;
		await expect(helpTooltip).to.be.accessible();
	});

	it('should pass all aXe tests when the opener is focused', async() => {
		const helpTooltip = await fixture(tooltipFixture);

		setTimeout(() => helpTooltip.focus());

		await oneEvent(helpTooltip, 'focus');
		await expect(helpTooltip).to.be.accessible();
	});

});
