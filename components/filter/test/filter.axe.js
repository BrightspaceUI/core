import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

const singleSetDimensionFixture = html`
	<d2l-filter>
		<d2l-filter-dimension-set key="dim" introductory-text="Intro" header-text="Header" text="Dim" select-all>
			<d2l-filter-dimension-set-value key="value-1" text="Value 1"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="value-2" text="Value 2" selected></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>`;
const singleSetDimensionSingleSelectionOnFixture = html`
	<d2l-filter>
		<d2l-filter-dimension-set key="dim" text="Dim" selection-single>
			<d2l-filter-dimension-set-value key="value-1" text="Value 1"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="value-2" text="Value 2" selected></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>`;
const multiDimensionFixture = html`
	<d2l-filter>
		<d2l-filter-dimension-set key="1" introductory-text="Intro" text="Dim 1" select-all>
			<d2l-filter-dimension-set-value key="1" text="Value 1"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
		<d2l-filter-dimension-set key="2" header-text="Header" text="Dim 2" select-all>
			<d2l-filter-dimension-set-value key="1" text="Value 1"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>`;

describe('d2l-filter', () => {
	[
		{ name: 'Single set dimension', fixture: singleSetDimensionFixture },
		{ name: 'Single set dimension - single selection', fixture: singleSetDimensionSingleSelectionOnFixture },
		{ name: 'Multiple dimensions', fixture: multiDimensionFixture }
	].forEach(test => {
		it(`${test.name}`, async() => {
			const elem = await fixture(test.fixture);
			await expect(elem).to.be.accessible();
		});

		it(`${test.name} opened`, async() => {
			const elem = await fixture(test.fixture);
			const dropdown = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');

			elem.opened = true;
			await oneEvent(dropdown, 'd2l-dropdown-open');
			await expect(elem).to.be.accessible({ ignoredRules: ['aria-roles', 'aria-required-children', 'aria-required-parent'] }); // d2l-list's grid mode does not apply the grid roles because of lack of iOS support
		});
	});

	it('Multiple dimensions drilling in', async() => {
		const elem = await fixture(multiDimensionFixture);
		const dropdown = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');
		const menuItem = elem.shadowRoot.querySelector('d2l-menu-item');

		elem.opened = true;
		await oneEvent(dropdown, 'd2l-dropdown-open');
		menuItem.click();
		await oneEvent(dropdown, 'd2l-hierarchical-view-show-complete');
		await expect(elem).to.be.accessible({ ignoredRules: ['aria-roles', 'aria-required-children', 'aria-required-parent'] }); // d2l-list's grid mode does not apply the grid roles because of lack of iOS support
	});

});
