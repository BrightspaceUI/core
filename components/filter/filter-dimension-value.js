import { LitElement } from 'lit-element/lit-element.js';

/**
 * A component to represent the values for the main filter dimension type (list items).
 * This component does not render anything, but instead gathers data needed for the d2l-filter.
 * @fires d2l-filter-dimension-value-data-change - @ignore
 */
class FilterDimensionValue extends LitElement {

	static get properties() {
		return {
			key: { type: String },
			selected: { type: Boolean, reflect: true },
			text: { type: String }
		};
	}

	constructor() {
		super();
		this.selected = false;
		this.text = '';
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		const changes = new Map();
		changedProperties.forEach((oldValue, prop) => {
			if (oldValue === undefined) return;

			if (prop === 'selected' || prop === 'text') {
				changes.set(prop, this[prop]);
			}
		});

		if (changes.size > 0) {
			this.dispatchEvent(new CustomEvent('d2l-filter-dimension-value-data-change', { detail: { valueKey: this.key, changes: changes }, bubbles: true, composed: false }));
		}
	}

}

customElements.define('d2l-filter-dimension-value', FilterDimensionValue);
