import '../colors/colors.js';
import { css, html } from 'lit-element/lit-element.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ListItemMixin } from './list-item-mixin.js';

export const ListItemButtonMixin = superclass => class extends ListItemMixin(superclass) {

	static get styles() {

		const styles = [ css`
			:host {
				--d2l-list-item-content-text-color: var(--d2l-color-celestine);
			}
			:host d2l-list-item-generic-layout.d2l-focusing,
			:host d2l-list-item-generic-layout.d2l-hovering {
				background-color: var(--d2l-color-regolith);
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
	}

	_onButtonClick() {
		/** Dispatched when the item's primary button action is clicked */
		this.dispatchEvent(new CustomEvent('d2l-list-item-button-click', { bubbles: true }));
	}

	_renderPrimaryAction(labelledBy) {
		return html`<button id="${this._primaryActionId}" aria-labelledby="${labelledBy}" @click="${this._onButtonClick}"></button>`;
	}

};
