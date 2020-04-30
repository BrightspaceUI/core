import { css, html } from 'lit-element/lit-element.js';
import { checkboxStyles } from '../inputs/input-checkbox-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { nothing } from 'lit-html';

export const ListItemCheckboxMixin = superclass => class extends superclass {

	static get properties() {
		return {
			disabled: {type: Boolean },
			key: { type: String, reflect: true },
			selectable: {type: Boolean },
			selected: { type: Boolean, reflect: true }
		};
	}

	// TODO: Remove grid styles after list-item-generic is created
	static get styles() {
		return [ checkboxStyles, css`
			.checkbox-action { height: 100%}
		` ];
	}

	constructor() {
		super();
		this._checkboxId = getUniqueId();
	}

	connectedCallback() {
		super.connectedCallback();
		if (this.key === undefined) {
			this.setSelected(undefined, true);
		}
	}

	setSelected(selected, suppressEvent = false) {
		this.selected = selected;
		if (!suppressEvent) this._dispatchSelected(selected);
	}

	_dispatchSelected(value) {
		this.dispatchEvent(new CustomEvent('d2l-list-item-selected', {
			detail: { key: this.key, selected: value },
			bubbles: true
		}));
	}

	_handleCheckboxActionClick() {
		if (this.disabled) {
			return;
		}
		this.setSelected(!this.selected);
	}

	_handleCheckboxChange(event) {
		this.setSelected(event.target.checked);
	}

	_renderCheckbox() {
		return this.selectable ? html`
			<input
				id="${this._checkboxId}"
				class="d2l-input-checkbox"
				@change="${this._handleCheckboxChange}"
				type="checkbox"
				.checked="${this.selected}"
				?disabled="${this.disabled}">
			` : nothing;
	}

	_renderCheckboxAction(inner) {
		return this.selectable ? html`
			<div @click="${this._handleCheckboxActionClick}" class="checkbox-action">${inner}</div>
			` : nothing;
	}
};
