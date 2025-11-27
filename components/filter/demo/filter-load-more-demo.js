import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import '../filter-overflow-group.js';
import { html, LitElement } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

const FullData = [
	{
		key: 'course',
		text: 'Course',
		values: [
			{ key: 'art', selected:false, text: 'Art' },
			{ key: 'astronomy', selected:false, text: 'Astronomy' },
			{ key: 'biology', selected:true, text: 'Biology' },
			{ key: 'chemistry', selected:false, text: 'Chemistry' },
			{ key: 'drama', selected:false, text: 'Drama' },
			{ key: 'english', selected:false, text: 'English' },
			{ key: 'how-to', selected:false, text: 'How To Write a How To Article With a Flashy Title' },
			{ key: 'math', selected:false, text: 'Math' },
			{ key: 'physics', selected:false, text: 'Physics' },
			{ key: 'stats', selected:false, text: 'Statistics' },
			{ key: 'writerscraft', selected:true, text: 'Writer\'s Craft' },
		],
		loadCount: 6
	},
	{
		key: 'role',
		text: 'Role',
		values: [
			{ key: 'admin', selected:false, text: 'Admin' },
			{ key: 'instructor', selected:false, text: 'Instructor' },
			{ key: 'student', selected:false, text: 'Student' }
		],
		loadCount: 2
	},
	{
		key: 'dep',
		text: 'Department',
		values: [
			{ key: 'english', selected:false, text: 'English' },
			{ key: 'spanish', selected:false, text: 'Spanish' },
			{ key: 'science', selected:false, text: 'Science' }
		],
		loadCount: 2
	},
	{
		key: 'grad',
		text: 'Grade Level',
		values: [
			{ key: '1', selected:false, text: '1st Grade' },
			{ key: '2', selected:false, text: '2nd Grade' },
			{ key: '3', selected:false, text: '3rd Grade' }
		],
		loadCount: 2
	}
	,
	{
		key: 'city',
		text: 'City',
		values: [
			{ key: '1', selected:false, text: '1st City' },
			{ key: '2', selected:false, text: '2nd City' },
			{ key: '3', selected:false, text: '3rd City' }
		],
		loadCount: 2
	}
];

class FilterLoadMoreDemo extends LitElement {

	static get properties() {
		return {
			useOverflowGroup: { type: Boolean, attribute: 'use-overflow-group' }
		};
	}

	constructor() {
		super();
		this._dimensions = FullData.map(dim => ({ ...dim }));
	}

	render() {
		if (this.useOverflowGroup) return html`<d2l-filter-overflow-group min-to-show="0">
			${repeat(this._dimensions, dimension => dimension.key, dimension => html`<d2l-filter
				@d2l-filter-change="${this._handleFilterChange}"
				@d2l-filter-dimension-load-more=${this._handleLoadMore}
				@d2l-filter-dimension-search=${this._handleSearch}>
				${this._renderDimensionSet(dimension)}
			</d2l-filter>`)}
		</d2l-filter-overflow-group>`;
		return html`
			<d2l-filter
				@d2l-filter-change="${this._handleFilterChange}"
				@d2l-filter-dimension-load-more=${this._handleLoadMore}
				@d2l-filter-dimension-search=${this._handleSearch}>
				${repeat(this._dimensions, dimension => dimension.key, dimension => this._renderDimensionSet(dimension))}
			</d2l-filter>
		`;
	}

	_addKeys(dimension, addCount, searchValue = '') {
		dimension.loadCount += addCount;
		const keys = dimension.values.filter(val => this._textIsInSearch(searchValue, val.text));
		const selectedKeys = [];
		const unselectedKeys = [];
		for (const val of keys) {
			if (val.selected) {
				selectedKeys.push(val.key);
			} else {
				unselectedKeys.push(val.key);
			}
		}

		dimension.loadCount = Math.max(selectedKeys.length, dimension.loadCount);
		dimension.hasMore = keys.length > dimension.loadCount;

		return selectedKeys.concat(unselectedKeys).slice(0, dimension.loadCount);
	}

	_handleFilterChange(e) {
		e.detail.dimensions.forEach(dimension => {
			const localData = Object.values(this._dimensions.find(dim => dim.key === dimension.dimensionKey).values);
			const FullDataValues = FullData.find(dim => dim.key === dimension.dimensionKey).values;
			if (dimension.cleared) {
				localData.forEach(value => value.selected = false);
				FullDataValues.forEach(value => value.selected = false);
			} else {
				dimension.changes.forEach(change => {
					localData.find(value => value.key === change.valueKey).selected = change.selected;
					FullDataValues.find(value => value.key === change.valueKey).selected = change.selected;
				});
			}
		});
		this.requestUpdate();
	}

	async _handleLoadMore(e) {
		const dimensionKey = e.detail.key;
		const dimension = this._dimensions.find(dim => dim.key === dimensionKey);

		const keysToDisplay = this._addKeys(dimension, 2, e.detail.value);
		this.requestUpdate();
		await this.updateComplete;
		e.detail.loadMoreCompleteCallback({ keysToDisplay });
	}

	async _handleSearch(e) {
		const dimensionKey = e.detail.key;
		const dimension = this._dimensions.find(dim => dim.key === dimensionKey);
		const dimData = FullData.find(dim => dim.key === dimensionKey);

		dimension.loadCount = 0;
		const keysToDisplay = this._addKeys(dimension, dimData.loadCount, e.detail.value);

		this.requestUpdate();
		await this.updateComplete;
		e.detail.searchCompleteCallback({ keysToDisplay });
	}

	_renderDimensionSet(dimension) {
		const { values, key, text, hasMore } = dimension;

		return html`
		<d2l-filter-dimension-set key="${key}" text="${text}" ?has-more="${hasMore}" search-type="manual">
			${repeat(Object.values(values).sort((a, b) => (a.text < b.text ? -1 : 0)), value => value.key, value => html`
				<d2l-filter-dimension-set-value
					key="${value.key}"
					text="${value.text}"
					?selected=${value.selected}>
				</d2l-filter-dimension-set-value>
			`)}
		</d2l-filter-dimension-set>`;
	}

	_textIsInSearch(searchValue, text) {
		return searchValue === '' || text.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
	}

}
customElements.define('d2l-filter-load-more-demo', FilterLoadMoreDemo);

