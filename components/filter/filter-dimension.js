import { html, LitElement } from 'lit-element/lit-element.js';

/**
 * A component to represent the main filter dimension type (a list with list items).
 * This component does not render anything, but instead gathers data needed for the d2l-filter.
 * @slot - For d2l-filter-dimension-value components
 * @fires d2l-filter-dimension-data-change - @ignore
 * @fires d2l-filter-dimension-slot-change - @ignore
 */
class FilterDimension extends LitElement {

	static get properties() {
		return {
			key: { type: String },
			text: { type: String }
		};
	}

	constructor() {
		super();
		this.text = '';
	}

	render() {
		return html`<slot @slotchange="${this._handleSlotChange}"></slot>`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		const changes = new Map();
		changedProperties.forEach((oldValue, prop) => {
			if (oldValue === undefined) return;

			if (prop === 'text') {
				changes.set(prop, this[prop]);
			}
		});

		if (changes.size > 0) {
			this.dispatchEvent(new CustomEvent('d2l-filter-dimension-data-change', { detail: { changes: changes }, bubbles: true, composed: false }));
		}
	}

	_handleSlotChange() {
		this.dispatchEvent(new CustomEvent('d2l-filter-dimension-slot-change', { bubbles: true, composed: false }));
	}

}

customElements.define('d2l-filter-dimension', FilterDimension);
