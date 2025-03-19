import '../tab.js';
import '../tabs.js';
import '../tab-panel.js';
import { fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

const defaultFixture = html`
	<div>
		<d2l-tabs>
			<d2l-tab-panel text="All">Tab content for All</d2l-tab-panel>
			<d2l-tab-panel text="Biology">Tab content for Biology</d2l-tab-panel>
			<d2l-tab-panel text="Chemistry">Tab content for Chemistry</d2l-tab-panel>
		</d2l-tabs>
	</div>
`;

const normalFixture = html`
<div>
	<d2l-tabs>
		<d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
		<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
		<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
		<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
		<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
		<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
	</d2l-tabs>
</div>
`;

describe('d2l-tabs', () => {

	describe('constructor', () => {

		it('should construct tabs', () => {
			runConstructor('d2l-tabs');
		});

		it('should construct tab-panel', () => {
			runConstructor('d2l-tab-panel');
		});

		it('should construct tab', () => {
			runConstructor('d2l-tab');
		});

	});

	describe('events', () => {

		// remove after d2l-tab/d2l-tab-panel backport
		it('dispatches d2l-tab-panel-selected', async() => {
			const el = await fixture(defaultFixture);
			const panel = el.querySelectorAll('d2l-tab-panel')[1];
			setTimeout(() => panel.selected = true);
			await oneEvent(panel, 'd2l-tab-panel-selected');
		});

		// remove after d2l-tab/d2l-tab-panel backport
		it('dispatches d2l-tab-panel-text-changed', async() => {
			const el = await fixture(defaultFixture);
			const panel = el.querySelector('d2l-tab-panel');
			setTimeout(() => panel.setAttribute('text', 'new text'));
			await oneEvent(panel, 'd2l-tab-panel-text-changed');
		});

		it('dispatches d2l-tab-selected', async() => {
			const el = await fixture(normalFixture);
			const tab = el.querySelectorAll('d2l-tab')[1];
			setTimeout(() => tab.selected = true);
			const tabs = el.querySelector('d2l-tabs');
			await oneEvent(tabs, 'd2l-tab-selected');
		});

	});

});
