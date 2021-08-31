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

	static get properties() {
		return {
			_displayedData: { attribute: false, type: Array }
		};
	}

	constructor() {
		super();
		this._fullData = initialData;
		this._displayedData = initialData;
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
					${this._displayedData.map(value => html`
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
			if (change.dimension !== 'event') return;

			this._fullData.find(value => value.key === change.value.key).selected = change.value.selected;
			this._displayedData.find(value => value.key === change.value.key).selected = change.value.selected;
		});
	}

	_handleFirstOpen(e) {
		// eslint-disable-next-line no-console
		console.log(`Filter dimension opened for the first time: ${e.detail.key}`);
	}

	_handleSearch(e) {
		if (e.detail.key !== 'event') return;

		const displayedData = [];
		this._fullData.forEach(value => {
			if (e.detail.value === '') {
				displayedData.push(value);
			} else {
				if (value.text.toLowerCase().indexOf(e.detail.value.toLowerCase()) > -1) {
					displayedData.push(value);
				}
			}
		});

		this._displayedData = displayedData;

		setTimeout(() => {
			e.detail.searchCompleteCallback();
			// eslint-disable-next-line no-console
			console.log(`Filter dimension "${e.detail.key}" searched: ${e.detail.value}`);
		}, 2000);

	}

}
customElements.define('d2l-filter-search-demo', FilterSearchDemo);
