import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import '../filter-tags.js';
import { expect, fixture, html, waitUntil } from '@brightspace-ui/testing';

const basicFixture = html`
	<div>
		<d2l-filter id="filter">
			<d2l-filter-dimension-set key="1" text="Category 1">
				<d2l-filter-dimension-set-value selected text="Value 1 - 1" key="1"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value text="Value 1 - 2" key="2"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value text="Value 1 - 3" key="3"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value selected text="Value 1 - 4" key="4"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value text="Value 1 - 5" key="5"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value selected text="Value 1 - 6" key="6"></d2l-filter-dimension-set-value>
			</d2l-filter-dimension-set>
			<d2l-filter-dimension-set key="2" text="Category 2" value-only-active-filter-text>
				<d2l-filter-dimension-set-value selected text="Value 2 - 1" key="1"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value text="Value 2 - 2" key="2"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value text="Value 2 - 3" key="3"></d2l-filter-dimension-set-value>
			</d2l-filter-dimension-set>
		</d2l-filter>
		<d2l-filter-tags filter-ids="filter"></d2l-filter-tags>
	</div>
`;

const emptyFixture = html`
	<div>
		<d2l-filter id="empty-filter">
			<d2l-filter-dimension-set key="1" text="Category 1">
				<d2l-filter-dimension-set-value text="Value 1 - 5" key="5"></d2l-filter-dimension-set-value>
			</d2l-filter-dimension-set>
			</d2l-filter>
		<d2l-filter-tags filter-ids="empty-filter"></d2l-filter-tags>
	</div>
`;

describe('d2l-filter-tags', () => {

	it('basic', async() => {
		const elem = await fixture(basicFixture);
		const filterTags = elem.querySelector('d2l-filter-tags');
		await filterTags.updateComplete;
		await waitUntil(() => filterTags._allActiveFilters.get('filter').length === 4, 'Active filters were not set');

		await expect(elem).to.be.accessible();
	});

	it('empty', async() => {
		const elem = await fixture(emptyFixture);
		const filterTags = elem.querySelector('d2l-filter-tags');
		await filterTags.updateComplete;

		await expect(elem).to.be.accessible();
	});

});
