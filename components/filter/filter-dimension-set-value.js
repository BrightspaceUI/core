import { LitElement } from 'lit';

/**
 * A component to represent a possible value that can be selected for a dimension set (the main filter dimension type).
 * This component does not render anything, but instead gathers data needed for the d2l-filter.
 */
class FilterDimensionSetValue extends LitElement {

	static get properties() {
		return {
			/**
			 * The count that is displayed for the filter count results
			 * @type {number}
			 */
			count: { type: Number },
			/**
			 * Whether this value in the filter is disabled or not
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * REQUIRED: Unique key to represent this value in the dimension
			 * @type {string}
			 */
			key: { type: String },
			/**
			 * Whether this value in the filter is selected or not
			 * @type {boolean}
			 */
			selected: { type: Boolean, reflect: true },
			/**
			 * REQUIRED: The text that is displayed for the value
			 * @type {string}
			 */
			text: { type: String }
		};
	}

	constructor() {
		super();
		this.disabled = false;
		this.selected = false;
		this.text = '';
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		const changes = new Map();
		changedProperties.forEach((oldValue, prop) => {
			if (oldValue === undefined) return;

			if (prop === 'count' || prop === 'disabled' || prop === 'selected' || prop === 'text') {
				changes.set(prop, this[prop]);
			}
		});
		if (changes.size > 0) {
			/** @ignore */
			this.dispatchEvent(new CustomEvent('d2l-filter-dimension-set-value-data-change', {
				detail: { valueKey: this.key, changes: changes },
				bubbles: true,
				composed: false
			}));
		}
	}

}

customElements.define('d2l-filter-dimension-set-value', FilterDimensionSetValue);
