import '../colors/colors.js';
import { css, html } from 'lit';
import { getIsInteractiveChildClicked, ListItemMixin } from './list-item-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';

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
				color: unset;
				cursor: pointer;
				display: block;
				font-family: unset;
				font-size: unset;
				font-weight: unset;
				letter-spacing: unset;
				line-height: unset;
				height: 100%;
				outline: none;
				padding: 0;
				text-align: start;
				width: 100%;
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

	_onButtonClick(e) {
		if (getIsInteractiveChildClicked(e, this.shadowRoot.querySelector(`#${this._primaryActionId}`))) {
			e.preventDefault();
		} else {
			/** Dispatched when the item's primary button action is clicked */
			this.dispatchEvent(new CustomEvent('d2l-list-item-button-click', { bubbles: true }));
		}
	}

	_onButtonFocus(e) {
		if (getIsInteractiveChildClicked(e, this.shadowRoot.querySelector(`#${this._primaryActionId}`))) {
			e.stopPropagation();
		}
	}

	_renderPrimaryAction(labelledBy, content) {
		return html`<button 
			id="${this._primaryActionId}" 
			aria-labelledby="${labelledBy}" 
			@click="${this._onButtonClick}" 
			@focusin="${this._onButtonFocus}"
			?disabled="${this.buttonDisabled}">
			${content}
		</button>`;
	}

};
