import { css, html, LitElement } from 'lit-element/lit-element.js';
import { MenuItemMixin } from '../menu/menu-item-mixin.js';
import { menuItemStyles } from '../menu/menu-item-styles.js';
import { SelectionInfo } from './selection-mixin.js';
import { SelectionObserverMixin } from './selection-observer-mixin.js';

/**
 * An action menu-item component used within selection controls such as d2l-list and d2l-list-header.
 * @slot supporting - Allows supporting information to be displayed on the right-most side of the menu item
 * @fires d2l-selection-action-click - Dispatched when the user clicks the action button. The `SelectionInfo` is provided as the event `detail`. If `requires-selection` was specified then the event will only be dispatched if items are selected.
 * @fires d2l-selection-observer-subscribe - Internal event
 */
class MenuItem extends SelectionObserverMixin(MenuItemMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Whether the action menu-item requires one or more selected items
			 * @type {boolean}
			 */
			requiresSelection: { type: Boolean, attribute: 'requires-selection', reflect: true }
		};
	}

	static get styles() {
		return [ menuItemStyles,
			css`
				:host {
					align-items: center;
					display: flex;
					padding: 0.75rem 1rem;
				}
				:host([dir="rtl"]) d2l-icon {
					margin-left: 0;
					margin-right: 6px;
				}
			`
		];
	}

	get selectionInfo() {
		return super.selectionInfo;
	}

	set selectionInfo(value) {
		super.selectionInfo = value;
		this.disabled = (this.requiresSelection && this.selectionInfo.state === SelectionInfo.states.none);
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-menu-item-select', this._handleMenuItemSelect);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-menu-item-select', this._handleMenuItemSelect);
	}

	render() {
		return html`
			<div class="d2l-menu-item-text">${this.text}</div>
			<div class="d2l-menu-item-supporting"><slot name="supporting"></slot></div>
		`;
	}

	_handleMenuItemSelect(e) {
		e.stopPropagation();

		if (this.requiresSelection && this.selectionInfo.state === SelectionInfo.states.none) return;

		this.dispatchEvent(new CustomEvent('d2l-selection-action-click', {
			bubbles: true,
			detail: this.selectionInfo
		}));
	}

}

customElements.define('d2l-selection-action-menu-item', MenuItem);
