import '../collapsible-panel.js';
import '../collapsible-panel-summary-item.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-collapsible-panel', () => {

	it('should pass all aXe tests', async() => {
		const elem = await fixture(html`
			<d2l-collapsible-panel panel-title="Availability Dates and Conditions">
				<d2l-collapsible-panel-summary-item slot="summary" text="Availability starts 8/16/2022 and ends 8/12/2022"></d2l-collapsible-panel-summary-item>
				<d2l-collapsible-panel-summary-item slot="summary" text="1 release condition"></d2l-collapsible-panel-summary-item>
				<d2l-collapsible-panel-summary-item slot="summary" text="Hidden by special access"></d2l-collapsible-panel-summary-item>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas odio ligula, aliquam efficitur sollicitudin non, dignissim quis nisl. Nullam rutrum, lectus sed finibus consectetur, dolor leo blandit lorem, vitae consectetur arcu enim ornare tortor.
			</d2l-collapsible-panel>
		`);
		await expect(elem).to.be.accessible();
	});

});
