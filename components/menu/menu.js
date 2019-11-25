import '../icons/icon.js';
import './menu-item-return.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { HierarchicalViewMixin } from '../hierarchical-view/hierarchical-view-mixin.js';

class Menu extends HierarchicalViewMixin(LitElement) {

	static get properties() {
		return {
			active: { type: Boolean, reflect: true },
			label: { type: String },
			role: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [ super.styles, css`
			:host {
				box-sizing: border-box;
				display: block;
				min-width: 180px;
				width: 100%;
				padding-top: 1px;
			}

			:host([active]) .d2l-menu-items d2l-menu-item-return[role="menuitem"],
			:host([active]) .d2l-menu-items ::slotted([role="menuitem"]),
			:host([active]) .d2l-menu-items ::slotted([role="menuitemcheckbox"]),
			:host([active]) .d2l-menu-items ::slotted([role="menuitemradio"]) {
				position: relative;
			}
		`];
	}

	constructor() {
		super();

		this.role = 'menu';

		this._keyCodes = {
			DOWN: 40,
			ENTER: 13,
			ESCAPE: 27,
			LEFT: 37,
			SPACE: 32,
			RIGHT: 39,
			UP: 38
		};
		this._items = [];
	}

	firstUpdated() {
		super.firstUpdated();

		this.addEventListener('d2l-hierarchical-view-show-start', this._onVisibilityChange);
		this.addEventListener('d2l-hierarchical-view-hide-complete', this._onVisibilityChange);
		this.addEventListener('d2l-hierarchical-view-show-complete', this._onShowComplete);
		this.addEventListener('d2l-hierarchical-view-resize', this._onViewResize);
		this.addEventListener('d2l-menu-item-visibility-change', this._onMenuItemsChanged);
		this.addEventListener('keydown', this._onKeyDown);
		this.addEventListener('keypress', this._onKeyPress);

		this._labelChanged();

		if (this.childView) {
			const items = this.shadowRoot.querySelector('.d2l-menu-items');
			items.insertBefore(this._createReturnItem(), items.childNodes[0]);
		}

		this._onMenuItemsChanged();
	}

	connectedCallback() {
		super.connectedCallback();

		this.active = this.getActiveView() === this;
	}

	updated(changedProperties) {
		changedProperties.forEach((oldValue, propName) => {
			if (propName === 'label') {
				this._labelChanged();
			}
		});
	}

	render() {
		return html`
			<div class="d2l-menu-items d2l-hierarchical-view-content">
				<slot></slot>
			</div>
		`;
	}

	focus() {
		this._focusFirst();
	}

	_createReturnItem() {
		const item = document.createElement('d2l-menu-item-return');
		const self = this;
		item.addEventListener('d2l-menu-item-select', (e) => {
			e.stopPropagation();
			self.hide();
		});
		item.text = this.label;
		return item;
	}

	_focusFirst() {
		const item = this._tryGetNextFocusable();
		if (item) {
			item.focus();
		}
	}

	_focusLast() {
		const item = this._tryGetPreviousFocusable();
		if (item) {
			item.focus();
		}
	}

	_focusNext(item) {
		item = this._tryGetNextFocusable(item);
		item ? item.focus() : this._focusFirst();
	}

	_focusPrevious(item) {
		item = this._tryGetPreviousFocusable(item);
		item ? item.focus() : this._focusLast();
	}

	_getMenuItems() {
		const slot = this.shadowRoot.querySelector('slot');
		if (!slot) return;
		const items = slot.assignedNodes().filter((node) => node.nodeType === Node.ELEMENT_NODE);

		const returnItem = this._getMenuItemReturn();
		if (returnItem) {
			items.unshift(returnItem);
		}
		return items.filter((item) => {
			const role = item.role;
			return (role === 'menuitem' || role === 'menuitemcheckbox' || role === 'menuitemradio' || item.tagName === 'D2L-MENU-ITEM-RETURN');
		});
	}

	_getMenuItemReturn() {
		return this.shadowRoot.querySelector('d2l-menu-item-return');
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
		if (returnItem) {
			returnItem.setAttribute('text', this.label);
		}
	}

	_onKeyDown(e) {
		const rootTarget = e.composedPath()[0];
		if (this._items.indexOf(rootTarget) === -1) {
			return;
		}

		if (e.keyCode === this._keyCodes.DOWN || e.keyCode === this._keyCodes.UP) {
			// prevent scrolling when up/down arrows pressed
			e.preventDefault();
			e.stopPropagation();
			if (e.keyCode === this._keyCodes.DOWN) {
				this._focusNext(rootTarget);
			} else if (e.keyCode === this._keyCodes.UP) {
				this._focusPrevious(rootTarget);
			}
			return;
		}

		if (this.childView && e.keyCode === this._keyCodes.LEFT) {
			e.stopPropagation();
			this.hide();
			return;
		}

	}

	_onKeyPress(e) {
		if (this._items.indexOf(e.composedPath()[0]) === -1) {
			return;
		}

		if (e.keyCode === this._keyCodes.DOWN || e.keyCode === this._keyCodes.UP
			|| e.keyCode === this._keyCodes.SPACE || e.keyCode === this._keyCodes.ENTER
			|| e.keyCode === this._keyCodes.ESCAPE) {
			return;
		}

		e.stopPropagation();

		const startsWith = function(item, value) {
			if (item.text && item.text.length > 0 && item.text.substr(0, 1) === value) {
				return true;
			}
			return false;
		};

		const focusableItems = this._items.filter(this._isFocusable, this);
		if (!focusableItems || focusableItems.length === 0) {
			return;
		}

		const targetItemIndex = focusableItems.indexOf(e.composedPath()[0]);

		const getNextOrFirstIndex = function(itemIndex) {
			if (itemIndex === focusableItems.length - 1) {
				return 0;
			}
			return itemIndex + 1;
		}.bind(this);

		/* "charCode" is used instead of "key" due to Safari not supporting */
		const searchChar = String.fromCharCode(e.charCode);

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

	_onMenuItemsChanged() {
		this._items = this._getMenuItems();
		if (!this._items || this._items.length === 0) {
			return;
		}

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

	_onVisibilityChange() {
		this.active = this.isActive();
	}

	_onShowComplete() {
		if (!this.isActive()) {
			return;
		}
		this.focus();
	}

	_onViewResize(e) {
		if (this.childView) {
			return;
		}
		const eventDetails = {
			bubbles: true,
			composed: true,
			detail: e.detail
		};
		this.dispatchEvent(new CustomEvent('d2l-menu-resize', eventDetails));
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
}

customElements.define('d2l-menu', Menu);
