import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import '../filter-tags.js';
import { clickElem, expect, fixture, html, oneEvent, sendKeys, sendKeysElem } from '@brightspace-ui/testing';

const singleFilter = html`
	<d2l-filter id="filter">
		<d2l-filter-dimension-set key="1" text="Category 1">
			<d2l-filter-dimension-set-value selected text="Value 1 - 1" key="1"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value text="Value 1 - 2" key="2"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value selected text="Value 1 - 3" key="3"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value selected text="Value 1 - 4" key="4"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value selected text="Value 1 - 5" key="5"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value selected text="Value 1 - 6" key="6"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
		<d2l-filter-dimension-set key="2" text="Category 2" value-only-active-filter-text>
			<d2l-filter-dimension-set-value selected text="Value 2 - 1" key="1"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value text="Value 2 - 2" key="2"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value selected text="Value 2 - 3" key="3"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>
`;
const twoFilters = (moreSelected) => html`
	<d2l-filter id="filter-1">
		<d2l-filter-dimension-set key="1" text="Category 1">
			<d2l-filter-dimension-set-value selected text="Value 1 - 1" key="1"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
		<d2l-filter-dimension-set key="2" text="Category 2">
			<d2l-filter-dimension-set-value text="Value 2 - 1" key="1"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>
	<d2l-filter id="filter-2">
		<d2l-filter-dimension-set key="1" text="Category" value-only-active-filter-text>
			<d2l-filter-dimension-set-value selected text="Value" key="1"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value ?selected="${moreSelected}" text="Value 2" key="2"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value ?selected="${moreSelected}" text="Value 3" key="3"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>
`;

const tagsSingleFilter = html`
	<div style="display: flex; justify-content: space-between;">
		<d2l-filter-tags filter-ids="filter" style="align-self: center; position: relative; width: 100%;"></d2l-filter-tags>
		${singleFilter}
	</div>
`;
const tagsFlexEndSingleFilter = html`
	<div>
		${singleFilter}
		<div id="capture" style="display: flex; justify-content: flex-end;">
			<d2l-filter-tags filter-ids="filter"></d2l-filter-tags>
		</div>
	</div>
`;
const tagsTwoFilters = html`
	<div style="display: flex; justify-content: space-between;">
		<d2l-filter-tags filter-ids="filter-1 filter-2" style="align-self: center; position: relative; width: 100%;"></d2l-filter-tags>
		${twoFilters()}
	</div>
`;

const tagsTwoFiltersMoreSelected = html`
	<div style="display: flex; justify-content: space-between;">
		<d2l-filter-tags filter-ids="filter-1 filter-2" style="align-self: center; position: relative; width: 100%;"></d2l-filter-tags>
		${twoFilters(true)}
	</div>
`;

describe('filter-tags', () => {
	[
		{ name: 'two-filters', template: tagsTwoFilters },
		{ name: 'flex-end', template: tagsFlexEndSingleFilter, selector: '#capture' },
		{ name: 'basic-rtl', rtl: true, template: tagsSingleFilter },
		{ name: 'two-filters-rtl', rtl: true, template: tagsTwoFilters }
	].forEach(({ name, template, rtl, selector }) => {
		it(name, async() => {
			let elem = await fixture(template, { rtl, viewport: { width: 1700 } });
			if (selector) elem = elem.querySelector(selector);
			await expect(elem).to.be.golden();
		});
	});

	[1500, 980, 969, 601, 599, 400, 320].forEach((width) => {
		describe('basic width', () => {
			let elem;
			beforeEach(async() => {
				elem = await fixture(tagsSingleFilter, { viewport: { width: width + 216 } }); // account for filter and page padding
			});

			it(`${width}`, async() => {
				await expect(elem).to.be.golden();
			});

			it(`${width} show more button clicked`, async() => {
				const filterTags = elem.querySelector('d2l-filter-tags');
				const tagList = filterTags.shadowRoot.querySelector('d2l-tag-list');
				const showMoreButton = tagList.shadowRoot.querySelector('.d2l-tag-list-button');

				if (showMoreButton) await clickElem(showMoreButton);
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('clearable behavior', () => {
		it('deleting the first item', async() => {
			const elem = await fixture(tagsSingleFilter, { viewport: { width: 1700 } });
			const filterTags = elem.querySelector('d2l-filter-tags');
			const items = filterTags.shadowRoot.querySelectorAll('d2l-tag-list-item');
			const deleteButton = items[0].shadowRoot.querySelector('d2l-button-icon');

			clickElem(deleteButton);
			await oneEvent(elem, 'd2l-filter-change');
			await expect(elem).to.be.golden();
		});

		it('deleting the last item', async() => {
			const elem = await fixture(tagsSingleFilter, { viewport: { width: 1700 } });
			const filterTags = elem.querySelector('d2l-filter-tags');
			const items = filterTags.shadowRoot.querySelectorAll('d2l-tag-list-item');
			const deleteButton = items[6].shadowRoot.querySelector('d2l-button-icon');

			clickElem(deleteButton);
			await oneEvent(elem, 'd2l-filter-change');
			await expect(elem).to.be.golden();
		});

		it('deleting second item', async() => {
			const elem = await fixture(tagsSingleFilter, { viewport: { width: 1700 } });

			await sendKeysElem(elem.querySelector('d2l-filter-tags'), 'press', 'Tab');
			await sendKeys('press', 'ArrowRight');
			sendKeys('press', 'Delete');
			await oneEvent(elem, 'd2l-filter-change');
			await expect(elem).to.be.golden();
		});

		[
			{ name: 'clicking clear all', template: tagsSingleFilter },
			{ name: 'clicking clear all with two filters', template: tagsTwoFiltersMoreSelected }
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template, { viewport: { width: 1700 } });
				const filterTags = elem.querySelector('d2l-filter-tags');
				const tagList = filterTags.shadowRoot.querySelector('d2l-tag-list');
				const clearAllButton = tagList.shadowRoot.querySelector('d2l-button-subtle.d2l-tag-list-clear-button');

				await clickElem(clearAllButton);
				await expect(elem).to.be.golden();
			});
		});
	});
});
