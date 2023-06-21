import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import '../filter-overflow-group.js';
import { aTimeout, expect, fixture, html, oneEvent, waitUntil } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

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
			await filterOverflowGroup.updateComplete;
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
