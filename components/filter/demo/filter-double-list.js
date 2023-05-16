import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import { html, LitElement } from 'lit';

class FilterFullManualSearch extends LitElement {

	constructor() {
		super();
		this._selectedFilters = {};
	}

	render() {
		return html`
			<d2l-filter @d2l-filter-change="${this._handleFilterChange}" @d2l-filter-dimension-first-open="${this._handleFirstOpen}" @d2l-filter-dimension-search="${this._handleSearch}">
				<d2l-filter-dimension-set key="full-manual" text="Full Manual" search-type="full-manual" header-text="Related Skills at D2L" selected-first>
					<d2l-filter-dimension-set-value key="communication" text="Communication"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="management" text="Management"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="leadership" text="Leadership"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="planning" text="Planning"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="data" text="Data Analysis"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="research" text="Research"></d2l-filter-dimension-set-value>
				</d2l-filter-dimension-set>
			</d2l-filter>
		`;
	}

	_handleFilterChange(e) {
		const dimension = e.detail.dimensions[0];
		console.log(`Filter selection(s) changed for dimension "${dimension.dimensionKey}":`, dimension.changes); // eslint-disable-line no-console
		if (dimension.cleared) console.log(`(Dimension "${dimension.dimensionKey}" cleared)`); // eslint-disable-line no-console

		if (dimension.cleared) {
			this._selectedFilters = {};
		} else {
			dimension.changes.forEach(change => {
				if (change.selected) {
					this._selectedFilters[change.valueKey] = true;
				} else {
					delete this._selectedFilters[change.valueKey];
				}
			});
		}
	}

	_handleFirstOpen(e) {
		// eslint-disable-next-line no-console
		console.log(`Filter dimension opened for the first time: ${e.detail.key}`);
	}

	_handleSearch(e) {
		const values = this.shadowRoot.querySelectorAll('d2l-filter-dimension-set-value');

		const keysToDisplay = [];
		if (e.detail.value === '') {
			keysToDisplay.push('communication', 'leadership', 'data');
			for (const selectedItem of Object.keys(this._selectedFilters)) {
				if (!keysToDisplay.includes(selectedItem)) keysToDisplay.push(selectedItem);
			}
		} else {
			values.forEach(value => {
				if (value.text.toLowerCase().indexOf(e.detail.value.toLowerCase()) > -1) {
					keysToDisplay.push(value.key);
				}
			});
		}

		setTimeout(() => {
			e.detail.searchCompleteCallback(keysToDisplay);
			// eslint-disable-next-line no-console
			console.log(`Filter dimension "${e.detail.key}" searched: ${e.detail.value}`);
		}, 2000);

	}

}
customElements.define('d2l-filter-full-manual-search', FilterFullManualSearch);
