/* eslint-disable sort-class-members/sort-class-members */
import '../colors/colors.js';
import '../dropdown/dropdown-menu.js';
import '../menu/menu-item.js';
import '../menu/menu-item-link.js';
import '../menu/menu-item-separator.js';
import '../button/button.js';
import '../button/button-subtle.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-button.js';
import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-more.js';
import '../menu/menu.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ChompMixin } from './chompMixin.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { throttle } from 'lodash-es';

/**
 *
 * A button group component that can be used to display a set of buttons
 *
 * @slot - Buttons, dropdown buttons, links or other items to be added to the container
 */
class ButtonGroup extends RtlMixin(LocalizeCoreElement(ChompMixin(LitElement))) {

	static get properties() {
		return {
			// todo implement autoshow: uses classes as min and max delimeters
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
			/**
			 * Setting this property to true will change the look of the dopdown button to a subtle button for subtle button groups
			 */
			subtle: {
				type: Boolean,
				attribute: 'subtle',
			},
			/**
			 * Setting this property to icon will change the dropdown opener to a ... icon
			 */
			openerType: {
				type: String,
				attribute: 'opener-type',
			},
			/**
			 * Setting this property to true will change the look of the dopdown button to a subtle button for action button groups
			 */
			hideOverflowMenu: {
				type: Boolean,
			},
			_chompIndex: {
				type: Number,
			},
			_items: {
				type: Array,
			},
			_availableWidth: {
				type: Number,
			},
			_overflowMenuWidth: {
				type: Number,
			},
			_overflowHidden: {
				type: Boolean,
			}
		};
	}

	static get styles() {
		return [offscreenStyles,
			css`
			:host {
				display: block;
			}

			:host .d2l-button-group-container {
				display: flex;
				flex: 0 1 auto;
				flex-wrap: wrap;
			}

			/* using !important to force override.  ex. consumer has explicitly
			specified display. note: inline styles, and shadow-dom with consumer specified
			css will override this unless !important is specified */
			:host .d2l-button-group-container ::slotted([hidden]) {
				display: none !important;
			}

			:host .d2l-button-group-container ::slotted(d2l-button),
			:host .d2l-button-group-container ::slotted(d2l-button-icon),
			:host .d2l-button-group-container ::slotted(d2l-link),
			:host .d2l-button-group-container ::slotted(span),
			:host .d2l-button-group-container ::slotted(d2l-dropdown:not(.d2l-overflow-dropdown)),
			:host .d2l-button-group-container ::slotted(d2l-dropdown-button),
			:host .d2l-button-group-container ::slotted(d2l-dropdown-button-subtle),
			:host .d2l-button-group-container ::slotted(.d2l-button-group-custom-item) {
				margin-right: 0.6rem;
			}

			:host([dir="rtl"]) .d2l-button-group-container ::slotted(d2l-button),
			:host([dir="rtl"]) .d2l-button-group-container ::slotted(d2l-button-icon),
			:host([dir="rtl"]) .d2l-button-group-container ::slotted(d2l-link),
			:host([dir="rtl"]) .d2l-button-group-container ::slotted(span),
			:host([dir="rtl"]) .d2l-button-group-container ::slotted(d2l-dropdown:not(.d2l-overflow-dropdown)),
			:host([dir="rtl"]) .d2l-button-group-container ::slotted(d2l-dropdown-button),
			:host([dir="rtl"]) .d2l-button-group-container ::slotted(d2l-dropdown-button-subtle),
			:host([dir="rtl"]) .d2l-button-group-container ::slotted(.d2l-button-group-custom-item) {
				margin-left: 0.6rem;
				margin-right: 0;
			}

			:host([subtle]) .d2l-button-group-container ::slotted(d2l-button-subtle) {
				margin-right: 0.2rem;
			}

			:host([subtle][dir="rtl"]) .d2l-button-group-container ::slotted(d2l-button-subtle) {
				margin-left: 0.2rem;
				margin-right: 0;
			}

			:host([subtle]) .d2l-dropdown-subtle-opener-text,
			.d2l-dropdown-opener-text {
				margin-right: 0.3rem;
				vertical-align: middle;
			}

			:host(:dir(rtl)) .d2l-dropdown-opener-text,
			:host([subtle]:dir(rtl)) .d2l-dropdown-subtle-opener-text {
				margin-left: 0.3rem;
				margin-right: 0;
			}`
		];
	}

	constructor() {
		super();
		this._handleResize = this._handleResize.bind(this);
		this._getItems = this._getItems.bind(this);
		this._addEventListeners = this._addEventListeners.bind(this);
		this._getOverflowMenu = this._getOverflowMenu.bind(this);
		this._chomp = this._chomp.bind(this);
		this._createMenuItem = this._createMenuItem.bind(this);
		this._convertToDropdownItem = this._convertToDropdownItem.bind(this);
		this._throttledResize = throttle(this._handleResize, 15);

		this._autoShowClass = 'd2l-button-group-show',
		this._autoNoShowClass = 'd2l-button-group-no-show',

		this._refId = 0;
		this._slotItems = [];
		this._overflowItems = [];

		// property defaults
		this._overflowHidden = this._overflowHidden ?? false;
		this.autoShow = this.autoShow ?? false;
		this.maxToShow = this.maxToShow ?? -1;
		this.minToShow = this.minToShow ?? 1;
		this._mini = this.openerType === 'icon';
	}

	connectedCallback() {
		super.connectedCallback();
		this._addEventListeners();
	}

	async firstUpdated() {
		super.firstUpdated();

		// selected elements
		this._buttonSlot = this.shadowRoot.getElementById('buttons');
		this._overflowMenuFull = this.shadowRoot.querySelector('.d2l-overflow-dropdown');
		this._overflowMenuMini = this.shadowRoot.querySelector('.d2l-overflow-dropdown-mini');
		this._container = this.shadowRoot.querySelector('.d2l-button-group-container');

		this._availableWidth = this._container.clientWidth;
		this._items = this._getItems();
		this._overflowItems = this._items.map(({ node }) => this._convertToDropdownItem(node));

		if (this.autoShow) {
			this._autoDetectBoundaries(this._slotItems);
		}
		this._chomp();

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
	_getItems() {
		const nodes = this._buttonSlot.assignedNodes();
		const filteredNodes = nodes.filter((node) => {
			return node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'template';
		});

		const items = filteredNodes.map((node) => ({
			type: node.tagName.toLowerCase(),
			isChomped: false,
			width: node.offsetWidth
				+ parseInt(window.getComputedStyle(node).marginLeft.replace('px', ''))
				+ parseInt(window.getComputedStyle(node).marginRight.replace('px', '')),
			node: node
		}));
		this._slotItems = filteredNodes;

		return items;
	}

	_chomp(items) {

		if (!items) {
			items = this._getItems();
		}
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
		for (let i = 0; i < this._items.length; i++) {
			const itemLayout = this._items[i];

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
		const overflowHidden = items.length === showing.count;
		if (overflowHidden) {
			this._overflowMenuHidden = true;
		} else {
			this._overflowMenuHidden = false;
		}
		if (!overflowHidden && (isSoftOverflowing || isForcedOverflowing)) {
			for (let j = this._items.length; j--;) {
				if (showing.width + this._overflowMenuWidth < this._availableWidth) {
					break;
				}
				const itemLayoutOverflowing = this._items[j];
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
		const swapToMiniButton = this.minToShow > 0 && overflowDropdownOverflowing && !overflowHidden;
		if (this.openerType === 'icon' || swapToMiniButton) {
			this._mini = true;
		} else {
			this._mini = false;
		}

		this._chompIndex = showing.count;

		this.dispatchEvent(new CustomEvent('d2l-button-group-updated', { bubbles: true, composed: true }));

	}

	_convertToDropdownItem(node) {
		const tagName = node.tagName.toLowerCase();
		let menuItem;
		// const node = item.node;
		if (tagName === 'd2l-button' || tagName === 'd2l-button-subtle' || tagName === 'button' || tagName === 'd2l-button-icon') {
			menuItem = this._createMenuItem(node);
		} else if (tagName === 'd2l-link' || tagName === 'a') {
			menuItem = this._createMenuItemLink(node);
		} else if (node.getAttribute('role') === 'separator') {
			menuItem = this._createMenuItemSeparator();
		} else if (tagName === 'd2l-menu' || tagName === 'd2l-dropdown' || tagName === 'd2l-dropdown-button' || tagName === 'd2l-dropdown-button-subtle') {
			menuItem = this._createMenuItemMenu(node);
		} else if (tagName === 'd2l-menu-item') {
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

	update(changedProperties) {
		super.update(changedProperties);
		if (changedProperties.get('autoShow')) {
			this._autoDetectBoundaries(this._getItems());
		}

		if (changedProperties.get('minToShow') || changedProperties.get('maxToShow')) {
			this._chomp();
		}

		// slight hack, overflowMenu isnt being rendered initially so wait until update
		// to calculate its width
		if (!this._overflowMenuWidth || (this._mini && !this._overflowMenuMini)) {
			// this action needs to be defered until first render of our overflow button
			requestAnimationFrame(() => {
				this._chomp();
			});
		}
	}

	_handleResize() {
		if (!this._container) {
			return;
		}
		this._availableWidth = this._container.clientWidth;
		this._chomp();
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._removeEventListeners();
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

	_getOverflowMenu(overflowItems, chompIndex) {

		const moreActionsText = this.localize('components.button-group.moreActions');
		const menu = html`<d2l-dropdown-menu>
			<d2l-menu id="overflowMenu" label="${moreActionsText}">
				${overflowItems.slice(chompIndex)}
			</d2l-menu>
		</d2l-dropdown-menu>`;

		if (this._mini) {
			return html`<d2l-dropdown-more class="d2l-overflow-dropdown-mini" text="${moreActionsText}">
				${menu}
			</d2l-dropdown-more>`;
		}

		if (this.subtle) {
			return html`<d2l-dropdown-button-subtle class="d2l-overflow-dropdown" text="${moreActionsText}">
				${menu}
			</d2l-dropdown-button-subtle>`;
		}

		return html`<d2l-dropdown-button class="d2l-overflow-dropdown" text="${moreActionsText}">
			${menu}
		</d2l-dropdown-button>`;
	}
	render() {
		// hide any buttons past our chomp index
		this._slotItems.forEach((element, index) => {
			if (index >= this._chompIndex) {
				element.setAttribute('hidden', true);
			} else {
				element.removeAttribute('hidden');
			}
		});
		let overflowMenu;
		if (!this._overflowMenuHidden) {
			overflowMenu = this._getOverflowMenu(this._overflowItems, this._chompIndex);
		}
		return html`
			<div class="d2l-button-group-container">
				<slot class="d2l-offscreen"  id="buttons"></slot>
				${overflowMenu}
			</div>
		`;
	}

	_addEventListeners() {
		window.addEventListener('resize', this._throttledResize);
	}

}

customElements.define('d2l-button-group', ButtonGroup);
