import '../colors/colors.js';
import { css, html } from 'lit';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ListItemMixin } from './list-item-mixin.js';

export const ListItemButtonMixin = superclass => class extends ListItemMixin(superclass) {
	static get properties() {
		return {
			/**
			 * Disables the primary action button
			 * @type {boolean}
			 */
			buttonDisabled : { type: Boolean, attribute: 'button-disabled', reflect: true }
		};
	}

	static get styles() {

		const styles = [ css`
			:host(:not([button-disabled])) {
				--d2l-list-item-content-text-color: var(--d2l-color-celestine);
			}
			:host([button-disabled][_hovering-primary-action]) .d2l-list-item-content,
			:host([button-disabled][_focusing-primary-action]) .d2l-list-item-content {
				--d2l-list-item-content-text-color: unset;
				--d2l-list-item-content-text-decoration: none;
			}
			:host([button-disabled]) button {
				cursor: default;
			}
			[slot="outside-control-container"] {
				margin: 0 -12px;
			}
			:host([_hovering]) [slot="control-container"]::before,
			:host([_hovering]) [slot="control-container"]::after,
			:host([_focusing]) [slot="control-container"]::before,
			:host([_focusing]) [slot="control-container"]::after {
				border-top-color: transparent;
			}
			:host(:not([disabled]):not([skeleton])[_hovering]) [slot="outside-control-container"],
			:host(:not([disabled]):not([skeleton])[_focusing]) [slot="outside-control-container"] {
				background-color: white;
				border-color: #b6cbe8; /* celestine alpha 0.3 */
			}
			:host(:not([disabled]):not([skeleton])[_hovering]) [slot="outside-control-container"] {
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			}
			button {
				background-color: transparent;
				border: none;
				cursor: pointer;
				display: block;
				height: 100%;
				outline: none;
				width: 100%;
			}
			/* simply hide the button action layer rather than disabling button so
			 that the cursor pointer ins't displayed when hovering skeleton */
			:host([skeleton]) button {
				display: none;
			}
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this._primaryActionId = getUniqueId();
		this.buttonDisabled = false;
	}

	_onButtonClick() {
		/** Dispatched when the item's primary button action is clicked */
		this.dispatchEvent(new CustomEvent('d2l-list-item-button-click', { bubbles: true }));
	}

	_renderPrimaryAction(labelledBy) {
		return html`<button id="${this._primaryActionId}" aria-labelledby="${labelledBy}" @click="${this._onButtonClick}" ?disabled="${this.buttonDisabled}"></button>`;
	}

};
