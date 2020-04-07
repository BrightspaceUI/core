import '../tabs.js';
import '../tab-panel.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

const normalFixture = html`
	<div>
		<d2l-tabs>
			<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
			<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
			<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
		</d2l-tabs>
	</div>
`;

describe('d2l-tabs', () => {

	describe('accessibility', () => {

		it('passes all aXe tests', async() => {
			const el = await fixture(normalFixture);
			await expect(el).to.be.accessible();
		});

	});

	describe('events', () => {

		it('dispatches d2l-tab-panel-selected', async() => {
			const el = await fixture(normalFixture);
			const panel = el.querySelectorAll('d2l-tab-panel')[1];
			setTimeout(() => panel.selected = true);
			await oneEvent(panel, 'd2l-tab-panel-selected');
		});

		it('dispatches d2l-tab-panel-text-changed', async() => {
			const el = await fixture(normalFixture);
			const panel = el.querySelector('d2l-tab-panel');
			setTimeout(() => panel.setAttribute('text', 'new text'));
			await oneEvent(panel, 'd2l-tab-panel-text-changed');
		});

	});

});
