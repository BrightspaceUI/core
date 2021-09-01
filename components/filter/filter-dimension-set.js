import { html, LitElement } from 'lit-element/lit-element.js';

/**
 * A component to represent the main filter dimension type - a set of possible values that can be selected.
 * This component does not render anything, but instead gathers data needed for the d2l-filter.
 * @slot - For d2l-filter-dimension-set-value components
 * @fires d2l-filter-dimension-data-change - @ignore
 */
class FilterDimensionSet extends LitElement {

	static get properties() {
		return {
			/**
			 * REQUIRED: Unique key to represent this dimension in the filter
			 */
			key: { type: String },
			/**
			 * Whether the values for this dimension are still loading and a loading spinner should be displayed
			 */
			loading: { type: Boolean },
			/**
			 * Whether to hide the search input, perform a simple text search, or fire an event on search
			 * @type {'none'|'automatic'|'manual'}
			 */
			searchType: { type: String, attribute: 'search-type' },
			/**
			 * Adds a select all checkbox and summary for this dimension
			 */
			selectAll: { type: Boolean, attribute: 'select-all' },
			/**
			 * Whether only one value can be selected at a time for this dimension
			 */
			selectionSingle: { type: Boolean, attribute: 'selection-single' },
			/**
			 * REQUIRED: The text that is displayed for the dimension title
			 */
			text: { type: String }
		};
	}

	constructor() {
		super();
		this.loading = false;
		this.searchType = 'automatic';
		this.selectAll = false;
		this.selectionSingle = false;
		this.text = '';
		this._slot = null;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.addEventListener('d2l-filter-dimension-set-value-data-change', this._handleDimensionSetValueDataChange);
	}

	render() {
		return html`<slot @slotchange="${this._handleSlotChange}"></slot>`;
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
		this.dispatchEvent(new CustomEvent('d2l-filter-dimension-data-change', {
			detail: eventDetail,
			bubbles: true,
			composed: false
		}));
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
				key: value.key,
				selected: value.selected,
				text: value.text
			};
		});
		return values;
	}

	_handleDimensionSetValueDataChange(e) {
		e.stopPropagation();
		this._dispatchDataChangeEvent({ dimensionKey: this.key, valueKey: e.detail.valueKey, changes: e.detail.changes });
	}

	_handleSlotChange(e) {
		if (!this._slot) this._slot = e.target;
		const values = this._getValues();
		this._dispatchDataChangeEvent({ dimensionKey: this.key, changes: new Map([['values', values]]) });
	}

}

customElements.define('d2l-filter-dimension-set', FilterDimensionSet);
