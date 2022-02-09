import '../colors/colors.js';
import '../dropdown/dropdown-menu.js';
import '../button/button.js';
import '../button/button-subtle.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-button.js';
import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-more.js';
import '../menu/menu.js';
import '../menu/menu-item.js';
import '../menu/menu-item-separator.js';
import '../menu/menu-item-link.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

const AUTO_SHOW_CLASS = 'd2l-button-group-show';
const AUTO_NO_SHOW_CLASS = 'd2l-button-group-no-show';

const OPENER_TYPE = {
	DEFAULT: 'default',
	ICON: 'icon'
};

const OPENER_STYLE = {
	DEFAULT: 'default',
	SUBTLE: 'subtle',
};

function createMenuItem(node) {
	const childText = node.text || node.firstChild && (node.firstChild.label || node.firstChild.text || node.firstChild.textContent.trim());
	const disabled = !!node.disabled;
	const handleItemSelect = () => {
		node.dispatchEvent(new CustomEvent('d2l-button-ghost-click'));
		node.click();
	};
	return html`<d2l-menu-item
		?disabled=${disabled}
		@d2l-menu-item-select=${handleItemSelect}
		text="${childText}"
		description="${ifDefined(node.description || node.ariaLabel)}">
	</d2l-menu-item>`;
}

function createMenuItemLink(node) {
	const text =  node.textContent.trim();
	const href =  node.href;
	const target = node.target;

	return html`<d2l-menu-item-link
		text="${text}"
		href="${href}"
		target="${target}">
	</d2l-menu-item-link>`;
}

function createMenuItemSeparator() {
	return html`<d2l-menu-item-separator></d2l-menu-item-separator>`;
}

function createMenuItemMenu(node) {
	const menuOpener =
		node.querySelector('d2l-dropdown-button')
		||  node.querySelector('d2l-dropdown-button-subtle');

	const openerText = node.text || menuOpener.text;
	const disabled = !!node.disabled;
	const subMenu = node.querySelector('d2l-menu');

	const subItems = Array.from(subMenu.children).map((node) => convertToDropdownItem(node));

	return html`<d2l-menu-item
		?disabled=${disabled}
		text="${openerText}">
		<d2l-menu>
			${subItems}
		</d2l-menu>
	</d2l-menu-item>`;
}

function convertToDropdownItem(node) {
	const tagName = node.tagName.toLowerCase();
	switch (tagName) {
		case 'd2l-button':
		case 'd2l-button-subtle':
		case 'button':
		case 'd2l-button-icon':
		case 'd2l-selection-action':
			return createMenuItem(node);
		case 'a':
		case 'd2l-link':
			return createMenuItemLink(node);
		case 'd2l-menu':
		case 'd2l-dropdown':
		case 'd2l-dropdown-button':
		case 'd2l-dropdown-button-subtle':
		case 'd2l-dropdown-context-menu':
		case 'd2l-dropdown-more':
		case 'd2l-selection-action-dropdown':
			return createMenuItemMenu(node);
		case 'd2l-menu-item':
		case 'd2l-selection-action-menu-item':
			// if the menu item has children treat it as a menu item menu
			if (node.children.length > 0) {
				return createMenuItemMenu(node);
			} else {
				return createMenuItem(node);
			}
	}
	if (node.getAttribute('role') === 'separator') {
		return createMenuItemSeparator();
	}
}
/**
 *
 * A component that can be used to display a set of buttons, links or menus that will be put into a dropdown menu when they no longer fit on the first line of their container
 * @slot - Buttons, dropdown buttons, links or other items to be added to the container
 * @fires d2l-overflow-group-updated - Dispatched when there is an update performed to the overflow group
*/
class OverflowGroup extends RtlMixin(LocalizeCoreElement(LitElement)) {

	static get properties() {
		return {
			/**
			 * Use predefined classes on slot elements to set min and max buttons to show
			 * @type {boolean}
			 */
			autoShow: {
				type: Boolean,
				attribute: 'auto-show',
			},
			/**
			 * minimum amount of buttons to show
			 * @type {number}
			 */
			minToShow: {
				type: Number,
				reflect: true,
				attribute: 'min-to-show',
			},
			/**
			 * maximum amount of buttons to show
			 * @type {number}
			 */
			maxToShow: {
				type: Number,
				reflect: true,
				attribute: 'max-to-show',
			},
			/**
			 * Set the opener type to 'icon' for a `...` menu icon instead of `More actions` text
			 * @type {'default'|'icon'}
			 */
			openerType: {
				type: String,
				attribute: 'opener-type'
			},
			/**
			 * Setting this property will change the style of the overflow menu opener
			 * @type {'default'|'subtle'}
			 */
			openerStyle: {
				type: String,
				reflect: true,
				attribute: 'opener-style',
			},
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
			:host([hidden]) {
				display: none;
			}
			:host([opener-style="subtle"]) {
				--d2l-button-icon-fill-color: var(--d2l-color-celestine);
				--d2l-button-icon-fill-color-hover: var(--d2l-color-celestine-minus-1);
			}
			.d2l-overflow-group-container {
				display: flex;
				flex-wrap: wrap;
				justify-content: var(--d2l-overflow-group-justify-content, normal);
			}
			.d2l-overflow-group-container ::slotted(d2l-button),
			.d2l-overflow-group-container ::slotted(d2l-button-icon),
			.d2l-overflow-group-container ::slotted(d2l-link),
			.d2l-overflow-group-container ::slotted(span),
			.d2l-overflow-group-container ::slotted(d2l-dropdown:not(.d2l-overflow-dropdown)),
			.d2l-overflow-group-container ::slotted(d2l-dropdown-button),
			.d2l-overflow-group-container ::slotted(d2l-dropdown-button-subtle),
			.d2l-overflow-group-container ::slotted(d2l-dropdown-more),
			.d2l-overflow-group-container ::slotted(d2l-dropdown-context-menu),
			.d2l-overflow-group-container ::slotted(d2l-selection-action),
			.d2l-overflow-group-container ::slotted(d2l-selection-action-dropdown) {
				margin-right: 0.6rem;
			}
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-button),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-button-icon),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-link),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(span),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-dropdown:not(.d2l-overflow-dropdown)),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-dropdown-button),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-dropdown-button-subtle),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-dropdown-more),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-dropdown-context-menu),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-selection-action),
			:host([dir="rtl"]) .d2l-overflow-group-container ::slotted(d2l-selection-action-dropdown) {
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
			.d2l-overflow-group-container ::slotted([data-is-chomped]) {
				display: none !important;
			}`
		];
	}

	constructor() {
		super();
		this._handleItemMutation = this._handleItemMutation.bind(this);
		this._handleResize = this._handleResize.bind(this);

		this._throttledResize = (entries) => requestAnimationFrame(() => this._handleResize(entries));

		this._overflowHidden = false;
		this.autoShow = false;
		this.maxToShow = -1;
		this.minToShow = 1;
		this.openerStyle = OPENER_STYLE.DEFAULT;
		this.openerType = OPENER_TYPE.DEFAULT;
		this._mini = this.openerType === OPENER_TYPE.ICON;

		this._slotItems = [];
	}

	async firstUpdated() {
		super.firstUpdated();

		// selected elements
		this._buttonSlot = this.shadowRoot.querySelector('slot');

		this._container = this.shadowRoot.querySelector('.d2l-overflow-group-container');

		const resizeObserver = new ResizeObserver(this._throttledResize);
		resizeObserver.observe(this._container);
	}

	render() {
		const overflowMenu = this._getOverflowMenu();

		this._slotItems.forEach((element, index) => {
			if (!this._overflowMenuHidden && index >= this._chompIndex) {
				element.setAttribute('data-is-chomped', '');
			} else {
				element.removeAttribute('data-is-chomped');
			}
		});

		return html`
			<div class="d2l-overflow-group-container">
				<slot @slotchange="${this._handleSlotChange}"></slot>
				${overflowMenu}
			</div>
		`;
	}

	update(changedProperties) {
		super.update(changedProperties);

		if (changedProperties.get('autoShow')) {
			this._getItemLayouts(this._slotItems);
			this._autoDetectBoundaries(this._itemLayouts);
		}

		if (changedProperties.get('minToShow')
			|| changedProperties.get('maxToShow')) {
			this._chomp();
		}

		// Slight hack to get the overflow menu width the first time it renders
		if (!this._overflowMenuWidth) {
			// this action needs to be deferred until first render of our overflow button
			requestAnimationFrame(() => {
				this._chomp();
			});
		}
	}

	_autoDetectBoundaries(items) {

		let minToShow, maxToShow;
		for (let i = 0; i < items.length; i++) {
			if (items[i].classList.contains(AUTO_SHOW_CLASS)) {
				minToShow = i + 1;
			}
			if (maxToShow === undefined && items[i].classList.contains(AUTO_NO_SHOW_CLASS)) {
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

	_chomp() {
		if (!this.shadowRoot || !this._itemLayouts) return;

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
		for (let i = 0; i < this._itemLayouts.length; i++) {
			const itemLayout = this._itemLayouts[i];

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
		this._overflowMenuHidden = this._itemLayouts.length === showing.count;
		if (!this._overflowMenuHidden && (isSoftOverflowing || isForcedOverflowing)) {
			for (let j = this._itemLayouts.length; j--;) {
				if (showing.width + this._overflowMenuWidth < this._availableWidth) {
					break;
				}
				const itemLayoutOverflowing = this._itemLayouts[j];
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

		this.dispatchEvent(new CustomEvent('d2l-overflow-group-updated', { composed: false, bubbles: true }));
	}

	_getItemLayouts(filteredNodes) {
		const items = filteredNodes.map((node) => {
			const computedStyles = window.getComputedStyle(node);

			return {
				type: node.tagName.toLowerCase(),
				isChomped: false,
				isHidden: computedStyles.display === 'none',
				width: Math.ceil(parseFloat(computedStyles.width) || 0)
					+ parseInt(computedStyles.marginRight) || 0
					+ parseInt(computedStyles.marginLeft) || 0,
				node: node
			};
		});

		return items.filter(({ isHidden }) => !isHidden);
	}

	_getItems() {
		// get the items from the button slot
		this._slotItems = this._getSlotItems();
		// convert them to layout items (calculate widths)
		this._itemLayouts = this._getItemLayouts(this._slotItems);
		// convert to dropdown items (for overflow menu)
		this._dropdownItems = this._slotItems.map((node) => convertToDropdownItem(node));
	}

	_getOverflowMenu() {
		if (this._overflowMenuHidden) {
			return;
		}
		const moreActionsText = this.localize('components.overflow-group.moreActions');
		const overflowItems = this._dropdownItems ? this._dropdownItems.slice(this._chompIndex) : [];
		const menu = html`<d2l-dropdown-menu>
			<d2l-menu label="${moreActionsText}">
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
		const nodes = this._buttonSlot.assignedNodes({ flatten: true });
		const filteredNodes = nodes.filter((node) => {
			const isNode = node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'template';
			return isNode;
		});

		return filteredNodes;
	}

	_handleItemMutation(mutations) {
		if (!mutations || mutations.length === 0) return;
		if (this._updateDropdownItemsRequested) return;

		this._updateDropdownItemsRequested = true;
		setTimeout(() => {
			this._dropdownItems = this._slotItems.map(node => convertToDropdownItem(node));
			this._updateDropdownItemsRequested = false;
			this.requestUpdate();
		}, 0);
	}

	_handleResize(entries) {
		this._availableWidth = Math.ceil(entries[0].contentRect.width);
		this._chomp();
	}

	_handleSlotChange() {
		requestAnimationFrame(() => {
			this._getItems();

			this._slotItems.forEach(item => {
				const observer = new MutationObserver(this._handleItemMutation);
				observer.observe(item, {
					attributes: true, /* required for legacy-Edge, otherwise attributeFilter throws a syntax error */
					attributeFilter: ['disabled', 'text'],
					childList: false,
					subtree: false
				});
			});

			if (this.autoShow) {
				this._autoDetectBoundaries(this._slotItems);
			}

			this._chomp();
		});
	}
}

customElements.define('d2l-overflow-group', OverflowGroup);
