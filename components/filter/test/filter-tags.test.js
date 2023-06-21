import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import '../filter-tags.js';
import { expect, fixture, html, oneEvent, waitUntil } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';
import { spy } from 'sinon';

const basic = html`
	<div>
		<d2l-filter id="filter">
			<d2l-filter-dimension-set key="1" text="Category 1">
				<d2l-filter-dimension-set-value selected text="Value 1 - 1" key="1"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value text="Value 1 - 2" key="2"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value text="Value 1 - 3" key="3"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value selected text="Value 1 - 4" key="4"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value text="Value 1 - 5" key="5"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value text="Value 1 - 6" key="6"></d2l-filter-dimension-set-value>
			</d2l-filter-dimension-set>
			<d2l-filter-dimension-set key="2" text="Category 2" value-only-active-filter-text>
				<d2l-filter-dimension-set-value selected text="Value 2 - 1" key="1"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value text="Value 2 - 2" key="2"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value text="Value 2 - 3" key="3"></d2l-filter-dimension-set-value>
			</d2l-filter-dimension-set>
		</d2l-filter>
		<d2l-filter-tags filter-ids="filter"></d2l-filter-tags>
	</div>`;

const twoFilters = html`
	<div>
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
			</d2l-filter-dimension-set>
		</d2l-filter>
		<d2l-filter-tags filter-ids="filter-1 filter-2"></d2l-filter-tags>
	</div>`;

describe('d2l-filter-tags', () => {

	it('should construct', () => {
		runConstructor('d2l-filter-tags');
	});

	describe('Single filter', () => {
		let filter, filterTags, tagList;

		beforeEach(async() => {
			const elem = await fixture(basic);
			filter = elem.querySelector('d2l-filter');
			filterTags = elem.querySelector('d2l-filter-tags');
			await filter.updateComplete;
			await filterTags.updateComplete;
			await waitUntil(() => filterTags._allActiveFilters.get('filter').length === 3, 'Active filters were not set');

			tagList = filterTags.shadowRoot.querySelector('d2l-tag-list');
			await waitUntil(() => tagList._items, 'Tag list items did not become ready');
		});

		it('instantiating the element works', () => {
			expect('d2l-filter-tags').to.equal(filterTags.tagName.toLowerCase());
		});
		it('attributes are set correctly', () => {
			expect(filterTags.filterIds).to.equal('filter');
		});
		it('instantiates with the selected filters added as tag-list items', async() => {
			const items = filterTags.shadowRoot.querySelectorAll('d2l-tag-list-item');
			expect(items.length).to.equal(3);
			expect(items[0].text).to.equal('Category 1: Value 1 - 1');
			expect(items[1].text).to.equal('Category 1: Value 1 - 4');
			expect(items[2].text).to.equal('Value 2 - 1');
		});
		it('selecting another filter value adds to the list', async() => {
			const updateSpy = spy(filterTags, 'updateActiveFilters');
			const values = filter.querySelectorAll('d2l-filter-dimension-set-value');
			values[1].selected = true;
			await waitUntil(() => updateSpy.callCount > 0, 'Active filters were not updated');

			const items = filterTags.shadowRoot.querySelectorAll('d2l-tag-list-item');
			expect(items.length).to.equal(4);
			expect(items[0].text).to.equal('Category 1: Value 1 - 1');
			expect(items[1].text).to.equal('Category 1: Value 1 - 2');
			expect(items[2].text).to.equal('Category 1: Value 1 - 4');
			expect(items[3].text).to.equal('Value 2 - 1');
		});
		it('removing a filter value removes from the list', async() => {
			const updateSpy = spy(filterTags, 'updateActiveFilters');
			const values = filter.querySelectorAll('d2l-filter-dimension-set-value');
			values[0].selected = false;
			await waitUntil(() => updateSpy.callCount > 0, 'Active filters were not updated');

			const items = filterTags.shadowRoot.querySelectorAll('d2l-tag-list-item');
			expect(items.length).to.equal(2);
			expect(items[0].text).to.equal('Category 1: Value 1 - 4');
			expect(items[1].text).to.equal('Value 2 - 1');
		});
		it('deleting an item from the tag-list deselects the corresponding value from the filter', async() => {
			const values = filter.querySelectorAll('d2l-filter-dimension-set-value');
			expect(values[0].selected).to.be.true;

			const items = filterTags.shadowRoot.querySelectorAll('d2l-tag-list-item');
			setTimeout(() => items[0].shadowRoot.querySelector('d2l-button-icon').click());

			const e = await oneEvent(filter, 'd2l-filter-change');
			const dimensions = e.detail.dimensions;
			expect(dimensions.length).to.equal(1);
			expect(dimensions[0].dimensionKey).to.equal('1');
			const changes = dimensions[0].changes;
			expect(changes.length).to.equal(1);
			expect(changes[0].valueKey).to.equal('1');
			expect(changes[0].selected).to.be.false;
		});

		describe('clear filters button', () => {
			describe('functionality', () => {
				it('selecting a 4th filter & clicking clear filters fires a d2l-filter-change event', async() => {
					const updateSpy = spy(filterTags, 'updateActiveFilters');
					const clearFilters = tagList.shadowRoot.querySelector('d2l-button-subtle.d2l-tag-list-clear-button');
					const values = filter.querySelectorAll('d2l-filter-dimension-set-value');

					values[1].selected = true;
					await waitUntil(() => updateSpy.callCount > 0, 'Active filters were not updated');

					setTimeout(() => clearFilters.click());
					const e = await oneEvent(filter, 'd2l-filter-change');
					expect(e.detail.allCleared).to.be.true;
					const dimensions = e.detail.dimensions;
					expect(dimensions.length).to.equal(2);
					expect(dimensions[0].cleared).to.be.true;
					expect(dimensions[1].cleared).to.be.true;
				});
				it('selecting a 4th filter & clicking clear filters removes filters & removes tag list element', async() => {
					const updateSpy = spy(filterTags, 'updateActiveFilters');
					const clearFilters = tagList.shadowRoot.querySelector('d2l-button-subtle.d2l-tag-list-clear-button');
					const values = filter.querySelectorAll('d2l-filter-dimension-set-value');

					values[1].selected = true;
					await waitUntil(() => updateSpy.callCount === 1, 'Active filters were not updated');

					clearFilters.click();
					await waitUntil(() => updateSpy.callCount === 2, 'Active filters were not updated a second time');

					const filters = filterTags.shadowRoot.querySelectorAll('d2l-tag-list-item');
					expect(filters.length).to.equal(0);
					const updatedTagList = filterTags.shadowRoot.querySelector('d2l-tag-list');
					expect(updatedTagList).to.be.null;
				});
			});
		});
	});

	describe('Multiple filters', () => {
		let filter1, filterTags;

		beforeEach(async() => {
			const elem = await fixture(twoFilters);
			filter1 = elem.querySelector('#filter-1');
			filterTags = elem.querySelector('d2l-filter-tags');
			await filter1.updateComplete;
			await filterTags.updateComplete;
			const activeMap = filterTags._allActiveFilters;
			await waitUntil(() => activeMap.get('filter-1').length === 1 && activeMap.get('filter-2').length === 1, 'Active filters were not set');

			const tagList = filterTags.shadowRoot.querySelector('d2l-tag-list');
			await waitUntil(() => tagList._items, 'Tag list items did not become ready');
		});

		it('instantiates with the selected filters added as tag-list items', async() => {
			expect(filterTags.filterIds).to.equal('filter-1 filter-2');
			const items = filterTags.shadowRoot.querySelectorAll('d2l-tag-list-item');
			expect(items.length).to.equal(2);
			expect(items[0].text).to.equal('Category 1: Value 1 - 1');
			expect(items[1].text).to.equal('Value');
		});
		it('selecting another filter value adds to the list', async() => {
			const updateSpy = spy(filterTags, 'updateActiveFilters');
			const values = filter1.querySelectorAll('d2l-filter-dimension-set-value');
			values[1].selected = true;
			await waitUntil(() => updateSpy.callCount > 0, 'Active filters were not updated');

			expect(filterTags._allActiveFilters.get('filter-1').length).to.equal(2);
			expect(filterTags._allActiveFilters.get('filter-2').length).to.equal(1);
			const items = filterTags.shadowRoot.querySelectorAll('d2l-tag-list-item');
			expect(items.length).to.equal(3);
			expect(items[0].text).to.equal('Category 1: Value 1 - 1');
			expect(items[1].text).to.equal('Category 2: Value 2 - 1');
			expect(items[2].text).to.equal('Value');
		});
		it('removing a filter value removes from the list', async() => {
			const updateSpy = spy(filterTags, 'updateActiveFilters');
			const values = filter1.querySelectorAll('d2l-filter-dimension-set-value');
			values[0].selected = false;
			await waitUntil(() => updateSpy.callCount > 0, 'Active filters were not updated');

			expect(filterTags._allActiveFilters.get('filter-1')).to.be.empty;
			expect(filterTags._allActiveFilters.get('filter-2').length).to.equal(1);
			const items = filterTags.shadowRoot.querySelectorAll('d2l-tag-list-item');
			expect(items.length).to.equal(1);
			expect(items[0].text).to.equal('Value');
		});
		it('deleting an item from the tag list deselects the corresponding value from the filter', async() => {
			const values = filter1.querySelectorAll('d2l-filter-dimension-set-value');
			expect(values[0].selected).to.be.true;

			const items = filterTags.shadowRoot.querySelectorAll('d2l-tag-list-item');
			items[0].shadowRoot.querySelector('d2l-button-icon').click();

			const e = await oneEvent(filter1, 'd2l-filter-change');
			const dimensions = e.detail.dimensions;
			expect(dimensions.length).to.equal(1);
			expect(dimensions[0].dimensionKey).to.equal('1');
			const changes = dimensions[0].changes;
			expect(changes.length).to.equal(1);
			expect(changes[0].valueKey).to.equal('1');
			expect(changes[0].selected).to.be.false;
		});
	});
});
