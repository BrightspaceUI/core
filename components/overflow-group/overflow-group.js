import '../colors/colors.js';
import '../dropdown/dropdown-menu.js';
import '../button/button.js';
import '../button/button-subtle.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-button.js';
import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-more.js';
import '../menu/menu.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { throttle } from 'lodash-es';

const OPENER_TYPE = {
	DEFAULT: 'default',
	ICON: 'icon'
};

const OPENER_STYLE = {
	DEFAULT: 'default',
	SUBTLE: 'subtle',
};

/**
 *
 * A button group component that can be used to display a set of buttons
 *
 * @slot - Buttons, dropdown buttons, links or other items to be added to the container
 */
class OverflowGroup extends RtlMixin(LocalizeCoreElement(LitElement)) {

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
			 * Set the opener type to 'icon' for a `...` menu icon instead of `More actions` text
			 * @type {'default'|'icon'}
			 * @default "default"
			 */
			openerType: {
				type: String,
				attribute: 'opener-type'
			},
			/**
			 * Setting this property will change the style of the overflow menu opener
			 * @type {'default'|'icon'}
			 * @default "default"
			 */
			openerStyle: {
				type: String,
				attribute: 'opener-style',
			},
			/**
			 * A property that is set when the menu has been shrunk to the `...` opener
			 */
			_mini: {
				type: Boolean,
				reflect: true
			},
			_chompIndex: {
				type: Number,
			}
		};
	}

	static get styles() {
		return [offscreenStyles,
			css`
			:host {
				display: block;
			}

			:host([opener-style="subtle"]) {
				--d2l-button-icon-fill-color: var(--d2l-color-celestine);
				--d2l-button-icon-fill-color-hover: var(--d2l-color-celestine-minus-1);
			}

			.d2l-overflow-group-container {
				display: flex;
				flex-wrap: wrap;
			}
			:host .d2l-overflow-group-container ::slotted(d2l-button),
			:host .d2l-overflow-group-container ::slotted(d2l-button-icon),
			:host .d2l-overflow-group-container ::slotted(d2l-link),
			:host .d2l-overflow-group-container ::slotted(span),
			:host .d2l-overflow-group-container ::slotted(d2l-dropdown:not(.d2l-overflow-dropdown)),
			:host .d2l-overflow-group-container ::slotted(d2l-dropdown-button),
			:host .d2l-overflow-group-container ::slotted(d2l-dropdown-button-subtle),
			:host .d2l-overflow-group-container ::slotted(.d2l-overflow-group-custom-item) {
				margin-right: 0.6rem;
			}

			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-button),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-button-icon),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-link),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(span),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-dropdown:not(.d2l-overflow-dropdown)),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-dropdown-button),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-dropdown-button-subtle),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(.d2l-overflow-group-custom-item) {
				margin-left: 0.6rem;
				margin-right: 0;
			}

			:host([opener-style="subtle"]) .d2l-overflow-group-container ::slotted(d2l-button-subtle) {
				margin-right: 0.2rem;
			}

			:host([opener-style="subtle"][dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-button-subtle) {
				margin-left: 0.2rem;
				margin-right: 0;
			}

			:host([opener-style="subtle"]) .d2l-dropdown-subtle-opener-text,
			.d2l-dropdown-opener-text {
				margin-right: 0.3rem;
				vertical-align: middle;
			}
			:host([dir="rtl"]) .d2l-dropdown-opener-text,
			:host([opener-style="subtle"]:dir(rtl)) .d2l-dropdown-subtle-opener-text {
				margin-left: 0.3rem;
				margin-right: 0;
			}
			:host .d2l-overflow-group-container ::slotted([data-is-chomped]) {
				display: none !important;
			}`
		];
	}
	constructor() {
		super();
		this._handleResize = this._handleResize.bind(this);
		this._addEventListeners = this._addEventListeners.bind(this);
		this._chomp = this._chomp.bind(this);
		this._getLayoutItems = this._getLayoutItems.bind(this);
		this._handleSlotChange = this._handleSlotChange.bind(this);
		this._getOverflowMenu = this._getOverflowMenu.bind(this);

		this._throttledResize = throttle(this._handleResize, 15);

		this._overflowHidden = this._overflowHidden ?? false;
		this.autoShow = this.autoShow ?? false;
		this.maxToShow = this.maxToShow ?? -1;
		this.minToShow = this.minToShow ?? 1;
		this.openerStyle = this.minToShow ?? OPENER_STYLE.DEFAULT;
		this._mini = this.openerType === OPENER_TYPE.ICON;

		this._refId = 0;
		this._slotItems = [];
		this._overflowItems = [];
	}
	connectedCallback() {
		super.connectedCallback();
		this._addEventListeners();
	}
	disconnectedCallback() {
		super.disconnectedCallback();
		this._removeEventListeners();
	}
	async firstUpdated() {
		super.firstUpdated();

		// selected elements
		this._buttonSlot = this.shadowRoot.querySelector('.item-container');
		this._buttonSlot.addEventListener('slotchange', this._handleSlotChange);

		this._container = this.shadowRoot.querySelector('.d2l-overflow-group-container');

		this._autoShowClass = 'd2l-overflow-group-show';
		this._autoNoShowClass = 'd2l-overflow-group-no-show';

		// get the items from the button slot
		this._slotItems = this._getSlotItems();
		// convert them to layout items (calculate widths)
		this._layoutItems = this._getLayoutItems(this._slotItems);
		// convert to dropdown items (for overflow menu)
		this._dropdownItems = this._slotItems.map((node) => this._convertToDropdownItem(node));

		if (this.autoShow) {
			this._autoDetectBoundaries(this._slotItems);
		}

		this._availableWidth = this._container.clientWidth;
	}
	render() {
		let overflowMenu;
		if (!this._overflowMenuHidden) {
			overflowMenu = this._getOverflowMenu();
		}

		this._slotItems.forEach((element, index) => {
			if (!this._overflowMenuHidden && index >= this._chompIndex) {
				element.setAttribute('data-is-chomped', true);
			} else {
				element.removeAttribute('data-is-chomped');
			}
		});

		return html`
			<div class="d2l-overflow-group-container">
				<slot class="item-container"></slot>
				${overflowMenu}
			</div>
		`;
	}
	update(changedProperties) {
		super.update(changedProperties);
		if (changedProperties.get('autoShow')) {
			this._autoDetectBoundaries(this._getLayoutItems());
		}

		if (changedProperties.get('minToShow')
			|| changedProperties.get('maxToShow')) {
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
		if (this.openerType === OPENER_TYPE.ICON && this._overflowMenuMini) {
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

		this._mini = this.openerType === OPENER_TYPE.ICON || swapToMiniButton;
		this._chompIndex = this._overflowMenuHidden ? null : showing.count;

		this.dispatchEvent(new CustomEvent('d2l-overflow-group-updated', { bubbles: true, composed: true }));
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
		} else if (node.classList.contains('d2l-overflow-group-custom-item')) {
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

		// iterate through any sub menus and turn them into menu items
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
	_getOverflowMenu() {

		const moreActionsText = this.localize('components.overflow-group.moreActions');
		const overflowItems = this._dropdownItems ? this._dropdownItems.slice(this._chompIndex) : [];
		const menu = html`<d2l-dropdown-menu>
			<d2l-menu id="overflowMenu" label="${moreActionsText}">
				${overflowItems}
			</d2l-menu>
		</d2l-dropdown-menu>`;

		if (this._mini) {
			return html`<d2l-dropdown-more class="d2l-overflow-dropdown-mini" text="${moreActionsText}">
				${menu}
			</d2l-dropdown-more>`;
		}
		if (this.openerStyle === OPENER_STYLE.SUBTLE) {
			return html`<d2l-dropdown-button-subtle class="d2l-overflow-dropdown" text="${moreActionsText}">
				${menu}
			</d2l-dropdown-button-subtle>`;
		}

		return html`<d2l-dropdown-button class="d2l-overflow-dropdown" text="${moreActionsText}">
			${menu}
		</d2l-dropdown-button>`;
	}
	_getSlotItems() {
		const nodes = this._buttonSlot.assignedNodes();
		const filteredNodes = nodes.filter((node) => {
			const isNode = node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'template';
			return isNode;
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
		// get the items from the button slot
		this._slotItems = this._getSlotItems();
		// convert them to layout items (calculate widths)
		this._layoutItems = this._getLayoutItems(this._slotItems);
		// convert to dropdown items (for overflow menu)
		this._dropdownItems = this._slotItems.map((node) => this._convertToDropdownItem(node));

		if (this.autoShow) {
			this._autoDetectBoundaries(this._slotItems);
		}

		this._chomp();
	}
	_removeEventListeners() {
		window.removeEventListener('resize', this._throttledResize);
		this._buttonSlot.removeEventListener('slotchange', this._handleSlotChange);
	}
}

customElements.define('d2l-overflow-group', OverflowGroup);
