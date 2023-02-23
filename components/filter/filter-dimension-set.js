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
			this._dispatchEvent('d2l-filter-dimension-data-change', { dimensionKey: this.key, changes: changes });
		}
	}

	getSearchEmptyState() {
		return this._getEmptyState(this._searchEmptyStateSlot);
	}

	getSetEmptyState() {
		return this._getEmptyState(this._setEmptyStateSlot);
	}

	getValues() {
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

	_dispatchEvent(eventName, eventDetail) {
		/** @ignore */
		this.dispatchEvent(new CustomEvent(eventName, {
			detail: eventDetail,
			bubbles: true,
			composed: false
		}));
	}

	_getEmptyState(emptyStateSlot) {
		if (!emptyStateSlot) return null;
		const nodes = emptyStateSlot.assignedNodes({ flatten: true });
		const emptyState = nodes.find((node) => node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'd2l-filter-dimension-set-empty-state');
		if (!emptyState) return null;
		return {
			actionHref: emptyState.actionHref,
			actionText: emptyState.actionText,
			description: emptyState.description
		};
	}

	_getSlottedNodes() {
		if (!this._slot) return [];
		const nodes = this._slot.assignedNodes({ flatten: true });
		return nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'd2l-filter-dimension-set-value');
	}

	_handleDimensionSetValueDataChange(e) {
		e.stopPropagation();
		this._dispatchEvent('d2l-filter-dimension-data-change', { dimensionKey: this.key, valueKey: e.detail.valueKey, changes: e.detail.changes });
	}

	_handleSearchEmptyStateSlotChange(e) {
		if (!this._searchEmptyStateSlot) this._searchEmptyStateSlot = e.target;
		this._dispatchEvent('d2l-filter-dimension-data-change', { dimensionKey: this.key, changes: new Map([['searchEmptyState', this.getSearchEmptyState()]]) });
	}

	_handleSetEmptyStateSlotChange(e) {
		if (!this._setEmptyStateSlot) this._setEmptyStateSlot = e.target;
		this._dispatchEvent('d2l-filter-dimension-data-change', { dimensionKey: this.key, changes: new Map([['setEmptyState', this.getSearchEmptyState()]]) });
	}

	_handleSlotChange(e) {
		if (!this._slot) this._slot = e.target;
		const values = this.getValues();
		this._dispatchEvent('d2l-filter-dimension-data-change', { dimensionKey: this.key, changes: new Map([['values', values]]) });
	}

}

customElements.define('d2l-filter-dimension-set', FilterDimensionSet);
