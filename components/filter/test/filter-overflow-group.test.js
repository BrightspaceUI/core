import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import '../filter-overflow-group.js';
import { aTimeout, expect, fixture, html, nextFrame, oneEvent, runConstructor, waitUntil } from '@brightspace-ui/testing';

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

	describe('search and load more', () => {
		let elem, filters, jointFilter;
		beforeEach(async() => {
			const onSearch = e => {
				e.target.querySelector('d2l-filter-dimension-set').innerHTML = '';
			};

			const onLoadMore = e => {
				e.target.querySelector('d2l-filter-dimension-set').removeAttribute('has-more');
				e.detail.loadMoreCompleteCallback({ displayAllKeys: true });
			};

			elem = await fixture(html`<d2l-filter-overflow-group min-to-show=0 max-to-show=0>
				<d2l-filter @d2l-filter-dimension-search=${onSearch}>
					<d2l-filter-dimension-set key='units' search-type="manual">
						${new Array(5).map((_, i) => html`<d2l-filter-dimension-set-value key=${i} text="Option ${i}"></d2l-filter-dimension-set-value>`)}
					</d2l-filter-dimension-set>
				</d2l-filter>
				<d2l-filter @d2l-filter-dimension-load-more=${onLoadMore}>
					<d2l-filter-dimension-set key='tens' search-type="manual" has-more>
						${new Array(5).map((_, i) => html`<d2l-filter-dimension-set-value key=${10 * i} text="Option ${10 * i}"></d2l-filter-dimension-set-value>`)}
					</d2l-filter-dimension-set>
				</d2l-filter>
			</d2l-filter-overflow-group>`);

			filters = elem.querySelectorAll('d2l-filter');
			jointFilter = elem.shadowRoot.querySelector('d2l-filter');
		});

		it('should trigger d2l-filter-dimension-load-more on filter elements', async() => {
			const listener1 = oneEvent(filters[0], 'd2l-filter-dimension-load-more');
			jointFilter.requestFilterLoadMoreEvent('units', '');
			const e1 = await listener1;
			expect(e1.detail.key).to.equal('units');

			const listener2 = oneEvent(filters[1], 'd2l-filter-dimension-load-more');
			jointFilter.requestFilterLoadMoreEvent('tens', '');
			const e2 = await listener2;
			expect(e2.detail.key).to.equal('tens');
		});

		it('should trigger d2l-filter-dimension-search on filter elements', async() => {
			const listener1 = oneEvent(filters[0], 'd2l-filter-dimension-search');
			jointFilter.requestFilterSearchEvent('units', '');
			const e1 = await listener1;
			expect(e1.detail.key).to.equal('units');

			const listener2 = oneEvent(filters[1], 'd2l-filter-dimension-search');
			jointFilter.requestFilterSearchEvent('tens', '');
			const e2 = await listener2;
			expect(e2.detail.key).to.equal('tens');
		});

		it('should update filter on search', async() => {
			filters[0].requestFilterSearchEvent('units', 'searching');
			await nextFrame();
			await elem.updateComplete;
			expect(jointFilter._dimensions[0].values.length).to.equal(0);
		});

		it('should update filter on load more', async() => {
			filters[1].requestFilterLoadMoreEvent('tens', '');
			await nextFrame();
			await elem.updateComplete;
			expect(jointFilter._dimensions[1].hasMore).to.equal(false);
		});
	});

});
