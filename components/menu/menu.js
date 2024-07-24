import '../colors/colors.js';
import '../icons/icon.js';
import './menu-item-return.js';
import { css, html, LitElement } from 'lit';
import { HierarchicalViewMixin } from '../hierarchical-view/hierarchical-view-mixin.js';
import { ThemeMixin } from '../../mixins/theme/theme-mixin.js';

const keyCodes = {
	DOWN: 40,
	ENTER: 13,
	ESCAPE: 27,
	LEFT: 37,
	SPACE: 32,
	RIGHT: 39,
	UP: 38
};

/**
 * A wrapper component for a menu containing menu items.
 * @slot - Menu items
 * @fires d2l-menu-resize - Dispatched when size of menu changes (e.g., when nested menu of a different size is opened)
 */
class Menu extends ThemeMixin(HierarchicalViewMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			active: { type: Boolean, reflect: true },
			/**
			 * ACCESSIBILITY: Acts as the primary label for the menu (REQUIRED for root menu)
			 * @type {string}
			 */
			label: { type: String },
			/**
			 * @ignore
			 */
			// eslint-disable-next-line lit/no-native-attributes
			role: { type: String, attribute: 'role' }
		};
	}

	static get styles() {
		return [ super.styles, css`
			:host {
				--d2l-menu-background-color: #ffffff;
				--d2l-menu-background-color-hover: var(--d2l-color-celestine-plus-2);
				--d2l-menu-border-color: var(--d2l-color-gypsum);
				--d2l-menu-border-color-hover: var(--d2l-color-celestine);
				--d2l-menu-foreground-color: var(--d2l-color-ferrite);
				--d2l-menu-foreground-color-hover: var(--d2l-color-celestine-minus-1);
				--d2l-menu-separator-color: var(--d2l-color-corundum);
				box-sizing: border-box;
				display: block;
				min-width: 180px;
				padding-top: 1px;
				width: 100%;
			}

			:host([active]) .d2l-menu-items d2l-menu-item-return[role="menuitem"],
			:host([active]) .d2l-menu-items ::slotted([role="menuitem"]),
			:host([active]) .d2l-menu-items ::slotted([role="menuitemcheckbox"]),
			:host([active]) .d2l-menu-items ::slotted([role="menuitemradio"]) {
				position: relative;
			}

			:host([theme="dark"]) {
				--d2l-menu-background-color: #333536; /* tungsten @ 70% */
				--d2l-menu-background-color-hover: #123559; /* celestine-1 @ 50% */
				--d2l-menu-border-color: var(--d2l-color-tungsten);
				--d2l-menu-foreground-color: var(--d2l-color-sylvite);
				--d2l-menu-foreground-color-hover: #ffffff;
				--d2l-menu-separator-color: var(--d2l-color-galena);
				--d2l-icon-fill-color: var(--d2l-color-mica);
				background-color: var(--d2l-menu-background-color); /* so that opacity on disabled items works */
			}
		`];
	}

	constructor() {
		super();
		/** @ignore */
		this.role = 'menu';
		this._items = [];
	}

	connectedCallback() {
		super.connectedCallback();

		/** @ignore */
		this.active = this.getActiveView() === this;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('d2l-hierarchical-view-show-start', this._onVisibilityChange);
		this.addEventListener('d2l-hierarchical-view-hide-complete', this._onVisibilityChange);
		this.addEventListener('d2l-hierarchical-view-show-complete', this._onShowComplete);
		this.addEventListener('d2l-hierarchical-view-resize', this._onViewResize);
		this.addEventListener('d2l-menu-item-visibility-change', this._onMenuItemsChanged);
		this.addEventListener('keydown', this._onKeyDown);
		this.addEventListener('keypress', this._onKeyPress);

		this._labelChanged();

		this._onMenuItemsChanged();
		const slot = this.shadowRoot.querySelector('slot');
		slot.addEventListener('slotchange', () => {
			this._onMenuItemsChanged();
		});

		this.setAttribute('role', this.role);
	}

	render() {
		return html`
			<div class="d2l-menu-items d2l-hierarchical-view-content">
				<slot></slot>
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'label') this._labelChanged();

			if (propName === 'childView' && this.childView) {
				const items = this.shadowRoot.querySelector('.d2l-menu-items');
				items.insertBefore(this._createReturnItem(), items.childNodes[0]);

				this._onMenuItemsChanged();
			}
		});
	}

	focus() {
		if (this.getMenuType() === 'menu-radio') {
			this._focusSelected();
		} else {
			this._focusFirst();
		}
	}

	getMenuType() {
		if (this._items.length === 0) {
			return 'menu';
		}

		switch (this._items[0].role) {
			case 'menuitemradio':
				return 'menu-radio';

			case 'menuitemcheckbox':
				return 'menu-checkbox';

			case 'menuitem':
			default:
				return 'menu';
		}
	}

	_createReturnItem() {
		const item = document.createElement('d2l-menu-item-return');
		item.addEventListener('d2l-menu-item-select', (e) => {
			e.stopPropagation();
			this.hide();
		});
		item.text = this.label;
		return item;
	}

	_focusFirst() {
		const item = this._tryGetNextFocusable();
		if (item) item.focus();
	}

	_focusLast() {
		const item = this._tryGetPreviousFocusable();
		if (item) item.focus();
	}

	_focusNext(item) {
		item = this._tryGetNextFocusable(item);
		item ? item.focus() : this._focusFirst();
	}

	_focusPrevious(item) {
		item = this._tryGetPreviousFocusable(item);
		item ? item.focus() : this._focusLast();
	}

	_focusSelected() {
		const selected = this.querySelector('[selected]');
		if (selected) {
			selected.focus();
		} else {
			this._focusFirst();
		}
	}

	_getFirstVisibleItem() {
		for (let x = 0; x < this._items.length; x++) {
			if (!this._items[x].hidden) {
				return this._items[x];
			}
		}
		return null;
	}

	_getLastVisibleItem() {
		for (let x = this._items.length - 1; x >= 0; x--) {
			if (!this._items[x].hidden) {
				return this._items[x];
			}
		}
		return null;
	}

	_getMenuItemReturn() {
		return this.shadowRoot && this.shadowRoot.querySelector('d2l-menu-item-return');
	}

	async _getMenuItems() {
		const slot = this.shadowRoot && this.shadowRoot.querySelector('slot');
		if (!slot) return;
		const items = slot.assignedNodes({ flatten: true }).filter((node) => node.nodeType === Node.ELEMENT_NODE);

		const returnItem = this._getMenuItemReturn();
		if (returnItem) {
			items.unshift(returnItem);
		}
		// Wait for menu items to have their role attribute set
		await Promise.all(items.map(item => item.updateComplete));
		return items.filter((item) => {
			const role = item.getAttribute('role');
			return (role === 'menuitem' || role === 'menuitemcheckbox' || role === 'menuitemradio' || item.tagName === 'D2L-MENU-ITEM-RETURN');
		});
	}

	_isFocusable(item) {
		if (item.nodeType !== 1) {
			return false;
		}
		if (item.getAttribute('tabindex') !== '0' && item.getAttribute('tabindex') !== '-1') {
			return false;
		}
		if (window.getComputedStyle(item, null).getPropertyValue('display') === 'none') {
			return false;
		}
		return true;
	}

	_labelChanged() {
		this.setAttribute('aria-label', this.label);
		const returnItem = this._getMenuItemReturn();
		if (returnItem) returnItem.setAttribute('text', this.label);
	}

	_onKeyDown(e) {
		const rootTarget = e.composedPath()[0];
		if (this._items.indexOf(rootTarget) === -1) return;

		if (e.keyCode === keyCodes.DOWN || e.keyCode === keyCodes.UP) {
			// prevent scrolling when up/down arrows pressed
			e.preventDefault();
			e.stopPropagation();
			if (e.keyCode === keyCodes.DOWN) {
				this._focusNext(rootTarget);
			} else if (e.keyCode === keyCodes.UP) {
				this._focusPrevious(rootTarget);
			}
			return;
		}

		if (this.childView && e.keyCode === keyCodes.LEFT) {
			e.stopPropagation();
			this.hide();
			return;
		}

	}

	_onKeyPress(e) {
		if (this._items.indexOf(e.composedPath()[0]) === -1) return;

		if (e.keyCode === keyCodes.DOWN || e.keyCode === keyCodes.UP
			|| e.keyCode === keyCodes.SPACE || e.keyCode === keyCodes.ENTER
			|| e.keyCode === keyCodes.ESCAPE) {
			return;
		}

		e.stopPropagation();

		const startsWith = function(item, value) {
			if (item.text && item.text.length > 0 && item.text.toLowerCase().substr(0, 1) === value) {
				return true;
			}
			return false;
		};

		const focusableItems = this._items.filter(this._isFocusable, this);
		if (!focusableItems || focusableItems.length === 0) return;

		const targetItemIndex = focusableItems.indexOf(e.composedPath()[0]);

		const getNextOrFirstIndex = function(itemIndex) {
			if (itemIndex === focusableItems.length - 1) {
				return 0;
			}
			return itemIndex + 1;
		}.bind(this);

		/* "charCode" is used instead of "key" due to Safari not supporting */
		const searchChar = String.fromCharCode(e.charCode).toLowerCase();

		let itemIndex = getNextOrFirstIndex(targetItemIndex);
		while (itemIndex !== targetItemIndex) {
			const item = focusableItems[itemIndex];
			if (startsWith(item, searchChar)) {
				item.focus();
				return;
			}
			itemIndex = getNextOrFirstIndex(itemIndex);
		}

	}

	_onMenuItemsChanged() {
		requestAnimationFrame(async() => {
			this._items = await this._getMenuItems();
			this._updateItemAttributes();
		});
	}

	_onShowComplete() {
		if (!this.isActive()) return;

		this.focus();
	}

	_onViewResize(e) {
		if (this.childView) return;

		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: e.detail
		};
		this.dispatchEvent(new CustomEvent('d2l-menu-resize', eventDetails));
	}

	_onVisibilityChange() {
		this.active = this.isActive();
	}

	_tryGetNextFocusable(item) {
		const focusableItems = this._items.filter(this._isFocusable, this);
		if (!focusableItems || focusableItems.length === 0) {
			return;
		}

		if (!item) {
			return focusableItems[0];
		}

		const itemIndex = focusableItems.indexOf(item);
		if (itemIndex === focusableItems.length - 1) {
			return;
		}

		return focusableItems[itemIndex + 1];

	}

	_tryGetPreviousFocusable(item) {
		const focusableItems = this._items.filter(this._isFocusable, this);
		if (!focusableItems || focusableItems.length === 0) {
			return;
		}

		if (!item) {
			return focusableItems[focusableItems.length - 1];
		}

		const itemIndex = focusableItems.indexOf(item);
		if (itemIndex === 0) {
			return;
		}

		return focusableItems[itemIndex - 1];

	}

	_updateItemAttributes() {
		if (!this._items || this._items.length === 0) return;

		const visibleItems = [];

		for (let i = 0; i < this._items.length; i++) {
			const item = this._items[i];
			item.removeAttribute('first');
			item.removeAttribute('last');
			if (!item.hidden) {
				item.setAttribute('tabindex', visibleItems.length === 0 ? 0 : -1);
				visibleItems.push(item);
			}
		}

		if (visibleItems.length > 0) {
			visibleItems[0].setAttribute('first', true);
			visibleItems[visibleItems.length - 1].setAttribute('last', true);
		}

	}
}

customElements.define('d2l-menu', Menu);
