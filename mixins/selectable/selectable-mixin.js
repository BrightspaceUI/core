import { css, html } from 'lit-element/lit-element.js';
import { checkboxStyles } from '../../components/inputs/input-checkbox-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { nothing } from 'lit-html';

export const SelectableMixin = superclass => class extends superclass {

	static get properties() {
		return {
			disabled: { type: Boolean },
			key: { type: String, reflect: true },
			selectable: {type: Boolean },
			selected: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return [ checkboxStyles, css`
			.d2l-select-action {
				height: 100%;
				display: block;
				cursor: pointer;
			}
			.d2l-select-action[disabled] {
				cursor: default;
			}
		` ];
	}

	constructor() {
		super();
		this._checkboxId = getUniqueId();
	}

	connectedCallback() {
		super.connectedCallback();
		this._selectedEventName = `d2l-${this.constructor.name
			.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}-selected`;
		if (!this.key) {
			console.warn('"key" property has not been set on selectable item');
			this.setSelected(undefined, true);
		}
	}

	setSelected(selected, suppressEvent = false) {
		this.selected = selected;
		if (!suppressEvent) this._dispatchSelected(selected);
	}

	_dispatchSelected(value) {
		this.dispatchEvent(new CustomEvent(this._selectedEventName, {
			detail: { key: this.key, selected: value },
			bubbles: true
		}));
	}

	_handleCheckboxChange(event) {
		this.setSelected(event.target.checked);
	}

	_handleSelectActionClick(event) {
		event.preventDefault();
		if (this.disabled) return;
		this.setSelected(!this.selected);
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

	_renderSelectAction(inner) {
		return this.selectable ? html`
			<label @click="${this._handleSelectActionClick}"
				class="d2l-select-action"
				?disabled="${this.disabled}"
				for="${this._checkboxId}">
				${inner}
			</label>
			` : nothing;
	}
};
