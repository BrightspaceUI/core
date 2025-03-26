import '../tab.js';
import '../tabs.js';
import '../tab-panel.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { spy } from 'sinon';

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

		it('dispatches d2l-tab-content-change', async() => {
			const el = await fixture(normalFixture);
			const tab = el.querySelector('d2l-tab');
			setTimeout(() => tab.setAttribute('text', 'new text'));
			await oneEvent(tab, 'd2l-tab-content-change');
		});

	});

	describe('behavior', () => {

		function checkIfSelected(tab, isSelected) {
			expect(tab.selected).to.equal(isSelected);
			expect(tab.tabIndex).to.equal(isSelected ? 0 : -1);
			expect(tab.ariaSelected).to.equal(isSelected.toString());
		}

		it('should only have one panel selected at a time even if multiple have selected attribute', async() => {
			const el = await fixture(html`
				<div>
					<d2l-tabs>
						<d2l-tab id="all" text="All" slot="tabs" selected></d2l-tab>
						<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
						<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
						<d2l-tab id="chemistry" text="Chemistry" slot="tabs" selected></d2l-tab>
						<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
					</d2l-tabs>
				</div>
			`);
			const tabs = el.querySelectorAll('d2l-tab');
			checkIfSelected(tabs[0], true);
			checkIfSelected(tabs[2], false);
		});

		it('should update selection properties on new selection', async() => {
			const el = await fixture(html`
				<div>
					<d2l-tabs>
						<d2l-tab id="all" text="All" slot="tabs" selected></d2l-tab>
						<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
						<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
						<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
					</d2l-tabs>
				</div>
			`);
			const tabs = el.querySelectorAll('d2l-tab');
			await clickElem(tabs[2]);
			checkIfSelected(tabs[0], false);
			checkIfSelected(tabs[2], true);
		});

		it('should warn if number of tabs does not equal number of panels', async() => {
			const consoleSpy = spy(console, 'warn');
			await fixture(html`
				<div>
					<d2l-tabs>
						<d2l-tab id="all" text="All" slot="tabs" selected></d2l-tab>
						<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
						<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
						<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
					</d2l-tabs>
				</div>
			`);
			expect(consoleSpy.called).to.be.true;
			consoleSpy.restore();
		});

		it('should warn if tab does not have corresponding panel due to missing labelled-by', async() => {
			const consoleSpy = spy(console, 'warn');
			await fixture(html`
				<div>
					<d2l-tabs>
						<d2l-tab id="all" text="All" slot="tabs" selected></d2l-tab>
						<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
						<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
						<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
						<d2l-tab-panel slot="panels">Tab content for Chemistry</d2l-tab-panel>
					</d2l-tabs>
				</div>
			`);
			expect(consoleSpy.called).to.be.true;
			consoleSpy.restore();
		});

		it('should warn if tab does not have corresponding panel due to missing id', async() => {
			const consoleSpy = spy(console, 'warn');
			await fixture(html`
				<div>
					<d2l-tabs>
						<d2l-tab id="all" text="All" slot="tabs" selected></d2l-tab>
						<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
						<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
						<d2l-tab text="Chemistry" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
					</d2l-tabs>
				</div>
			`);
			expect(consoleSpy.called).to.be.true;
			consoleSpy.restore();
		});
	});
});
