import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
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
		initialCount: 6
	},
	{
		key: 'role',
		text: 'Role',
		values: [
			{ key: 'admin', selected:false, text: 'Admin' },
			{ key: 'instructor', selected:false, text: 'Instructor' },
			{ key: 'student', selected:false, text: 'Student' }
		],
		initialCount: 2
	}
];

class FilterLoadMoreDemo extends LitElement {

	constructor() {
		super();
		const dimensions = [];
		for (const dim of FullData) {
			const values =  {};
			let selectedCount = 0;
			for (const v of dim.values)  {
				if (!v.selected) continue;
				values[v.key] = { ...v };
				selectedCount++;
			}
			const data = {
				key: dim.key,
				text: dim.text,
				values
			};
			this._addKeys(data, dim.initialCount - selectedCount);
			dimensions.push(data);
		}
		this._dimensions = dimensions;
	}

	render() {
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
		const dimData = FullData.find(dim => dim.key === dimension.key);

		const keys = [];
		for (const valKey in dimension.values) {
			if (this._textIsInSearch(searchValue, dimension.values[valKey].text)) {
				keys.push(valKey);
			}
		}
		const total = keys.length + addCount;
		dimension.hasMore = false;
		for (const v of dimData.values) {
			if (v.key in dimension.values || !this._textIsInSearch(searchValue, v.text)) continue;
			if (total <= keys.length) {
				dimension.hasMore = true;
				break;
			}
			dimension.values[v.key] = { ...v };
			keys.push(v.key);
		}
		return keys;
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

	_handleLoadMore(e) {
		const dimensionKey = e.detail.key;
		const dimension = this._dimensions.find(dim => dim.key === dimensionKey);

		const keysToDisplay = this._addKeys(dimension, 2, e.detail.value);
		e.detail.loadMoreCompleteCallback({ keysToDisplay });
		this.requestUpdate();
	}

	_handleSearch(e) {
		const dimensionKey = e.detail.key;
		const dimension = this._dimensions.find(dim => dim.key === dimensionKey);
		const dimData = FullData.find(dim => dim.key === dimensionKey);

		let selectedCount = 0;
		for (const valKey in dimension.values) {
			if (!dimension.values[valKey].selected) delete dimension.values[valKey];
			else if (this._textIsInSearch(e.detail.value, dimension.values[valKey].text)) selectedCount++;
		}
		const keysToDisplay = this._addKeys(dimension, dimData.initialCount - selectedCount, e.detail.value);

		e.detail.searchCompleteCallback({ keysToDisplay });
		this.requestUpdate();
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

