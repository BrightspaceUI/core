import '../colors/colors.js';
import { css, html } from 'lit';
import { listInteractiveElems, ListItemMixin } from './list-item-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { isInteractiveInComposedPath } from '../../helpers/interactive.js';

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
				color: unset;
				display: block;
				height: 100%;
				outline: none;
				text-decoration: none;
				width: 100%;
			}
			:host([action-href]:not([action-href=""])) [slot="control-action"],
			:host([action-href]:not([action-href=""])) [slot="outside-control-action"] {
				grid-column-end: control-end;
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

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('actionHref') && !this.actionHref) this._hoveringPrimaryAction = false;
	}

	_getDescendantClicked(e) {
		const isPrimaryAction = (elem) => elem === this.shadowRoot.querySelector(`#${this._primaryActionId}`);
		return isInteractiveInComposedPath(e.composedPath(), isPrimaryAction, { elements: listInteractiveElems });
	}

	_handleLinkClick(e) {
		if (this._getDescendantClicked(e)) {
			e.preventDefault();
		} else {
			/** Dispatched when the item's primary link action is clicked */
			this.dispatchEvent(new CustomEvent('d2l-list-item-link-click', { bubbles: true }));
		}
	}

	_handleLinkFocus(e) {
		if (this._getDescendantClicked(e)) {
			e.stopPropagation();
		}
	}

	_handleLinkKeyDown(e) {
		if (e.keyCode !== 32) return;
		// handle the space key
		e.preventDefault();
		e.stopPropagation();
		e.target.click();
	}

	_renderPrimaryAction(labelledBy, content) {
		if (!this.actionHref) return;
		return html`<a aria-labelledby="${labelledBy}"
			@click="${this._handleLinkClick}"
			@focusin="${this._handleLinkFocus}"
			href="${this.actionHref}"
			id="${this._primaryActionId}"
			@keydown="${this._handleLinkKeyDown}">${content}</a>`;
	}

};
