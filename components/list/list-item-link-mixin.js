import '../colors/colors.js';
import { css, html } from 'lit';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ListItemMixin } from './list-item-mixin.js';

const interactiveElements = {
	// 'a' only if an href is present
	'button': true,
	'input': true,
	'select': true,
	'textarea': true
};

const interactiveRoles = {
	'button': true,
	'checkbox': true,
	'combobox': true,
	'link': true,
	'listbox': true,
	'menuitem': true,
	'menuitemcheckbox': true,
	'menuitemradio': true,
	'option': true,
	'radio': true,
	'slider': true,
	'spinbutton': true,
	'switch': true,
	'tab:': true,
	'textbox': true,
	'treeitem': true
};

function getIsInteractiveChildClicked(e) {
	const composedPath = e.composedPath();
	const clickedElem = e.target;
	for (let i = 0; i < composedPath.length; i++) {
		const elem = composedPath[i];
		if (elem === clickedElem) {
			return false;
		}

		const nodeName = elem.nodeName.toLowerCase();
		if (interactiveElements[nodeName] || (nodeName === 'a' && elem.hasAttribute('href'))) {
			return true;
		}

		const role = (elem.getAttribute('role') || '');
		if (interactiveRoles[role]) {
			return true;
		}
	}
	return false;
}

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
				text-decoration: none;
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

	_handleLinkClick(e) {
		if (getIsInteractiveChildClicked(e)) {
			e.preventDefault();
		} else {
			/** Dispatched when the item's primary link action is clicked */
			this.dispatchEvent(new CustomEvent('d2l-list-item-link-click', { bubbles: true }));
		}
	}

	_handleLinkKeyDown(e) {
		if (e.keyCode !== 32) return;
		// handle the space key
		e.preventDefault();
		e.stopPropagation();
		this.shadowRoot.querySelector(`#${this._primaryActionId}`).click();
	}

	_renderPrimaryAction(labelledBy, content) {
		if (!this.actionHref) return;
		return html`<a aria-labelledby="${labelledBy}"
			@click="${this._handleLinkClick}"
			href="${this.actionHref}"
			id="${this._primaryActionId}"
			@keydown="${this._handleLinkKeyDown}">${content}</a>`;
	}

};
