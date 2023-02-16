import { html, LitElement } from 'lit';

export const EmptyStateType = {
	Search: 'search',
	Set: 'set'
};

/**
 * A component to represent the main filter dimension type - a set of possible values that can be selected.
 * This component does not render anything, but instead gathers data needed for the d2l-filter.
 * @slot - For d2l-filter-dimension-set-value components
 * @slot search-empty-state - The empty state that is displayed when the search returns no results
 * @slot set-empty-state - The empty state that is displayed when the dimension-set has no values
 */
class FilterDimensionSet extends LitElement {

	static get properties() {
		return {
			/**
			 * REQUIRED: Unique key to represent this dimension in the filter
			 * @type {string}
			 */
			key: { type: String },
			/**
			 * Whether the values for this dimension are still loading and a loading spinner should be displayed
			 * @type {boolean}
			 */
			loading: { type: Boolean },
			/**
			 * Whether to hide the search input, perform a simple text search, or fire an event on search
			 * @type {'none'|'automatic'|'manual'}
			 */
			searchType: { type: String, attribute: 'search-type' },
			/**
			 * Adds a select all checkbox and summary for this dimension
			 * @type {boolean}
			 */
			selectAll: { type: Boolean, attribute: 'select-all' },
			/**
			 * Whether only one value can be selected at a time for this dimension
			 * @type {boolean}
			 */
			selectionSingle: { type: Boolean, attribute: 'selection-single' },
			/**
			 * REQUIRED: The text that is displayed for the dimension title
			 * @type {string}
			 */
			text: { type: String },
			/**
			 * Whether to hide the dimension in the text sent to active filter subscribers
			 * @type {boolean}
			 */
			valueOnlyActiveFilterText: { type: Boolean, attribute: 'value-only-active-filter-text' }
		};
	}

	constructor() {
		super();
		this.loading = false;
		this.searchType = 'automatic';
		this.selectAll = false;
		this.selectionSingle = false;
		this.text = '';
		this.valueOnlyActiveFilterText = false;
		this._searchEmptyStatesSlot = null;
		this._setEmptyStatesSlot = null;
		this._slot = null;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.addEventListener('d2l-filter-dimension-set-value-data-change', this._handleDimensionSetValueDataChange);
	}

	render() {
		return html`
			<slot @slotchange="${this._handleSlotChange}"></slot>
			<slot name="search-empty-state" @d2l-filter-dimension-set-empty-state-change="${this._handleDimensionSetSearchEmptyStateChange}" @slotchange="${this._handleSearchEmptyStateSlotChange}"></slot>
			<slot name="set-empty-state" @d2l-filter-dimension-set-empty-state-change="${this._handleDimensionSetSetEmptyStateChange}" @slotchange="${this._handleSetEmptyStateSlotChange}"></slot>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		const changes = new Map();
		changedProperties.forEach((oldValue, prop) => {
			if (oldValue === undefined) return;

			if (prop === 'text' || prop === 'loading') {
				changes.set(prop, this[prop]);
			}
		});

		if (changes.size > 0) {
			this._dispatchDataChangeEvent({ dimensionKey: this.key, changes: changes });
		}
	}

	_dispatchDataChangeEvent(eventDetail) {
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-filter-dimension-data-change', {
			detail: eventDetail,
			bubbles: true,
			composed: false
		}));
	}

	_dispatchEmptyStateChangeEvent(eventDetail) {
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-filter-dimension-empty-state-change', {
			detail: eventDetail,
			bubbles: true,
			composed: false
		}));
	}

	_getEmptyStateSlottedNode(emptyStateSlot) {
		if (!emptyStateSlot) return null;
		const nodes = emptyStateSlot.assignedNodes({ flatten: true });
		return nodes.find((node) => node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'd2l-filter-dimension-set-empty-state');
	}

	_getSearchEmptyState() {
		const searchEmptyState = this._getEmptyStateSlottedNode(this._searchEmptyStateSlot);
		if (!searchEmptyState) return null;
		return {
			actionHref: searchEmptyState.actionHref,
			actionText: searchEmptyState.actionText,
			description: searchEmptyState.description
		};
	}

	_getSetEmptyState() {
		const setEmptyState = this._getEmptyStateSlottedNode(this._setEmptyStateSlot);
		if (!setEmptyState) return null;
		return {
			actionHref: setEmptyState.actionHref,
			actionText: setEmptyState.actionText,
			description: setEmptyState.description
		};
	}

	_getSlottedNodes() {
		if (!this._slot) return [];
		const nodes = this._slot.assignedNodes({ flatten: true });
		return nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'd2l-filter-dimension-set-value');
	}

	_getValues() {
		const valueNodes = this._getSlottedNodes();
		const values = valueNodes.map(value => {
			return {
				count: value.count,
				disabled: value.disabled,
				key: value.key,
				selected: value.selected,
				text: value.text
			};
		});
		return values;
	}
	_handleDimensionSetSearchEmptyStateChange(e) {
		e.stopPropagation();
		this._dispatchEmptyStateChangeEvent({ dimensionKey: this.key, type: EmptyStateType.Search, changes: e.detail.changes });
	}

	_handleDimensionSetSetEmptyStateChange(e) {
		e.stopPropagation();
		this._dispatchEmptyStateChangeEvent({ dimensionKey: this.key, type: EmptyStateType.Set, changes: e.detail.changes });
	}

	_handleDimensionSetValueDataChange(e) {
		e.stopPropagation();
		this._dispatchDataChangeEvent({ dimensionKey: this.key, valueKey: e.detail.valueKey, changes: e.detail.changes });
	}

	_handleSearchEmptyStateSlotChange(e) {
		if (!this._searchEmptyStateSlot) this._searchEmptyStateSlot = e.target;
		this._dispatchEmptyStateChangeEvent({ dimensionKey: this.key, type: EmptyStateType.Search });
	}

	_handleSetEmptyStateSlotChange(e) {
		if (!this._setEmptyStateSlot) this._setEmptyStateSlot = e.target;
		this._dispatchEmptyStateChangeEvent({ dimensionKey: this.key, type: EmptyStateType.Set });
	}

	_handleSlotChange(e) {
		if (!this._slot) this._slot = e.target;
		const values = this._getValues();
		this._dispatchDataChangeEvent({ dimensionKey: this.key, changes: new Map([['values', values]]) });
	}

}

customElements.define('d2l-filter-dimension-set', FilterDimensionSet);
