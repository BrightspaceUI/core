import { css, html } from 'lit-element/lit-element.js';
import { checkboxStyles } from '../inputs/input-checkbox-styles.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { nothing } from 'lit-html';

export const ListItemCheckboxMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * Disables the checkbox
			 */
			disabled: { type: Boolean },
			/**
			 * Value to identify item if selectable
			 */
			key: { type: String, reflect: true },
			/**
			 * Indicates a checkbox should be rendered for selecting the item
			 */
			selectable: {type: Boolean },
			/**
			 * Whether the item is selected
			 */
			selected: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return [ checkboxStyles, css`
			.d2l-checkbox-action {
				height: 100%;
				display: block;
				cursor: pointer;
			}
			.d2l-checkbox-action.d2l-checkbox-action-disabled {
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
		if (!this.key) {
			if (this.selectable) console.warn('"key" property has not been set on selectable item');
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

	_handleCheckboxActionClick(event) {
		event.preventDefault();
		if (this.disabled) return;
		this.setSelected(!this.selected);
		const checkbox = this.shadowRoot.querySelector(`#${this._checkboxId}`);
		if (checkbox) checkbox.focus();
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

	_renderCheckboxAction(inner, labelledBy) {
		if (!inner && !labelledBy) {
			console.warn('Label for list-item checkbox may not be accessible. Pass inner text to the label or pass labelledby.');
		}
		const labelClasses = {
			'd2l-checkbox-action': true,
			'd2l-checkbox-action-disabled': this.disabled
		};
		return this.selectable ? html`
			<label @click="${this._handleCheckboxActionClick}"
				class="${classMap(labelClasses)}"
				for="${this._checkboxId}"
				aria-labelledby="${ifDefined(labelledBy)}">
				${inner}
			</label>
			` : nothing;
	}
};
