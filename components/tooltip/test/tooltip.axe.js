import '../tooltip.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-tooltip', () => {

	let tooltipFixture, tooltip;

	beforeEach(async() => {
		tooltipFixture = await fixture(html`
			<div>
				<div id="implicit-target" tabindex="-1" role="button">
					<button id="explicit-target">Hover me for tips</button>
					<d2l-tooltip for="explicit-target" for-type="descriptor">If I got a problem then a problem's got a problem.</d2l-tooltip>
				</div>
			</div>
		`);
		tooltip = tooltipFixture.querySelector('d2l-tooltip');
	});

	it('should pass all aXe tests (hide)', async() => {
		await expect(tooltip).to.be.accessible();
	});

	[
		'info',
		'error'
	].forEach(state => {
		it(`should pass all aXe tests for state ${state} (show)`, async() => {
			tooltip.setAttribute('state', state);
			tooltip.setAttribute('showing', 'showing');
			await tooltip.updateComplete;
			await expect(tooltip).to.be.accessible();
		});
	});

});
