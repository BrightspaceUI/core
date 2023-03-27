import '../tag-list/tag-list.js';
import '../tag-list/tag-list-item.js';
import { css, html, LitElement, nothing } from 'lit';
import { IdSubscriberController } from '../../controllers/subscriber/subscriberControllers.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * A tag-list allowing the user to see (and remove) the currently applied filters.
 */

const CLEAR_TIMEOUT = 210; /** Corresponds to timeout in _dispatchChangeEvent in filter + 10 ms */

class FilterTags extends LocalizeCoreElement(LitElement) {
	static get properties() {
		return {
			/**
			 * REQUIRED: Id(s) (space-delimited) of the filter component(s) to subscribe to
			 * @type {string}
			 */
			filterIds: { type: String, attribute: 'filter-ids' }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	constructor() {
		super();

		this._allActiveFilters = new Map();
		this._filters = new IdSubscriberController(this, 'active-filters', {
			idPropertyName: 'filterIds',
			onUnsubscribe: this._removeLostFilter.bind(this)
		});
	}

	render() {
		let numActiveFilters = 0;
		const allActiveFilters = Array.from(this._allActiveFilters);
		const tagListItems = allActiveFilters.map(filter => filter[1].map((value, index) => {
			numActiveFilters++;
			return html`
				<d2l-tag-list-item
					@d2l-tag-list-item-clear="${this._tagListItemDeleted}"
					data-filter-id="${filter[0]}"
					data-index="${index}"
					text="${value.text}">
				</d2l-tag-list-item>
			`;
		}));

		if (numActiveFilters === 0) return nothing;

		return html`
			<d2l-tag-list
				clearable
				clear-focus-timeout="${CLEAR_TIMEOUT}"
				@d2l-tag-list-clear="${this._clearFiltersClicked}"
				description="${this.localize('components.filter.activeFilters')}">
				${tagListItems}
			</d2l-tag-list>
		`;
	}

	updateActiveFilters(filterId, activeFilters) {
		this._allActiveFilters.set(filterId, activeFilters);
		this.requestUpdate();
	}

	_clearFiltersClicked() {
		this._filters.registries.forEach((filter, index) => {
			if (index === 0) filter.focus();
			filter.requestFilterClearAll();
		});
	}

	_removeLostFilter(filterId) {
		this._allActiveFilters.delete(filterId);
		this.requestUpdate();
	}

	_tagListItemDeleted(e) {
		const filterId = e.target.getAttribute('data-filter-id');
		const filterValueIndex = e.target.getAttribute('data-index');
		const filterValue = this._allActiveFilters.get(filterId)[filterValueIndex];
		const filter = this._filters.registries.find(filter => filter.id === filterId);
		filter.requestFilterValueClear(filterValue.keyObject);
	}

}

customElements.define('d2l-filter-tags', FilterTags);
