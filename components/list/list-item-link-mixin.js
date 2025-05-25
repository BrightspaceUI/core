import '../colors/colors.js';
import { css, html, nothing } from 'lit';
import { isInteractiveInListItemComposedPath, ListItemMixin } from './list-item-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export const ListItemLinkMixin = superclass => class extends ListItemMixin(superclass) {

	static get properties() {
		return {
			/**
			 * Address of item link if navigable
			 * @type {string}
			 */
			actionHref: { type: String, attribute: 'action-href', reflect: true },
			_ariaCurrent: { type: String }
		};
	}

	static get styles() {

		const styles = [ css`
			:host([action-href]:not([action-href=""])) {
				--d2l-list-item-content-text-color: var(--d2l-color-celestine);
			}
			:host([_list-item-interactive-enabled]) a[href] {
				color: unset;
				display: block;
				height: 100%;
				outline: none;
				text-decoration: none;
				width: 100%;
			}
			/** clean up with flag GAUD-7495-list-interactive-content */
			:host(:not([_list-item-interactive-enabled])) a[href] {
				display: block;
				height: 100%;
				outline: none;
				width: 100%;
			}
			/** clean up with flag GAUD-7495-list-interactive-content */
			:host(:not([_list-item-interactive-enabled])[action-href]:not([action-href=""])) [slot="content"],
			:host(:not([_list-item-interactive-enabled]):not([no-primary-action])) [slot="control-action"] ~ [slot="content"],
			:host(:not([_list-item-interactive-enabled]):not([no-primary-action])) [slot="outside-control-action"] ~ [slot="content"] {
				pointer-events: none;
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
		return isInteractiveInListItemComposedPath(e, isPrimaryAction);
	}

	_handleLinkClick(e) {
		if (this._getDescendantClicked(e)) {
			e.preventDefault();
		} else {
			/** Dispatched when the item's primary link action is clicked */
			this.dispatchEvent(new CustomEvent('d2l-list-item-link-click', { bubbles: true }));

			if (!this._listItemInteractiveEnabled) return; // clean up with flag GAUD-7495-list-interactive-content

			e.stopPropagation();

			// Dispatches click event from the list item to maintain existing functionality in consumers that listen for the click event
			const listItemClickEvent = new e.constructor(e.type, e);
			listItemClickEvent.preventDefault = () => {
				e.preventDefault();
			};
			/** @ignore */
			this.dispatchEvent(listItemClickEvent);
		}
	}

	_handleLinkFocus(e) {
		if (this._getDescendantClicked(e)) {
			requestAnimationFrame(() => this._focusingPrimaryAction = false);
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
			aria-current="${ifDefined(this._ariaCurrent)}"
			@click="${this._handleLinkClick}"
			@focusin="${this._handleLinkFocus}"
			href="${this.actionHref}"
			id="${this._primaryActionId}"
			@keydown="${this._handleLinkKeyDown}">${content || nothing}</a>`;
	}

};
