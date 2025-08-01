import { html, LitElement } from 'lit';

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
			 * Whether the dimension has more values to load. Manual search and selected first should be set if has more is being used
			 * @type {boolean}
			 */
			hasMore: { type: Boolean, attribute: 'has-more' },
			/**
			 * A heading displayed above the list items. This is usually unnecessary, but can be used to emphasize or promote something specific about the list of items to help orient users.
			 * @type {string}
			 */
			headerText: { type: String, attribute: 'header-text' },
			/**
			 * The introductory text to display at the top of the filter dropdown
			 * @type {string}
			 */
			introductoryText: { type: String, attribute: 'introductory-text' },
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
			 * @ignore
			 */
			minWidth: { type: Number },
			/**
			 * ADVANCED: Whether to ignore the enforce single selection setting for this dimension.
			 */
			ignoreEnforceSelectionSingle: { type: Boolean, attribute: 'ignore-enforce-selection-single' },
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
			 * Whether to render the selected items at the top of the filter. Forced on if load more paging is being used
			 * @type {boolean}
			 */
			selectedFirst: { type: Boolean, attribute: 'selected-first' },
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
		this.headerText = '';
		this.introductoryText = '';
		this.loading = false;
		this.hasMore = false;
		this.ignoreEnforceSelectionSingle = false;
		this.searchType = 'automatic';
		this.selectAll = false;
		this.selectedFirst = false;
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
			<slot name="search-empty-state" @slotchange="${this._handleSearchEmptyStateSlotChange}"></slot>
			<slot name="set-empty-state" @slotchange="${this._handleSetEmptyStateSlotChange}"></slot>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		const changes = new Map();
		changedProperties.forEach((oldValue, prop) => {
			if (oldValue === undefined) return;

			if (prop === 'text' || prop === 'loading' || prop === 'hasMore' || prop === 'selectedFirst') {
				changes.set(prop, this[prop]);
			}
		});

		if (changes.size > 0) {
			this._dispatchDataChangeEvent({ dimensionKey: this.key, changes: changes });
		}
	}

	willUpdate(changedProperties) {
		if (changedProperties.has('hasMore') && this.hasMore) {
			if (this.searchType !== 'manual') {
				console.warn('Paging requires search type set to manual.');
				this.hasMore = false;
			}
			else this.selectedFirst = true;
		}
	}

	getSearchEmptyState() {
		return this._getEmptyState(this._searchEmptyStateSlot, 'search');
	}

	getSetEmptyState() {
		return this._getEmptyState(this._setEmptyStateSlot, 'set');
	}

	getValues() {
		const valueNodes = this._getSlottedNodes();
		let noSearchSupport = false;
		let enforceSingleSelection = false;
		let minWidth = undefined;
		const values = valueNodes.map(value => {
			if (value._noSearchSupport) noSearchSupport = true;
			if (value._enforceSingleSelection) enforceSingleSelection = true;
			if (value._minWidth) minWidth = value._minWidth;

			return value.getValueDetails();
		});
		if (noSearchSupport) this.searchType = 'none';
		if (enforceSingleSelection && !this.ignoreEnforceSelectionSingle) this.selectionSingle = true;
		if (minWidth) this.minWidth = minWidth;
		return values;
	}

	_dispatchDataChangeEvent(eventDetail) {
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-filter-dimension-data-change', {
			detail: eventDetail,
			bubbles: true,
			composed: false
		}));
	}

	_getEmptyState(emptyStateSlot, emptyStateType) {
		if (!emptyStateSlot) return null;
		const nodes = emptyStateSlot.assignedNodes({ flatten: true });
		const emptyState = nodes.find((node) => node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'd2l-filter-dimension-set-empty-state');
		if (!emptyState) return null;
		return {
			actionHref: emptyState.actionHref,
			actionText: emptyState.actionText,
			description: emptyState.description,
			type: emptyStateType
		};
	}

	_getSlottedNodes() {
		if (!this._slot) return [];
		const nodes = this._slot.assignedNodes({ flatten: true });
		return nodes.filter((node) => {
			if (node.nodeType !== Node.ELEMENT_NODE) return false;
			return node._filterSetValue;
		});
	}

	_handleDimensionSetValueDataChange(e) {
		e.stopPropagation();
		this._dispatchDataChangeEvent({ dimensionKey: this.key, valueKey: e.detail.valueKey, changes: e.detail.changes, dispatchChangeEvent: e.detail.dispatchChangeEvent });
	}

	_handleSearchEmptyStateSlotChange(e) {
		if (!this._searchEmptyStateSlot) this._searchEmptyStateSlot = e.target;
		this._dispatchDataChangeEvent({ dimensionKey: this.key, changes: new Map([['searchEmptyState', this.getSearchEmptyState()]]) });
	}

	_handleSetEmptyStateSlotChange(e) {
		if (!this._setEmptyStateSlot) this._setEmptyStateSlot = e.target;
		this._dispatchDataChangeEvent({ dimensionKey: this.key, changes: new Map([['setEmptyState', this.getSetEmptyState()]]) });
	}

	_handleSlotChange(e) {
		if (!this._slot) this._slot = e.target;
		const values = this.getValues();
		this._dispatchDataChangeEvent({ dimensionKey: this.key, changes: new Map([['values', values]]) });
	}

}

customElements.define('d2l-filter-dimension-set', FilterDimensionSet);
