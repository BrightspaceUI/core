import { css } from 'lit-element/lit-element.js';
import { getUniqueId } from '../../helpers/uniqueId.js';

export const TabPanelMixin = superclass => class extends superclass {

	static get properties() {
		return {
			noPadding: { type: Boolean, attribute: 'no-padding', reflect: true },
			role: { type: String, reflect: true },
			selected: { type: Boolean, reflect: true },
			text: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				display: none;
				margin: 1.2rem 0 0 0;
			}
			:host([no-padding]) {
				margin: 0;
			}
			:host([selected]) {
				display: block;
			}
		`;
	}

	constructor() {
		super();
		this.role = 'tabpanel';
		if (this.id.length === 0) this.id = getUniqueId();
	}

	async attributeChangedCallback(name, oldval, newval) {
		super.attributeChangedCallback(name, oldval, newval);
		if (name === 'selected') {
			if (this.selected) this._dispatchSelected();
		} else if (name === 'text') {
			this.setAttribute('aria-label', this.text);
			this.dispatchEvent(new CustomEvent(
				'd2l-tab-panel-text-changed', { bubbles: true, composed: true, detail: { text: this.text } }
			));
		}
	}

	_dispatchSelected() {
		this.dispatchEvent(new CustomEvent(
			'd2l-tab-panel-selected', { bubbles: true, composed: true }
		));
	}

};
