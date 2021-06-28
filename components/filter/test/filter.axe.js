import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

const singleSetDimensionFixture = html`
	<d2l-filter>
		<d2l-filter-dimension-set key="dim" text="Dim">
			<d2l-filter-dimension-set-value key="value" text="Value"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>`;
const multiDimensionFixture = html`
	<d2l-filter>
		<d2l-filter-dimension-set key="1" text="Dim 1">
			<d2l-filter-dimension-set-value key="1" text="Value 1"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
		<d2l-filter-dimension-set key="2" text="Dim 2">
			<d2l-filter-dimension-set-value key="1" text="Value 1"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>`;

describe('d2l-filter', () => {
	[
		{ name: 'Single set dimension', fixture: singleSetDimensionFixture },
		{ name: 'Multiple dimensions', fixture: multiDimensionFixture }
	].forEach(test => {
		it(`${test.name}`, async() => {
			const elem = await fixture(test.fixture);
			await expect(elem).to.be.accessible();
		});

		it(`${test.name} opened`, async() => {
			const elem = await fixture(test.fixture);
			const dropdown = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');
			const dropdownContent = elem.shadowRoot.querySelector('d2l-dropdown-content') || elem.shadowRoot.querySelector('d2l-dropdown-menu');
			await dropdownContent.updateComplete;
			dropdown.toggleOpen();
			await oneEvent(dropdown, 'd2l-dropdown-open');
			await expect(elem).to.be.accessible();
		});
	});

	it.skip('Multiple dimensions drilling in', async() => {
		const elem = await fixture(multiDimensionFixture);
		const dropdown = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');
		const menuItem = elem.shadowRoot.querySelector('d2l-menu-item');
		dropdown.toggleOpen();
		await oneEvent(dropdown, 'd2l-dropdown-open');
		menuItem.click();
		await oneEvent(dropdown, 'd2l-hierarchical-view-show-complete');
		await expect(elem).to.be.accessible();
	});

});
