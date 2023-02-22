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
			a[href] {
				display: block;
				height: 100%;
				outline: none;
				width: 100%;
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

	_renderPrimaryAction(labelledBy) {
		if (!this.actionHref) return;
		return html`<a id="${this._primaryActionId}" aria-labelledby="${labelledBy}" href="${this.actionHref}" @click="${this._handleLinkClick}"></a>`;
	}

};
