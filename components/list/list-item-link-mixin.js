import '../colors/colors.js';
import { css, html } from 'lit';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ListItemMixin } from './list-item-mixin.js';

export const ListItemLinkMixin = superclass => class extends ListItemMixin(superclass) {

	static get properties() {
		return {
			/**
			 * Address of item link if navigable
			 * @type {string}
			 */
			actionHref: { type: String, attribute: 'action-href', reflect: true }
		};
	}

	static get styles() {

		const styles = [ css`
			:host([action-href]:not([action-href=""])) {
				--d2l-list-item-content-text-color: var(--d2l-color-celestine);
			}
			:host([action-href]:not([action-href=""])[_hovering]) [slot="control-container"]::before,
			:host([action-href]:not([action-href=""])[_hovering]) [slot="control-container"]::after,
			:host([action-href]:not([action-href=""])[_focusing]) [slot="control-container"]::before,
			:host([action-href]:not([action-href=""])[_focusing]) [slot="control-container"]::after {
				border-top-color: transparent;
			}
			:host(:not([skeleton])[action-href]:not([action-href=""])[_hovering]) [slot="outside-control-container"],
			:host(:not([skeleton])[action-href]:not([action-href=""])[_focusing]) [slot="outside-control-container"] {
				background-color: white;
				border-color: #b6cbe8; /* celestine alpha 0.3 */
			}
			:host(:not([skeleton])[action-href]:not([action-href=""])[_hovering]) [slot="outside-control-container"] {
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			}
			a[href] {
				display: block;
				height: 100%;
				outline: none;
				width: 100%;
			}
			:host([skeleton]) a {
				display: none;
			}
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.actionHref = null;
		this._primaryActionId = getUniqueId();
	}

	_handleLinkClick() {
		/** Dispatched when the item's primary link action is clicked */
		this.dispatchEvent(new CustomEvent('d2l-list-item-link-click', { bubbles: true }));
	}

	_handleLinkKeyDown(e) {
		if (e.keyCode !== 32) return;
		e.preventDefault();
		e.stopPropagation();
		this.shadowRoot.querySelector(`#${this._primaryActionId}`).click();
	}

	_renderPrimaryAction(labelledBy) {
		if (!this.actionHref) return;
		return html`<a aria-labelledby="${labelledBy}"
			@click="${this._handleLinkClick}"
			href="${this.actionHref}"
			id="${this._primaryActionId}"
			@keydown="${this._handleLinkKeyDown}"></a>`;
	}

};
