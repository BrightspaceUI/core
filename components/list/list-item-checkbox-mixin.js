import { css, html } from 'lit-element/lit-element.js';
import { checkboxStyles } from '../inputs/input-checkbox-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { nothing } from 'lit-html';

export const ListItemCheckboxMixin = superclass => class extends superclass {

	/**
	 * https://lit-element.polymer-project.org/guide/properties#declare
	 *
	 * @readonly
	 * @static
	 */
	static get properties() {
		return {
			breakpoints: { type: Array },
			disabled: {type: Boolean },
			key: { type: String, reflect: true },
			role: { type: String, reflect: true },
			selectable: {type: Boolean },
			selected: { type: Boolean, reflect: true },
			_breakpoint: { type: Number }
		};
	}

	static get styles() {
		return [ checkboxStyles, css`
		.control-area {
			grid-column: control-start / control-end;
			grid-row: 1 / 2;
		}
		.control-action-area {
			grid-column: control-start / end;
			grid-row: 1 / 2;
			z-index: 2;
			cursor: pointer;
		}
		:host([disabled]) .control-action-area {
			cursor: default;
		}
		`];
	}

	constructor() {
		super();
		this._checkboxId = getUniqueId();
	}

	/**
	 * Lifecycle callback. Prevent event dispatch if key isn't set
	 * https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks
	 */
	connectedCallback() {
		super.connectedCallback();
		if (this.key === undefined) {
			this.setSelected(undefined, true);
		}
	}

	/**
	 * Sets whether the item is selected. Requests an event dispatch
	 * unless suppressEvent is true
	 *
	 * @param {*} selected
	 * @param {*} suppressEvent
	 */
	setSelected(selected, suppressEvent = false) {
		this.selected = selected;
		if (!suppressEvent) this._dispatchSelected(selected);
	}

	/**
	 * Dispatches a custom event with information on what
	 * items are selected and their keys.
	 * https://lit-element.polymer-project.org/guide/events
	 *
	 * @param {*} value New state of checkbox
	 */
	_dispatchSelected(value) {
		this.dispatchEvent(new CustomEvent('d2l-list-item-selected', {
			detail: { key: this.key, selected: value },
			bubbles: true
		}));
	}

	/**
	 * Handler for checkbox action area.
	 * Toggles the checkbox.
	 *
	 */
	_handleCheckboxActionClick() {
		if (this.disabled) {
			return;
		}
		this.setSelected(!this.selected);
	}

	/**
	 * Handler for checkbox user change
	 *
	 * @param {*} event
	 */
	_handleCheckboxChange(event) {
		this.setSelected(event.target.checked);
	}

	/**
	 * Renders the checkbox between control-start and control-end, as well as a clickable area
	 * between control-start to end
	 *
	 * @returns {String} Rendered checkbox
	 */
	_renderCheckbox() {
		return this.selectable ? html`
			<div class="control-area">
				<input
					id="${this._checkBoxId}"
					class="d2l-input-checkbox"
					@change="${this._handleCheckboxChange}"
					type="checkbox"
					.checked="${this.selected}"
					?disabled="${this.disabled}">
			</div>
			<div class="control-action-area" @click="${this._handleCheckboxActionClick}"></div>
			` : nothing;
	}
};
