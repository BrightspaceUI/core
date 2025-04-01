import '../colors/colors.js';
import { css, html } from 'lit';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ListItemMixin } from './list-item-mixin.js';
import { EventSubscriberController } from '../../controllers/subscriber/subscriberControllers.js';

const interactiveElements = {
	// 'a' only if an href is present
	'button': true,
	'input': true,
	'select': true,
	'textarea': true,
	'd2l-tooltip-help': true,
	'd2l-button': true
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

function getIsInteractiveChildClicked(e, linkElem) {
	const composedPath = e.composedPath();
	for (let i = 0; i < composedPath.length; i++) {
		const elem = composedPath[i];
		if (!elem.getAttribute) continue;

		if (elem === linkElem) {
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

export const ListItemMenuItemMixin = superclass => class extends ListItemMixin(superclass) {

	static get properties() {
		return {
			/**
			 * possible values: page, location
			 */
			current: { type: String, reflect: true },
			menuItemDisabled: { type: Boolean, reflect: true, attribute: 'menu-item-disabled' },
		};
	}

	static get styles() {

		const styles = [ css`
			:host([menu-item-disabled]) [slot="content-action"] {
				pointer-events: none;
			}
			[slot="outside-control-container"] {
				margin: 0 -12px;
			}
			a {
				background-color: transparent;
				border: none;
				cursor: pointer;
				display: block;
				height: 100%;
				outline: none;
				width: 100%;
			}
			:host(:not([menu-item-disabled])) [slot="control-action"],
			:host(:not([menu-item-disabled])) [slot="outside-control-action"] {
				grid-column-end: control-end;
			}
			.d2l-list-item-content ::slotted(*) {
				width: 100%;
			}
		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.current = undefined;
		this.menuItemDisabled = false;
		this._primaryActionId = getUniqueId();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('d2l-list-item-menu-item-set-current', async(e) => {
			if (e.target === this) return;
			this.current = 'location';
		});
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('current')) this.ariaCurrent = this.current;
		if (this.current === 'location') this.ariaCurrent = 'location';
	}

	dispatchResetEvent() {
		this.dispatchEvent(new CustomEvent('d2l-list-item-menu-item-set-current', { bubbles: true }));
	}

	_handleMenuItemClick(e) {
		if (getIsInteractiveChildClicked(e, this.shadowRoot.querySelector(`#${this._primaryActionId}`))) {
			e.preventDefault();
		} else {
			this.current = 'page';
			/** Dispatched when the item's primary link action is clicked */
			this.dispatchEvent(new CustomEvent('d2l-list-item-menu-item-click', { bubbles: true }));
		}
	}

	_handleMenuItemKeyDown(e) {
		if (e.keyCode !== 32) return;
		// handle the space key
		e.preventDefault();
		e.stopPropagation();
		e.target.click();
	}

	_renderPrimaryAction(labelledBy, content) {
		return html`<a aria-labelledby="${labelledBy}"
			@click="${this._handleMenuItemClick}"
			id="${this._primaryActionId}"
			tabindex="0"
			@keydown="${this._handleMenuItemKeyDown}">${content}</a>`;
	}

};
