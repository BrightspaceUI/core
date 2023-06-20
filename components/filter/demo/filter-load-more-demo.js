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
					{ key: 'art', text: 'Art' },
					{ key: 'astronomy', text: 'Astronomy' },
					{ key: 'biology', text: 'Biology' },
					{ key: 'chemistry', text: 'Chemistry' },
					{ key: 'drama', text: 'Drama' },
					{ key: 'english', text: 'English' },
					{ key: 'how-to', text: 'How To Write a How To Article With a Flashy Title' },
					{ key: 'math', text: 'Math' },
					{ key: 'physics', text: 'Physics' },
					{ key: 'stats', text: 'Statistics' },
					{ key: 'writerscraft', text: 'Writer\'s Craft' },
				],
				lastLoadedIndex: 5,
			},
			{
				key: 'role',
				text: 'Role',
				items: [
					{ key: 'admin', text: 'Admin' },
					{ key: 'instructor', text: 'Instructor' },
					{ key: 'student', text: 'Student' }
				],
				lastLoadedIndex: 1,
			}
		];
	}

	render() {
		return html`
			<d2l-filter @d2l-filter-dimension-load-more=${this._handleLoadMore}>
				${repeat(this._fullData, dimension => dimension.key, dimension => this._renderDimensionSet(dimension))}
			</d2l-filter>
		`;
	}

	_handleLoadMore(e) {
		const dimensionKey = e.detail.dimensionKey;
		const dimension = this._fullData.find(dim => dim.key === dimensionKey);
		if (dimension.lastLoadedIndex < dimension.items.length - 1) {
			dimension.lastLoadedIndex += 2;
			this.requestUpdate();
		}
		e.detail.complete();
	}

	_renderDimensionSet(dimension) {
		const items = dimension.items;
		const loadedItems = dimension.lastLoadedIndex >=  items - 1 ? items : items.slice(0, dimension.lastLoadedIndex);

		return html`<d2l-filter-dimension-set key="${dimension.key}" text="${dimension.text}" ?pager-has-more="${loadedItems.length < items.length}">
			${repeat(loadedItems, item => item.key, item => html`
				<d2l-filter-dimension-set-value key="${item.key}" text="${item.text}"></d2l-filter-dimension-set-value>
			`)}
		</d2l-filter-dimension-set>`;
	}

}
customElements.define('d2l-filter-load-more-demo', FilterLoadMoreDemo);

