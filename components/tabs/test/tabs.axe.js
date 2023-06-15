import '../tabs.js';
import '../tab-panel.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-tabs', () => {

	it('passes all aXe tests', async() => {
		const el = await fixture(html`
			<d2l-tabs>
				<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
				<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
				<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
			</d2l-tabs>`);
		await expect(el).to.be.accessible();
	});

});
