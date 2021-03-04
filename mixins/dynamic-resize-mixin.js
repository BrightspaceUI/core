import { html } from 'lit-element/lit-element.js';
import { throttle } from 'lodash-es';

export const DynamicResizeMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * Use predefined classes on slot elements to set min and max buttons to show
			 */
			autoShow: {
				type: Boolean,
				attribute: 'auto-show',
			},
			/**
			 * minimum amount of buttons to show
			 */
			minToShow: {
				type: Number,
				reflect: true,
				attribute: 'min-to-show',
			},
			/**
			 * maximum amount of buttons to show
			 */
			maxToShow: {
				type: Number,
				reflect: true,
				attribute: 'max-to-show',
			},
			/**
			 * Shrinks the More Actions button down to '...' for scenarios with tight spacing
			 */
			_mini: {
				type: Boolean,
				reflect: true
			},
			_overflowHidden: {
				type: Boolean,
			},
			_chompIndex: {
				type: Number,
			},
		};
	}
	constructor() {
		super();
		this._handleResize = this._handleResize.bind(this);
		this._addEventListeners = this._addEventListeners.bind(this);
		this._chomp = this._chomp.bind(this);
		this._getLayoutItems = this._getLayoutItems.bind(this);
		this._collectItems = this._collectItems.bind(this);
		this._handleSlotChange = this._handleSlotChange.bind(this);

		this._throttledResize = throttle(this._handleResize, 15);

		this._overflowHidden = this._overflowHidden ?? false;
		this.autoShow = this.autoShow ?? false;
		this.maxToShow = this.maxToShow ?? -1;
		this.minToShow = this.minToShow ?? 1;
		this._mini = this.openerType === 'icon';
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._removeEventListeners();
	}

	async firstUpdated() {
		super.firstUpdated();

		// selected elements
		this._buttonSlot = this.shadowRoot.getElementById('buttons');
		// this._buttonSlot.addEventListener('slotchange', this._handleSlotChange);
		this._container = this.shadowRoot.querySelector('.d2l-button-group-container');

		this._availableWidth = this._container.clientWidth;

		this._autoShowClass = 'd2l-button-group-show';
		this._autoNoShowClass = 'd2l-button-group-no-show';

		this._collectItems();

		if (this.autoShow) {
			this._autoDetectBoundaries(this._slotItems);
		}
		this._chomp();

	}
	update(changedProperties) {
		super.update(changedProperties);
		if (changedProperties.get('autoShow')) {
			this._autoDetectBoundaries(this._getLayoutItems());
		}

		if (changedProperties.get('minToShow') || changedProperties.get('maxToShow')) {
			this._chomp();
		}

		// slight hack, overflowMenu isnt being rendered initially so wait until update
		// to calculate its width
		if (!this._overflowMenuWidth) {
			// this action needs to be deferred until first render of our overflow button
			requestAnimationFrame(() => {
				this._chomp();
			});
		}
	}
	connectedCallack() {
		this._addEventListeners();
	}
	_addEventListeners() {
		window.addEventListener('resize', this._throttledResize);
	}
	_autoDetectBoundaries(items) {

		let minToShow, maxToShow;
		for (let i = 0; i < items.length; i++) {
			if (items[i].classList.contains(this._autoShowClass)) {
				minToShow = i + 1;
			}
			if (maxToShow === undefined && items[i].classList.contains(this._autoNoShowClass)) {
				maxToShow = i;
			}
		}

		if (minToShow !== undefined) {
			this.minToShow = minToShow;
		}
		if (maxToShow !== undefined) {
			this.maxToShow = maxToShow;
		}
	}
	_chomp(items = this._layoutItems) {

		this._overflowMenu = this.shadowRoot.querySelector('.d2l-overflow-dropdown');
		this._overflowMenuMini = this.shadowRoot.querySelector('.d2l-overflow-dropdown-mini');
		if (this.openerType === 'icon' && this._overflowMenuMini) {
			this._overflowMenuWidth = this._overflowMenuMini.offsetWidth;
		} else if (this._overflowMenu) {
			this._overflowMenuWidth = this._overflowMenu.offsetWidth;
		}

		const showing = {
			count: 0,
			width: 0
		};

		let isSoftOverflowing, isForcedOverflowing;
		for (let i = 0; i < this._layoutItems.length; i++) {
			const itemLayout = this._layoutItems[i];

			// handle minimum items to show
			if (showing.count < this.minToShow) {
				showing.width += itemLayout.width;
				showing.count += 1;
				itemLayout.trigger = 'force-show';
				itemLayout.isChomped = false;
				continue;
			}

			// handle maximum items to show
			if (this.maxToShow >= 0 && showing.count >= this.maxToShow) {
				isForcedOverflowing = true;
				itemLayout.isChomped = true;
				itemLayout.trigger = 'force-hide';
				continue;
			}

			// chomp or unchomp based on space available, and we've already handled min/max above
			if (!isSoftOverflowing && showing.width + itemLayout.width < this._availableWidth) {
				showing.width += itemLayout.width;
				showing.count += 1;
				itemLayout.isChomped = false;
				itemLayout.trigger = 'soft-show';

			} else {
				isSoftOverflowing = true;
				itemLayout.isChomped = true;
				itemLayout.trigger = 'soft-hide';

			}

		}
		// if there is at least one showing and no more to be hidden, enable collapsing more button to [...]
		this._overflowMenuHidden = items.length === showing.count;
		if (!this._overflowMenuHidden && (isSoftOverflowing || isForcedOverflowing)) {
			for (let j = this._layoutItems.length; j--;) {
				if (showing.width + this._overflowMenuWidth < this._availableWidth) {
					break;
				}
				const itemLayoutOverflowing = this._layoutItems[j];
				if (itemLayoutOverflowing.trigger !== 'soft-show') {
					continue;
				}
				showing.width -= itemLayoutOverflowing.width;
				showing.count -= 1;
				isSoftOverflowing = true;
				itemLayoutOverflowing.trigger = 'soft-hide';
				itemLayoutOverflowing.isChomped = true;
			}
		}
		const overflowDropdownOverflowing = (showing.width + this._overflowMenuWidth >= this._availableWidth);
		const swapToMiniButton = overflowDropdownOverflowing && !this._overflowMenuHidden;

		this._mini = this.openerType === 'icon' || swapToMiniButton;
		this._chompIndex = showing.count;

		this._slotItems.forEach((element, index) => {
			if (index >= this._chompIndex) {
				element.setAttribute('chomped', true);
			} else {
				element.removeAttribute('chomped');
			}
		});
		this._overflowItems = this._dropdownItems.slice(this._chompIndex);
		this.dispatchEvent(new CustomEvent('d2l-button-group-updated', { bubbles: true, composed: true }));
	}
	_collectItems() {
		// get the items from the button slot
		this._slotItems = this._getSlotItems();
		/// convert them to layout items (calculate widths)
		this._layoutItems = this._getLayoutItems(this._slotItems);
		// convert to dropdown items (for overflow menu)
		this._dropdownItems = this._slotItems.map((node) => this._convertToDropdownItem(node));
	}
	_convertToDropdownItem(node) {
		const tagName = node.tagName.toLowerCase();
		let menuItem;
		if (tagName === 'd2l-button' || tagName === 'd2l-button-subtle' || tagName === 'button' || tagName === 'd2l-button-icon') {
			menuItem = this._createMenuItem(node);
		} else if (tagName === 'd2l-link' || tagName === 'a') {
			menuItem = this._createMenuItemLink(node);
		} else if (node.getAttribute('role') === 'separator') {
			menuItem = this._createMenuItemSeparator();
		} else if (tagName === 'd2l-menu' || tagName === 'd2l-dropdown' || tagName === 'd2l-dropdown-button' || tagName === 'd2l-dropdown-button-subtle') {
			menuItem = this._createMenuItemMenu(node);
		} else if (tagName === 'd2l-menu-item') {
			// if the menu item has children treat it as a menu item menu
			if (node.children.length > 0) {
				menuItem = this._createMenuItemMenu(node);
			} else {
				menuItem = this._createMenuItem(node);
			}
		} else if (node.classList.contains('d2l-button-group-custom-item')) {
			menuItem = this._createMenuItem(node);
		} else {
			return;
		}
		return menuItem;
	}
	_createMenuItem(node) {
		const childText = node.text || node.firstChild && (node.firstChild.label || node.firstChild.text || node.firstChild.textContent.trim());
		const disabled = node.disabled;
		return html`<d2l-menu-item 
			?disabled=${disabled}
			text="${childText}">
		</d2l-menu-item>`;
	}

	_createMenuItemLink(node) {
		const preventDefault = node.dataPreventDefault;
		const text =  node.textContent.trim();
		const href =  node.href;
		const target = node.target;

		return html`<d2l-menu-item-link 
			text="${text}"
			href="${href}"
			target="${target}"
			?preventDefault=${preventDefault}
		></d2l-menu-item-link>`;
	}

	_createMenuItemMenu(node) {
		const menuOpener =
			node.querySelector('d2l-dropdown-button')
			||  node.querySelector('d2l-dropdown-button-subtle');

		const openerText = node.text || menuOpener.text;
		const subMenu = node.querySelector('d2l-menu');
		const subItems = [];

		// iterate through any sub menues and turn them into menu items
		for (const node of subMenu.children) {
			subItems.push(this._convertToDropdownItem(node));
		}
		return html`<d2l-menu-item
			text="${openerText}"
		>
			<d2l-menu>
				${subItems}
			</d2l-menu>
		</d2l-menu-item>`;
	}
	_getLayoutItems(filteredNodes) {

		const items = filteredNodes.map((node) => {
			const computedStyles = window.getComputedStyle(node);
			return {
				type: node.tagName.toLowerCase(),
				isChomped: false,
				width: node.offsetWidth
					+ parseInt(computedStyles.marginLeft.replace('px', ''))
					+ parseInt(computedStyles.marginRight.replace('px', '')),
				node: node
			};
		});

		return items;
	}
	_getSlotItems() {
		const nodes = this._buttonSlot.assignedNodes();
		const filteredNodes = nodes.filter((node) => {
			const isNode = node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'template';
			const isHidden = isNode && window.getComputedStyle(node).display === 'none';

			return isNode && !isHidden;
		});

		return filteredNodes;
	}
	_handleResize() {
		if (!this._container) {
			return;
		}
		this._availableWidth = this._container.clientWidth;
		this._chomp();
	}
	_handleSlotChange() {
		this._collectItems();

		if (this.autoShow) {
			this._autoDetectBoundaries(this._slotItems);
		}

		this._chomp();
	}
	_removeEventListeners() {
		window.removeEventListener('resize', this._throttledResize);
		this._buttonSlot.removeEventListener('slotchange', this._handleSlotChange);
	}
};
