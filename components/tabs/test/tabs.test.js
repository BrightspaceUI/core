import '../tab.js';
import '../tabs.js';
import '../tab-panel.js';
import '../demo/tabs-array.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { mockFlag, resetFlag } from '../../../helpers/flags.js';
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

		afterEach(() => resetFlag('GAUD-8605-tab-no-initial-selected-event'));

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

		it('dispatches d2l-tab-selected on initial render when no tab selected by consumer', async() => {
			let eventFired = false;

			document.addEventListener('d2l-tab-selected', () => {
				eventFired = true;
			});
			await fixture(normalFixture);

			expect(eventFired).to.equal(true);
		});

		it('does not dispatch d2l-tab-selected on initial render when consumer has selected tab (flag enabled)', async() => {
			mockFlag('GAUD-8605-tab-no-initial-selected-event', true);
			let eventFired = false;

			document.addEventListener('d2l-tab-selected', () => {
				eventFired = true;
			});

			await fixture(html`
				<div>
					<d2l-tabs>
						<d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
						<d2l-tab id="biology" text="Biology" slot="tabs" selected></d2l-tab>
						<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
					</d2l-tabs>
				</div>
			`);

			expect(eventFired).to.equal(false);
		});

		// remove test with GAUD-8605-tab-no-initial-selected-event clean up
		it('dispatches d2l-tab-selected on initial render when consumer has selected tab (flag disabled)', async() => {
			mockFlag('GAUD-8605-tab-no-initial-selected-event', false);
			let eventFired = false;

			document.addEventListener('d2l-tab-selected', () => {
				eventFired = true;
			});
			await fixture(html`
				<div>
					<d2l-tabs>
						<d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
						<d2l-tab id="biology" text="Biology" slot="tabs" selected></d2l-tab>
						<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
					</d2l-tabs>
				</div>
			`);

			expect(eventFired).to.equal(true);
		});

		it('does not dispatch d2l-tab-selected if already selected', async() => {
			const el = await fixture(normalFixture);
			let dispatched = false;
			el.addEventListener('d2l-tab-selected', () => dispatched = true);

			const tab = el.querySelectorAll('d2l-tab')[0]; // first tab is selected by default
			await clickElem(tab);
			expect(tab.selected).to.equal(true);
			expect(dispatched).to.equal(false);
		});

		it('dispatches d2l-tab-content-change', async() => {
			const el = await fixture(normalFixture);
			const tab = el.querySelector('d2l-tab');
			setTimeout(() => tab.setAttribute('text', 'new text'));
			await oneEvent(tab, 'd2l-tab-content-change');
		});

		it('does not dispatch d2l-tab-before-selected if already selected', async() => {
			const el = await fixture(normalFixture);
			let dispatched = false;
			el.addEventListener('d2l-tab-before-selected', () => dispatched = true);

			const tab = el.querySelectorAll('d2l-tab')[0]; // first tab is selected by default
			await clickElem(tab);
			expect(tab.selected).to.equal(true);
			expect(dispatched).to.equal(false);
		});

		describe('consumer manages state', () => {

			it('click with no state management', async() => {
				const el = await fixture(normalFixture);
				el.addEventListener('d2l-tab-before-selected', (e) => {
					e.preventDefault();
				});
				const tab = el.querySelectorAll('d2l-tab')[1];
				await clickElem(tab);
				expect(tab.selected).to.equal(false);
			});

			it('click with state management', async() => {
				const el = await fixture(normalFixture);
				el.addEventListener('d2l-tab-before-selected', (e) => {
					e.preventDefault();
					e.detail.select();
				});
				const tab = el.querySelectorAll('d2l-tab')[1];
				await clickElem(tab);
				expect(tab.selected).to.equal(true);
			});
		});

	});

	describe('behavior', () => {

		function checkIfSelected(tab, isSelected, panel) {
			expect(tab.selected).to.equal(isSelected);
			expect(tab.tabIndex).to.equal(isSelected ? 0 : -1);
			expect(tab.ariaSelected).to.equal(isSelected.toString());

			if (panel) {
				expect(panel.selected).to.equal(isSelected);
			}
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

		it('should set selected tab to first tab if no tab is selected', async() => {
			const el = await fixture(html`
				<div>
					<d2l-tabs>
						<d2l-tab id="all" text="All" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
						<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
						<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
					</d2l-tabs>
				</div>
			`);
			const tabs = el.querySelectorAll('d2l-tab');
			checkIfSelected(tabs[0], true);
		});

		it('should set selected tab to second tab if no tab is selected and first tab is being removed', async() => {
			const el = await fixture(html`
				<div>
					<d2l-tabs>
						<d2l-tab id="all" text="All" slot="tabs" data-state="removing"></d2l-tab>
						<d2l-tab-panel labelled-by="all" slot="panels">Tab content for All</d2l-tab-panel>
						<d2l-tab id="biology" text="Biology" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="biology" slot="panels">Tab content for Biology</d2l-tab-panel>
						<d2l-tab id="chemistry" text="Chemistry" slot="tabs"></d2l-tab>
						<d2l-tab-panel labelled-by="chemistry" slot="panels">Tab content for Chemistry</d2l-tab-panel>
					</d2l-tabs>
				</div>
			`);
			const tabs = el.querySelectorAll('d2l-tab');
			checkIfSelected(tabs[0], false);
			checkIfSelected(tabs[1], true);
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

		it('should only have one panel selected at a time when tabs selected in an array', async() => {
			const el = await fixture(html`<d2l-tabs-array></d2l-tabs-array>`);
			const tabs = el.shadowRoot.querySelectorAll('d2l-tab');
			await clickElem(tabs[2]);
			checkIfSelected(tabs[0], false, el.shadowRoot.querySelectorAll('d2l-tab-panel')[0]);
			checkIfSelected(tabs[2], true, el.shadowRoot.querySelectorAll('d2l-tab-panel')[2]);
		});
	});
});
