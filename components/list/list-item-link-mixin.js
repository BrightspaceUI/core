import '../colors/colors.js';
import { css, html } from 'lit';
import { isInteractiveInListItemComposedPath, ListItemMixin } from './list-item-mixin.js';
import { _generateLinkStyles } from '../link/link-styles.js';
import { getFlag } from '../../helpers/flags.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { LinkMixin } from '../link/link-mixin.js';

export const linkStyles = _generateLinkStyles('.d2l-list-item-link', true);

export const ListItemLinkMixin = superclass => class extends LinkMixin(ListItemMixin(superclass)) {

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

		const styles = [linkStyles, css`
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
			:host([action-href]:not([action-href=""])[target="_blank"]) [slot="content"] {
				padding-inline: 0;
			}
			a[target="_blank"].d2l-list-item-link {
				display: flex;
				align-items: baseline;
			}
			.d2l-list-item-link:hover {
				color: var(--d2l-color-celestine);
			}
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.actionHref = null;
		this._primaryActionId = getUniqueId();
		this._propagateLinkClickEvent = getFlag('GAUD-8733-list-item-propagate-link-click-event', true);
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

			if (!this._propagateLinkClickEvent) {
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
		const innerWithIcon = html`${content}${this._renderNewWindowIcon()}`;
		return this._render(innerWithIcon, { ariaLabelledBy: labelledBy, linkClasses: { 'd2l-list-item-link': true } });
	}

};
