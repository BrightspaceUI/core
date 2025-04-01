import '../switch-visibility.js';
import { clickElem, expect, fixture, html, runConstructor } from '@brightspace-ui/testing';

describe('d2l-switch-visibility', () => {

	it('should construct', () => {
		runConstructor('d2l-switch-visibility');
	});

	it('clicking the tooltip help icon should not toggle the switch', async() => {
		const elem = await fixture(html`
			<d2l-switch-visibility on>
				These are some conditions that must be met for the activity to be visible.
				<ul>
					<li> Condition 1 </li>
					<li> Condition 2 </li>
					<li> Condition 3 </li>
				</ul>
			</d2l-switch-visibility>
		`);
		await clickElem(elem.shadowRoot.querySelector('d2l-tooltip-help'));
		expect(elem.on).to.be.true;
	});

});
