import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import { html, LitElement } from 'lit-element/lit-element.js';

const initialData = [
	{ key: 'admin', text: 'Admin', selected: false },
	{ key: 'instructor', text: 'Instructor', selected: true },
	{ key: 'student', text: 'Student', selected: false }
];

class FilterSearchDemo extends LitElement {

	constructor() {
		super();
		this._fullData = Array.from(initialData);
		this._fullDataSingle = Array.from(initialData);
	}

	render() {
		return html`
			<d2l-filter @d2l-filter-change="${this._handleFilterChange}" @d2l-filter-dimension-first-open="${this._handleFirstOpen}" @d2l-filter-dimension-search="${this._handleSearch}">
				<d2l-filter-dimension-set key="none" text="No Search" search-type="none">
					<d2l-filter-dimension-set-value key="admin" text="Admin"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="instructor" text="Instructor"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="student" text="Student"></d2l-filter-dimension-set-value>
				</d2l-filter-dimension-set>
				<d2l-filter-dimension-set key="none-select-all" text="No Search and Select All" search-type="none" select-all>
					<d2l-filter-dimension-set-value key="admin" text="Admin"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="instructor" text="Instructor"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="student" text="Student"></d2l-filter-dimension-set-value>
				</d2l-filter-dimension-set>
				<d2l-filter-dimension-set key="event" text="Event on Search" search-type="manual">
					${this._fullData.map(value => html`
						<d2l-filter-dimension-set-value key="${value.key}" text="${value.text}" ?selected="${value.selected}"></d2l-filter-dimension-set-value>
					`)}
				</d2l-filter-dimension-set>
				<d2l-filter-dimension-set key="event-single" text="Event on Search - Single" search-type="manual" selection-single>
					${this._fullDataSingle.map(value => html`
						<d2l-filter-dimension-set-value key="${value.key}" text="${value.text}" ?selected="${value.selected}"></d2l-filter-dimension-set-value>
					`)}
				</d2l-filter-dimension-set>
				<d2l-filter-dimension-set key="auto" text="Automatic Search" search-type="automatic">
					<d2l-filter-dimension-set-value key="admin" text="Admin"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="instructor" text="Instructor"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="student" text="Student"></d2l-filter-dimension-set-value>
				</d2l-filter-dimension-set>
			</d2l-filter>
		`;
	}

	_handleFilterChange(e) {
		(e.detail.changes.length === 1) ?
			console.log(`Filter selection changed for dimension "${e.detail.changes[0].dimension}":`, e.detail.changes[0].value) : // eslint-disable-line no-console
			console.log('Batch filter selection changed:', e.detail.changes); // eslint-disable-line no-console

		e.detail.changes.forEach(change => {
			if (change.dimension === 'event') {
				this._fullData.find(value => value.key === change.value.key).selected = change.value.selected;
			} else if (change.dimension === 'event-single') {
				this._fullDataSingle.find(value => value.key === change.value.key).selected = change.value.selected;
			}
		});
	}

	_handleFirstOpen(e) {
		// eslint-disable-next-line no-console
		console.log(`Filter dimension opened for the first time: ${e.detail.key}`);
	}

	_handleSearch(e) {
		if (!e.detail.key.includes('event')) return;

		const keysToDisplay = [];
		this._fullData.forEach(value => {
			if (value.text.toLowerCase().indexOf(e.detail.value.toLowerCase()) > -1) {
				keysToDisplay.push(value.key);
			}
		});

		setTimeout(() => {
			e.detail.searchCompleteCallback(keysToDisplay);
			// eslint-disable-next-line no-console
			console.log(`Filter dimension "${e.detail.key}" searched: ${e.detail.value}`);
		}, 2000);

	}

}
customElements.define('d2l-filter-search-demo', FilterSearchDemo);
