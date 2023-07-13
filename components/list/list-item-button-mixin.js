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
			:host([button-disabled]) [slot="content-action"] {
				pointer-events: none;
			}
			[slot="outside-control-container"] {
				margin: 0 -12px;
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
			:host(:not([button-disabled]):not([no-primary-action])) [slot="content"],
			:host(:not([no-primary-action])) [slot="control-action"] ~ [slot="content"],
			:host(:not([no-primary-action])) [slot="outside-control-action"] ~ [slot="content"] {
				pointer-events: none;
			}
			:host(:not([button-disabled])) [slot="control-action"],
			:host(:not([button-disabled])) [slot="outside-control-action"] {
				grid-column-end: control-end;
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

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('buttonDisabled') && this.buttonDisabled === true) this._hoveringPrimaryAction = false;
	}

	_onButtonClick() {
		/** Dispatched when the item's primary button action is clicked */
		this.dispatchEvent(new CustomEvent('d2l-list-item-button-click', { bubbles: true }));
	}

	_renderPrimaryAction(labelledBy) {
		return html`<button id="${this._primaryActionId}" aria-labelledby="${labelledBy}" @click="${this._onButtonClick}" ?disabled="${this.buttonDisabled}"></button>`;
	}

};
