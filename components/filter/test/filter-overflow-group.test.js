import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import '../filter-overflow-group.js';
import { aTimeout, expect, fixture, html, oneEvent, runConstructor, waitUntil } from '@brightspace-ui/testing';

describe('d2l-filter-overflow-group', () => {
	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-filter-overflow-group');
		});
	});

	describe('dynamically add/remove filters', () => {

		it('append', async() => {
			const container = await fixture(html`<d2l-filter-overflow-group>
					<d2l-filter>
						<d2l-filter-dimension-set key="skill1" text="Skill1">
							<d2l-filter-dimension-set-value key="communication1" text="Fall"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="leadership1" text="Winter"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
					<d2l-filter>
						<d2l-filter-dimension-set key="skill2" text="Skill2">
							<d2l-filter-dimension-set-value key="communication1" text="Fall"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="leadership1" text="Winter"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
				</d2l-filter-overflow-group>
			`);
			const newFilter = document.createElement('d2l-filter');
			container.appendChild(newFilter);
			await oneEvent(container, 'd2l-overflow-group-updated');
		});

		it('remove', async() => {
			const container = await fixture(html`<d2l-filter-overflow-group>
					<d2l-filter>
						<d2l-filter-dimension-set key="skill1" text="Skill1">
							<d2l-filter-dimension-set-value key="communication1" text="Fall"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="leadership1" text="Winter"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
					<d2l-filter id="last">
						<d2l-filter-dimension-set key="skill2" text="Skill2">
							<d2l-filter-dimension-set-value key="communication1" text="Fall"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="leadership1" text="Winter"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
				</d2l-filter-overflow-group>
			`);
			const lastFilter = container.querySelector('#last');
			container.removeChild(lastFilter);
			await oneEvent(container, 'd2l-overflow-group-updated');
		});

	});

	describe('events', () => {
		it('should dispatch d2l-filter-change event from original filter', async() => {
			const elem = await fixture(html`<d2l-filter-overflow-group max-to-show="1">
					<d2l-filter>
						<d2l-filter-dimension-set key="skill1" text="Skill1">
							<d2l-filter-dimension-set-value key="communication1" text="Fall"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="leadership1" text="Winter"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
					<d2l-filter id="last">
						<d2l-filter-dimension-set key="skill2" text="Skill2">
							<d2l-filter-dimension-set-value key="communication2" text="Fall"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="leadership2" text="Winter"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
				</d2l-filter-overflow-group>
			`);

			const overflowFilter = elem.shadowRoot.querySelector('d2l-filter');
			const value = overflowFilter.shadowRoot.querySelector('d2l-list-item[key="communication2"');

			setTimeout(() => value.setSelected(true)); // update the copy
			const originalFilter = elem.querySelector('d2l-filter#last');
			await oneEvent(originalFilter, 'd2l-filter-change');
		});

		it('should dispatch d2l-filter-load-more event from original filter', async() => {
			const elem = await fixture(html`<d2l-filter-overflow-group max-to-show="1">
					<d2l-filter>
						<d2l-filter-dimension-set key="skill1" text="Skill1">
							<d2l-filter-dimension-set-value key="communication1" text="Fall"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="leadership1" text="Winter"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
					<d2l-filter id="last">
						<d2l-filter-dimension-set key="skill2" text="Skill2" has-more search-type="manual">
							<d2l-filter-dimension-set-value key="communication2" text="Fall"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="leadership2" text="Winter"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
				</d2l-filter-overflow-group>
			`);
			const overflowFilter = elem.shadowRoot.querySelector('d2l-filter');
			const loadMore = overflowFilter.shadowRoot.querySelector('d2l-pager-load-more');
			await loadMore.updateComplete;
			setTimeout(() => loadMore.shadowRoot.querySelector('button').click());

			const e = await oneEvent(elem, 'd2l-filter-dimension-load-more');
			expect(e.detail.key).to.equal('skill2');
		});
	});

	describe('tags', () => {
		let filterOverflowGroup, filterTags;

		beforeEach(async() => {
			filterOverflowGroup = await fixture(html`
				<d2l-filter-overflow-group tags>
					<d2l-filter>
						<d2l-filter-dimension-set key="skill1" text="Skill1">
							<d2l-filter-dimension-set-value key="communication1" text="Fall"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="leadership1" text="Winter"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
					<d2l-filter id="filter-2">
						<d2l-filter-dimension-set key="skill2" text="Skill2">
							<d2l-filter-dimension-set-value key="communication1" text="Fall"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="leadership1" text="Winter"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>
				</d2l-filter-overflow-group>
			`);
			filterTags = filterOverflowGroup.querySelector('d2l-filter-tags');
			await waitUntil(() => filterTags.filterIds, 'Filter Ids not set');
		});

		it('should be correct when filter has id', async() => {
			const filterIds = filterTags.getAttribute('filter-ids');
			const filtersSplit = filterIds.split(' ');
			expect(filtersSplit.length).to.equal(2);
			expect(filtersSplit[1]).to.equal('filter-2');
		});

		it('should be correct when new filter appended', async() => {
			const newFilter = document.createElement('d2l-filter');
			filterOverflowGroup.appendChild(newFilter);
			await oneEvent(filterOverflowGroup, 'd2l-overflow-group-updated');
			await waitUntil(() => filterTags.filterIds, 'Filter Ids not set');
			await filterTags.updateComplete;
			await aTimeout(500); // test is flaky without timeout
			const filtersSplit = filterTags.getAttribute('filter-ids').split(' ');
			await waitUntil(() => filtersSplit.length === 3, 'Filter Ids not updated');

			expect(filtersSplit[1]).to.equal('filter-2');
		});
	});

});
