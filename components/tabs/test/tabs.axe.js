import '../tab.js';
import '../tabs.js';
import '../tab-panel.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-tabs', () => {

	it('passes all aXe tests, default structure', async() => {
		const el = await fixture(html`
			<d2l-tabs>
				<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
				<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
				<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
			</d2l-tabs>`);
		await expect(el).to.be.accessible();
	});

	it('passes all aXe tests', async() => {
		const el = await fixture(html`
			<d2l-tabs>
				<d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
				<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
				<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
				<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
				<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
				<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
			</d2l-tabs>`);
		await expect(el).to.be.accessible();
	});

	it('adds aria-controls to the tabs', async() => {
		const el = await fixture(html`
			<d2l-tabs>
				<d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
				<d2l-tab-panel labelled-by="all" slot="panels" id="all-panel">Tab content for All</d2l-tab-panel>
				<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
				<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
				<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
				<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
			</d2l-tabs>`);
		expect(el.querySelector('#all').getAttribute('aria-controls')).to.equal('all-panel');
		expect(el.querySelector('#biology').hasAttribute('aria-controls'));

		const attr = el.querySelector('#biology').getAttribute('aria-controls');
		expect(typeof attr).to.equal('string');
	});

	it('adds aria-labelledby to the panels', async() => {
		const el = await fixture(html`
			<d2l-tabs>
				<d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
				<d2l-tab-panel labelled-by="all" slot="panels" id="all-panel">Tab content for All</d2l-tab-panel>
				<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
				<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
				<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
				<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
			</d2l-tabs>`);
		expect(el.querySelector('#all-panel').getAttribute('aria-labelledby')).to.equal('all');
	});

});
