/* eslint-disable sort-class-members/sort-class-members */
import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ButtonGroupMixin } from './button-group-mixin.js';
// import { buttonStyles } from './button-styles.js';
// import { ifDefined } from 'lit-html/directives/if-defined.js';
// import { labelStyles } from '../typography/styles.js';
import { offscreenStyles } from '../offscreen/offscreen.js';

/**
 *
 * A button group component that can be used to display a set of buttons 
 *
 * @slot - Buttons, dropdown buttons, links or other items to be added to the container
 */
class ButtonGroup extends ButtonGroupMixin(LitElement) {

	static get properties() {
		return {
			// todo implement autoshow: uses classes as min and max delimeters
			// _autoShow: {
			// 	type: String,
			// 	value: false
			// },
			/**
			 * minimum amount of buttons to show
			 */
			minToShow: {
				type: Number
			},
			/**
			 * maximum amount of buttons to show
			 */
			maxToShow: {
				type: Number
			}
		};
	}


	static get styles() {
		return [offscreenStyles,
			css`
			:host .d2l-button-group-container {
				display: flex;
				flex: 0 1 auto;
				flex-wrap: wrap;
			}

			/* using !important to force override.  ex. consumer has explicitly
			specified display. note: inline styles, and shadow-dom with consumer specified
			css will override this unless !important is specified */
			:host .d2l-button-group-container ::slotted([chomped]) {
				display: none !important;
			}

			:host .d2l-button-group-container ::slotted(d2l-button),
			:host .d2l-button-group-container ::slotted(d2l-button-subtle),
			:host .d2l-button-group-container ::slotted(d2l-button-icon),
			:host .d2l-button-group-container ::slotted(d2l-link),
			:host .d2l-button-group-container ::slotted(span),
			:host .d2l-button-group-container ::slotted(d2l-dropdown:not(.d2l-overflow-dropdown)),
			:host .d2l-button-group-container ::slotted(d2l-dropdown-button),
			:host .d2l-button-group-container ::slotted(d2l-dropdown-button-subtle),
			:host .d2l-button-group-container ::slotted(.d2l-button-group-custom-item) {
				margin-right: 0.75rem;
			}

			:host(:dir(rtl)) .d2l-button-group-container ::slotted(d2l-button),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(d2l-button-subtle),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(d2l-button-icon),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(d2l-link),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(span),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(d2l-dropdown:not(.d2l-overflow-dropdown)),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(d2l-dropdown-button),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(d2l-dropdown-button-subtle),
			:host(:dir(rtl)) .d2l-button-group-container ::slotted(.d2l-button-group-custom-item) {
				margin-left: 0.75rem;
				margin-right: 0;
			}

			/* using !important to force override.  ex. consumer has explicitly
			specified display. note: inline styles, and shadow-dom with consumer specified
			css will override this unless !important is specified */
			:host .d2l-button-group-container ::slotted([chomped]) {
				display: none !important;
			}

			:host([mini]) .d2l-dropdown-opener {
				padding-left: 0.5rem;
				padding-right: 0.5rem;
			}
			.d2l-dropdown-opener-text {
				margin-right: 0.3rem;
				vertical-align: middle;
			}

			:host(:dir(rtl)) .d2l-dropdown-opener-text {
				margin-left: 0.3rem;
				margin-right: 0;
			}
			# todo: apply the d2l-offscreen class in mini mode so the text is hidden
			:host([mini]) .d2l-dropdown-opener-text {
				@apply --d2l-offscreen;
			}`
		];
	}

	constructor() {
		super();
		this._handleResize = this._handleResize.bind(this);
		this._getItems = this._getItems.bind(this);
		this._addEventListeners = this._addEventListeners.bind(this);
		this._chomp = this._chomp.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		this._addEventListeners();
	}

	async firstUpdated() {
		super.firstUpdated();

		// selected elements
		this._buttonSlot = this.shadowRoot.getElementById('buttons');
		this._overflowMenu = this.shadowRoot.querySelector('.d2l-overflow-dropdown');
		this._container = this.shadowRoot.querySelector('.d2l-button-group-container');
		this._layout = {
			totalWidth: 0
		};
		this._items = this._getItems();

		this._layout.items = this._items.map((item) => {
			const itemLayout = this._createLayoutItem(item);
			if (itemLayout.isVisible) {
				this._layout.totalWidth += itemLayout.width;
			}
			return itemLayout;
		});

		this._layout.overflowMenuWidth = this._overflowMenu.offsetWidth;
		this._layout.availableWidth = this._getContainerWidth();
		this._chomp(this._items);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._removeEventListeners();
	}

	render() {
		return html`
			<div class="d2l-button-group-container">
				<slot id="buttons"></slot>
				<d2l-dropdown class="d2l-overflow-dropdown">
					<d2l-button class="d2l-dropdown-opener">
						<!-- todo: localize this text or provide it as a property -->
						<span class="d2l-dropdown-opener-text">More Actions</span>
						<!-- todo: determine if icon is used/provide it as prop -->
						<!-- <d2l-icon icon="[[icon]]"></d2l-icon> -->
					</d2l-button>
					<d2l-dropdown-menu render-content="">
						<!-- todo: localize this text or provide it as a property -->
						<d2l-menu id="overflowMenu" label="More Actions">
						</d2l-menu>
					</d2l-dropdown-menu>
				</d2l-dropdown>
			</div>
		`;
	}

	_addEventListeners() {
		window.addEventListener('resize', this._handleResize);
	}

	_createLayoutItem(item) {

		const refId = `bgi-${++this._refId}`;
		item.setAttribute('bgi-ref', refId);

		const itemLayout = {
			refId: refId,
			isVisible: (item.offsetParent !== null),
			width: item.offsetWidth
				+ parseInt(window.getComputedStyle(item).marginLeft.replace('px', ''))
				+ parseInt(window.getComputedStyle(item).marginRight.replace('px', ''))
		};

		return itemLayout;

	}
	// _getItemLayout(item) {
	// 	const layout = {
	// 		width: item.offsetWidth
	// 			+ parseInt(window.getComputedStyle(item).marginLeft.replace('px', ''))
	// 			+ parseInt(window.getComputedStyle(item).marginRight.replace('px', ''))
	// 	};
	// 	return layout.width;
	// }

	_getItems() {
		const nodes = this._buttonSlot.assignedNodes();
		const filteredNodes = nodes.filter((node) => {
			return node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'template';
		});
		return filteredNodes;
	}

	_removeFromOverflowMenu(item) {

		const menuItem = this._overflowMenu.querySelector(`[bgi-ref="${item.getAttribute('bgi-ref') }"]`);
		if (!menuItem) {
			return;
		}

		const tagName = item.tagName.toLowerCase();
		if (tagName === 'd2l-dropdown-button' || tagName === 'd2l-dropdown-button-subtle') {
			const menu = menuItem.querySelector('d2l-menu');
			menu.removeAttribute('child-view');
			item.querySelector('d2l-dropdown-menu').appendChild(
				menu
			);
		}
		menuItem.parentNode.removeChild(menuItem);

	}

	// _chomp(item, index) {
	// 	this._moveToOverflow(item, index);
	// 	this._removeFromMainMenu(item, index);
	// }
	_chomp(items) {

		if (this._layout.totalWidth === 0) {
			this._overflowMenu.style.display = 'none';
			return;
		}

		if (!items) {
			items = this._getItems();
		}

		const showing = {
			count: 0,
			width: 0
		};

		const chomp = (item, index) => {
			if (!item.hasAttribute('chomped')) {
				this._addToOverflowMenu(item, index);
				item.setAttribute('chomped', 'chomped');
			}
		};

		const undoChomp = function(item) {
			if (item.hasAttribute('chomped')) {
				this._removeFromOverflowMenu(item);
				item.removeAttribute('chomped');
			}
		}.bind(this);

		let isSoftOverflowing, isForcedOverflowing;
		for (let i = 0; i < this._layout.items.length; i++) {
			const itemLayout = this._layout.items[i];

			if (!itemLayout.isVisible) {
				continue;
			}

			// make sure we show the min
			if (showing.count < this.minToShow) {
				showing.width += itemLayout.width;
				showing.count += 1;
				itemLayout.trigger = 'force-show';
				itemLayout.isChomped = false;
				continue;
			}

			// make sure we only show the max
			if (this.maxToShow >= 0 && showing.count >= this.maxToShow) {
				isForcedOverflowing = true;
				itemLayout.trigger = 'force-hide';
				itemLayout.isChomped = true;
				continue;
			}

			// chomp or unchomp based on space available, and we've already handled min/max above
			if (!isSoftOverflowing && ((showing.width + itemLayout.width) < this._layout.availableWidth)) {
				showing.width += itemLayout.width;
				showing.count += 1;
				itemLayout.trigger = 'soft-show';
				itemLayout.isChomped = false;
			} else {
				// as soon as one overflows due to space, overflow the rest so they don't seem out of order
				isSoftOverflowing = true;
				itemLayout.trigger = 'soft-hide';
				itemLayout.isChomped = true;
			}

		}

		if (isSoftOverflowing || isForcedOverflowing) {
			for (let j = this._layout.items.length; j--;) {
				if (showing.width + this._layout.overflowMenuWidth < this._layout.availableWidth) {
					break;
				}
				const itemLayoutOverflowing = this._layout.items[j];
				if (!itemLayoutOverflowing.isVisible || itemLayoutOverflowing.trigger !== 'soft-show') {
					continue;
				}
				showing.width -= itemLayoutOverflowing.width;
				isSoftOverflowing = true;
				itemLayoutOverflowing.trigger = 'soft-hide';
				itemLayoutOverflowing.isChomped = true;
			}
		}

		// if there is at least one showing and no more to be hidden, enable collapsing more button to [...]
		if (this.minToShow > 0 && (showing.width + this._layout.overflowMenuWidth > this._layout.availableWidth)) {
			this.mini = true;
		} else {
			this.mini = false;
		}

		let chompIndex = 0;
		for (let k = 0; k < this._layout.items.length; k++) {
			const itemLayoutDetailed = this._layout.items[k];
			if (itemLayoutDetailed.isChomped) {
				chomp(items[k], chompIndex++);
			} else {
				undoChomp(items[k]);
			}
		}

		// if there is at least one showing and no more to be hidden, enable collapsing more button to [...]
		//if (this.minToShow > 0 && (showing.width + this._layout.overflowMenuWidth > this._layout.availableWidth)) {
		//	this.mini = true;
		//} else {
		//	this.mini = false;
		//}

		this._overflowMenu.style.display = ((!isSoftOverflowing && !isForcedOverflowing) ? 'none' : '');

		this.dispatchEvent(new CustomEvent('d2l-button-group-updated', { bubbles: true, composed: true }));

	}

	_addToOverflowMenu(item, index) {

		const tagName = item.tagName.toLowerCase();
		let menuItem;
		if (tagName === 'd2l-button' || tagName === 'd2l-button-subtle' || tagName === 'button' || tagName === 'd2l-button-icon') {
			menuItem = this._createMenuItem(item);
		} else if (tagName === 'd2l-link' || tagName === 'a') {
			menuItem = this._createMenuItemLink(item);
		} else if (item.getAttribute('role') === 'separator') {
			menuItem = this._createMenuItemSeparator();
		} else if (tagName === 'd2l-dropdown-button' || tagName === 'd2l-dropdown-button-subtle') {
			menuItem = this._createMenuItemMenu(item);
		} else if (item.classList.contains('d2l-button-group-custom-item')) {
			menuItem = this._createMenuItem(item);
		} else {
			return;
		}

		menuItem.setAttribute('bgi-ref', item.getAttribute('bgi-ref'));
		item.setAttribute('chomped', 'chomped');
		/**
		 * 3 scenarios
		 * - adding to start (ex. due to resize smaller)
		 * - adding to end (ex. initial chomp)
		 * - adding to middle (ex. new button added to light-dom shifting everything)
		 */
		const overflowDropdown = this._overflowMenu.querySelector('d2l-menu#overflowMenu');
		if (overflowDropdown.childNodes.length <= index) {
			overflowDropdown.appendChild(menuItem);
		} else {
			overflowDropdown.insertBefore(menuItem, overflowDropdown.childNodes[index]);
		}

	}

	_removeFromMainMenu(item) {

		// const menuItem = dom(this._overflowMenu).querySelector('[bgi-ref="' + item.getAttribute('bgi-ref') + '"]');
		// if (!menuItem) {
		// 	return;
		// }

		// const tagName = item.tagName.toLowerCase();
		// if (tagName === 'd2l-dropdown-button' || tagName === 'd2l-dropdown-button-subtle') {
		// 	const menu = dom(menuItem).querySelector('d2l-menu');
		// 	menu.removeAttribute('child-view');
		// 	dom(item).querySelector('d2l-dropdown-menu').appendChild(
		// 		menu
		// 	);
		// }
		// dom(dom(menuItem).parentNode).removeChild(menuItem);

	}
	_getContainerWidth() {
		const container = this.shadowRoot.querySelector('.d2l-button-group-container');
		const width = container.clientWidth;
		return width;
	}
	_handleResize() {
		if (!this._layout || !this._container) {
			return;
		}
		this._layout.availableWidth = this._container.clientWidth;
		this._chomp();

		// const containerWidth = this._getContainerWidth();
		// // const overflowButtonWidth = this._getItemLayout(this._overflowMenu);
		// const itemWidths = [];
		// // let totalWidth = overflowButtonWidth;
		// for (let i = 0; i < this._itemStack.length; i++) {
		// 	itemWidths[i] = this._getItemLayout(this._itemStack[i]);
		// 	totalWidth += itemWidths[i];
		// }

		// if (totalWidth > containerWidth) {
		// 	console.log("CHOMP CHOMP CHOMP");
		// 	this._chomp(this._itemStack[this._itemStack.length - 1], this._itemStack.length - 1);
		// }
	}
	_removeEventListeners() {
		window.removeEventListener('resize', this._handleResize);
	}

	_createMenuItem(item) {
		const menuItem = document.createElement('d2l-menu-item');
		const childText = item.firstChild && (item.firstChild.label || item.firstChild.text || item.firstChild.textContent.trim());
		menuItem.setAttribute('text', item.label || item.text || item.textContent.trim() || childText);
		if (item.disabled) {
			menuItem.setAttribute('disabled', 'disabled');
		}
		menuItem.addEventListener('d2l-menu-item-select', () => {
			item.dispatchEvent(new CustomEvent('d2l-button-ghost-click'));
			item.click();
		});
		return menuItem;
	}

	_createMenuItemLink(item) {
		const menuItem = document.createElement('d2l-menu-item-link');
		menuItem.preventDefault = item.getAttribute('data-prevent-default');
		menuItem.setAttribute('text', item.textContent.trim());
		menuItem.setAttribute('href', item.href);
		if (item.target) {
			menuItem.setAttribute('target', item.target);
		}
		return menuItem;
	}

	_createMenuItemSeparator() {
		return document.createElement('d2l-menu-item-separator');
	}

	_createMenuItemMenu(item) {
		item.querySelector('d2l-dropdown-menu').forceRender();
		const subMenu = item.querySelector('d2l-menu');
		const menuItem = document.createElement('d2l-menu-item');
		menuItem.setAttribute('text', item.text);
		menuItem.appendChild(subMenu);
		return menuItem;
	}
}

customElements.define('d2l-button-group', ButtonGroup);
