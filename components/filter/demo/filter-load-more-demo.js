import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import { html, LitElement } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

class FilterLoadMoreDemo extends LitElement {

	constructor() {
		super();
		this._fullData = [
			{
				key: 'course',
				text: 'Course',
				items: [
					{ key: 'art', selected:false, text: 'Art' },
					{ key: 'astronomy', selected:false, text: 'Astronomy' },
					{ key: 'biology', selected:false, text: 'Biology' },
					{ key: 'chemistry', selected:false, text: 'Chemistry' },
					{ key: 'drama', selected:false, text: 'Drama' },
					{ key: 'english', selected:false, text: 'English' },
					{ key: 'how-t selected:false,o', text: 'How To Write a How To Article With a Flashy Title' },
					{ key: 'math', selected:false, text: 'Math' },
					{ key: 'physics', selected:false, text: 'Physics' },
					{ key: 'stats', selected:false, text: 'Statistics' },
					{ key: 'writerscraft', selected:false, text: 'Writer\'s Craft' },
				],
				searchValue: '',
				initialCount: 6,
				currentCount: 6,
				hasMore: true
			},
			{
				key: 'role',
				text: 'Role',
				items: [
					{ key: 'admin', selected:false, text: 'Admin' },
					{ key: 'instructor', selected:false, text: 'Instructor' },
					{ key: 'student', selected:false, text: 'Student' }
				],
				searchValue:'',
				initialCount: 2,
				currentCount: 2,
				hasMore: true
			}
		];
	}

	render() {
		return html`
			<d2l-filter 
				@d2l-filter-change="${this._handleFilterChange}"
				@d2l-filter-dimension-load-more=${this._handleLoadMore}
				@d2l-filter-dimension-search=${this._handleSearch}>
				${repeat(this._fullData, dimension => dimension.key, dimension => this._renderDimensionSet(dimension))}
			</d2l-filter>
		`;
	}

	_getKeysToDisplay(dimension) {
		const keysToDisplay = [];
		let loadCount = dimension.currentCount;

		dimension.hasMore = false;
		for (const value of dimension.items) {
			if (value.text.toLowerCase().indexOf(dimension.searchValue.toLowerCase()) > -1) {
				if (loadCount > 0) {
					keysToDisplay.push(value.key);
					loadCount--;
				} else {
					dimension.hasMore = true;
					break;
				}
			}
		}

		return keysToDisplay;
	}

	_handleFilterChange(e) {
		e.detail.dimensions.forEach(dimension => {
			const dataToUpdate = this._fullData.find(dim => dim.key === dimension.dimensionKey).items;
			if (dimension.cleared) {
				dataToUpdate.forEach(value => value.selected = false);
			} else {
				dimension.changes.forEach(change => { dataToUpdate.find(value => value.key === change.valueKey).selected = change.selected; });
			}
		});
		this.requestUpdate();
	}

	_handleLoadMore(e) {
		const dimensionKey = e.detail.dimensionKey;
		const dimension = this._fullData.find(dim => dim.key === dimensionKey);
		dimension.currentCount += 2;

		const keysToDisplay = this._getKeysToDisplay(dimension);
		e.detail.complete(keysToDisplay);
		this.requestUpdate();
	}

	_handleSearch(e) {
		const dimensionKey = e.detail.key;
		const dimension = this._fullData.find(dim => dim.key === dimensionKey);

		dimension.searchValue = e.detail.value;
		dimension.currentCount = dimension.initialCount;
		const keysToDisplay = this._getKeysToDisplay(dimension);
		e.detail.searchCompleteCallback({ keysToDisplay });
		this.requestUpdate();
	}

	_renderDimensionSet(dimension) {
		const { items, key, text, hasMore } = dimension;

		return html`
		<d2l-filter-dimension-set key="${key}" text="${text}" ?pager-has-more="${hasMore}" search-type="manual">
			${repeat(items, item => item.key, item => html`
				<d2l-filter-dimension-set-value
					key="${item.key}"
					text="${item.text}"
					?selected=${item.selected}>
				</d2l-filter-dimension-set-value>
			`)}
		</d2l-filter-dimension-set>`;
	}

}
customElements.define('d2l-filter-load-more-demo', FilterLoadMoreDemo);

