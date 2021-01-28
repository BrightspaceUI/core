import '../colors/colors.js';
import { css, html } from 'lit-element/lit-element.js';
import { ListItemMixin } from './list-item-mixin.js';

export const ListItemLinkMixin = superclass => class extends ListItemMixin(superclass) {

	static get properties() {
		return {
			/**
			 * Address of item link if navigable
			 */
			actionHref: { type: String, attribute: 'action-href', reflect: true }
		};
	}

	static get styles() {

		const styles = [ css`
			:host([action-href]:not([action-href=""])) {
				--d2l-list-item-content-text-color: var(--d2l-color-celestine);
			}
			:host([action-href]:not([action-href=""]):not([skeleton])) d2l-list-item-generic-layout.d2l-focusing,
			:host([action-href]:not([action-href=""]):not([skeleton])) d2l-list-item-generic-layout.d2l-hovering {
				background-color: var(--d2l-color-regolith);
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
	}

	_renderPrimaryAction(labelledBy) {
		if (!this.actionHref) return;
		return html`<a aria-labelledby="${labelledBy}" href="${this.actionHref}"></a>`;
	}

};
