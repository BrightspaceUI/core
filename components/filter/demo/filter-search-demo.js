import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import { html, LitElement } from 'lit';

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
		this._fullDataInitialSubset = Array.from(initialData);
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
				<d2l-filter-dimension-set key="event" text="Event on Search" select-all search-type="manual">
					${this._fullData.map(value => html`
						<d2l-filter-dimension-set-value key="${value.key}" text="${value.text}" ?selected="${value.selected}"></d2l-filter-dimension-set-value>
					`)}
				</d2l-filter-dimension-set>
				<d2l-filter-dimension-set key="event-single" text="Event on Search - Single" search-type="manual" selection-single>
					${this._fullDataSingle.map(value => html`
						<d2l-filter-dimension-set-value key="${value.key}" text="${value.text}" ?selected="${value.selected}"></d2l-filter-dimension-set-value>
					`)}
				</d2l-filter-dimension-set>
				<d2l-filter-dimension-set key="event-initial-subset" text="Event on Search - Initial Subset" search-type="manual" header-text="Related Roles at D2L" selected-first>
					${this._fullDataInitialSubset.map(value => html`
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
		if (e.detail.dimensions.length === 1) {
			console.log(`Filter selection(s) changed for dimension "${e.detail.dimensions[0].dimensionKey}":`, e.detail.dimensions[0].changes); // eslint-disable-line no-console
			if (e.detail.dimensions[0].cleared) console.log(`(Dimension "${e.detail.dimensions[0].dimensionKey}" cleared)`); // eslint-disable-line no-console
		} else {
			console.log('Multiple dimension selections changed:', e.detail.dimensions); // eslint-disable-line no-console
		}

		e.detail.dimensions.forEach(dimension => {
			if (!dimension.dimensionKey.includes('event')) return;

			const dataToUpdateMap = {
				'event': this._fullData,
				'event-single': this._fullDataSingle,
				'event-initial-subset': this._fullDataInitialSubset,
			};
			const dataToUpdate = [...dataToUpdateMap[dimension.dimensionKey]];
			if (dimension.cleared) {
				dataToUpdate.forEach(value => value.selected = false);
			} else {
				dimension.changes.forEach(change => { dataToUpdate.find(value => value.key === change.valueKey).selected = change.selected; });
			}
		});

		if (e.detail.allCleared) {
			console.log('(All dimensions cleared)'); // eslint-disable-line no-console
		}
	}

	_handleFirstOpen(e) {
		// eslint-disable-next-line no-console
		console.log(`Filter dimension opened for the first time: ${e.detail.key}`);
	}

	_handleSearch(e) {
		if (!e.detail.key.includes('event')) return;

		let keysToDisplay = [];
		if (e.detail.key === 'event-initial-subset') keysToDisplay = this._performInitialSubsetSearch(e.detail.value);
		else {
			this._fullData.forEach(value => {
				if (value.text.toLowerCase().indexOf(e.detail.value.toLowerCase()) > -1) {
					keysToDisplay.push(value.key);
				}
			});
		}

		setTimeout(() => {
			e.detail.searchCompleteCallback({ keysToDisplay: keysToDisplay });
			// eslint-disable-next-line no-console
			console.log(`Filter dimension "${e.detail.key}" searched: ${e.detail.value}`);
		}, 2000);

	}

	_performInitialSubsetSearch(searchValue) {
		const initialSubset = ['admin', 'instructor'];
		let keysToDisplay = [];
		if (searchValue === '') {
			keysToDisplay = initialSubset;
			this._fullDataInitialSubset.forEach(value => {
				if (value.selected) {
					if (!keysToDisplay.includes(value.key)) keysToDisplay.push(value.key);
				}
			});
		} else {
			this._fullDataInitialSubset.forEach(value => {
				if (value.text.toLowerCase().indexOf(searchValue.toLowerCase()) > -1) {
					keysToDisplay.push(value.key);
				}
			});
		}
		return keysToDisplay;
	}

}
customElements.define('d2l-filter-search-demo', FilterSearchDemo);
