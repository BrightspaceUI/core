import '../../tooltip/tooltip.js';
import '../card-footer-link.js';
import { expect, fixture, focusElem, html, oneEvent } from '@brightspace-ui/testing';

describe('card-footer-link', () => {
	[
		{ name: 'no-secondary', template: html`
			<d2l-card-footer-link id="no-secondary" icon="tier1:gear" text="Settings" href="https://www.d2l.com">
				<d2l-tooltip class="vdiff-include" slot="tooltip" for="no-secondary">No new settings</d2l-tooltip>
			</d2l-card-footer-link>
		` },
		{ name: 'secondary-notification', template: html`
			<d2l-card-footer-link id="secondary-notification" icon="tier1:gear" text="Settings" href="https://www.d2l.com" secondary-count="100" secondary-count-type="notification">
				<d2l-tooltip class="vdiff-include" slot="tooltip" for="secondary-notification">100 new settings</d2l-tooltip>
			</d2l-card-footer-link>
		` },
		{ name: 'secondary-count', template: html`
			<d2l-card-footer-link id="secondary-count" icon="tier1:gear" tooltip-text="text here" text="Settings" href="https://www.d2l.com" secondary-count="100" secondary-count-max-digits="2" secondary-count-type="count">
				<d2l-tooltip class="vdiff-include" slot="tooltip" for="secondary-count">100 settings applied</d2l-tooltip>
			</d2l-card-footer-link>
		` }
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});

		it(`${name}-focus`, async() => {
			const elem = await fixture(template);
			focusElem(elem);
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});
	});
});
