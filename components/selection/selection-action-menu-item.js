import '../icons/icon.js';
import { css, html, LitElement } from 'lit';
import { MenuItemMixin } from '../menu/menu-item-mixin.js';
import { menuItemStyles } from '../menu/menu-item-styles.js';
import { SelectionActionMixin } from './selection-action-mixin.js';
import { SelectionInfo } from './selection-mixin.js';

/**
 * An action menu-item component used within selection controls such as d2l-list and d2l-list-controls.
 * @slot supporting - Allows supporting information to be displayed on the right-most side of the menu item
 * @fires d2l-selection-action-click - Dispatched when the user clicks the action button. The `SelectionInfo` is provided as the event `detail`. If `requires-selection` was specified then the event will only be dispatched if items are selected.
 * @fires d2l-selection-observer-subscribe - Internal event
 */
class ActionMenuItem extends SelectionActionMixin(MenuItemMixin(LitElement)) {

	static get styles() {
		return [ menuItemStyles,
			css`
				:host {
					align-items: center;
					display: flex;
					padding: 0.75rem 1rem;
				}
				d2l-icon {
					flex: none;
					margin-left: 6px;
				}
				:host([dir="rtl"]) d2l-icon {
					margin-left: 0;
					margin-right: 6px;
				}
			`
		];
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
		const icon = this.hasChildView ?
			html`<d2l-icon icon="tier1:chevron-right"></d2l-icon>` : null;

		return html`
			<div class="d2l-menu-item-text">${this.text}</div>
			<div class="d2l-menu-item-supporting"><slot name="supporting"></slot></div>
			${icon}
			<slot></slot>
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

customElements.define('d2l-selection-action-menu-item', ActionMenuItem);
