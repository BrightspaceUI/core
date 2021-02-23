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
import { ButtonGroupMixin } from './button-group-mixin.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { throttle } from 'lodash-es';

/**
 *
 * A button group component that can be used to display a set of buttons
 *
 * @slot - Buttons, dropdown buttons, links or other items to be added to the container
 */
class ButtonGroup extends LocalizeCoreElement(ButtonGroupMixin(LitElement)) {

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
			:host .d2l-button-group-container ::slotted([chomped]) {
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

			:host([subtle]) .d2l-dropdown-subtle-opener-text {
				margin-right: 0.3rem;
				vertical-align: middle;
			}

			:host([subtle]) d2l-icon {
				color: var(--d2l-color-celestine);
			}

			:host([subtle]) d2l-button-subtle:hover > .d2l-dropdown-subtle-opener-text,
			:host([subtle]) d2l-button-subtle:hover > d2l-icon {
				color: var(--d2l-color-celestine-minus-1);
			}
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
		this._chomp = this._chomp.bind(this);
		this._getOpener = this._getOpener.bind(this);
		this._autoShowClass = 'd2l-button-group-show',
		this._autoNoShowClass = 'd2l-button-group-no-show',
		this._refId = 0;

		// property defaults
		this.hideOverflowMenu = this.hideOverflowMenu ?? false;
		this.autoShow = this.autoShow ?? false;
		this.maxToShow = this.maxToShow ?? -1;
		this.minToShow = this.minToShow ?? 1;

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

		if (this._items.length === 1) {
			this.hideOverflowMenu = true;
		}

		this._layout.items = this._items.map((item) => {
			const itemLayout = this._createLayoutItem(item);
			if (itemLayout.isVisible) {
				this._layout.totalWidth += itemLayout.width;
			}
			return itemLayout;
		});
		// this element isnt rendered yet here for some reason, width is 0
		// this._layout.overflowMenuWidth = this._overflowMenu.offsetWidth;
		this._layout.availableWidth = this._getContainerWidth();
		if (this.autoShow) {
			this._autoDetectBoundaries(this._items);
		}
		this._chomp(this._items);
	}

	update(changedProperties) {
		super.update(changedProperties);
		if (changedProperties.get('autoShow')) {
			this._autoDetectBoundaries(this._getItems());
		}

		if (changedProperties.get('minToShow') || changedProperties.get('maxToShow')) {
			this._chomp(this._getItems());
		}

		// slight hack, overflowMenu isnt being rendered initially so wait until update
		// to calculate its width
		if (this._layout && !this._layout.overflowMenuWidth) {
			// this action needs to be defered until first render of our overflow button
			requestAnimationFrame(() => {
				this._layout.overflowMenuWidth = this._overflowMenu.offsetWidth;
				this._chomp(this._getItems());
			});
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._removeEventListeners();
	}

	_getOpener() {

		if (this.hideOverflowMenu) {
			return;
		}
		const isMoreIcon = this._mini || this.openerType === 'icon';
		const iconType = isMoreIcon ? 'tier1:more' : 'tier1:chevron-down';
		const overFlowButtonTextClasses = classMap({
			'd2l-dropdown-opener-text': !this.subtle,
			'd2l-dropdown-subtle-opener-text': this.subtle,
			'd2l-offscreen': this._mini || this.openerType
		});

		const moreActionsText = this._mini || this.openerType ? '' : this.localize('components.button-group.moreActions');
		const menu = html`<d2l-dropdown-menu>
			<d2l-menu id="overflowMenu" label="${moreActionsText}">
			</d2l-menu>
		</d2l-dropdown-menu>`;
		if (isMoreIcon || this.subtle) {
			return html`<d2l-dropdown-more class="d2l-overflow-dropdown" text="${moreActionsText}">
				${menu}
		</d2l-dropdown-more>`;
		}

		return html`<d2l-dropdown-button class="d2l-overflow-dropdown" text="${moreActionsText}">
			${menu}
		</d2l-dropdown-button>`;
	}
	render() {
		const opener = this._getOpener();
		const moreActionsText = this.localize('components.button-group.moreActions');

		return html`
			<div class="d2l-button-group-container">
				<slot id="buttons"></slot>
				${opener}
				<!-- <d2l-dropdown class="d2l-overflow-dropdown">
					
					<d2l-dropdown-menu>
						<d2l-menu id="overflowMenu" label="${moreActionsText}">
						</d2l-menu>
					</d2l-dropdown-menu>
				</d2l-dropdown> -->
			</div>
		`;
	}

	_addEventListeners() {
		this._throttledResize = throttle(this._handleResize, 15)
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
		// todo: there is a bug here where the menu doesnt go back to its default state
		// and instead stays as a sub menu item
		if (tagName === 'd2l-dropdown' || tagName === 'd2l-dropdown-button-subtle') {
			const menu = menuItem.querySelector('d2l-menu');
			menu.removeAttribute('child-view');
			item.querySelector('d2l-dropdown-menu').appendChild(
				menu
			);
		}
		menuItem.parentNode.removeChild(menuItem);
	}

	_chomp(items) {

		if (this._layout.totalWidth === 0) {
			this._overflowMenu.style.display = 'none';
			return;
		}

		if (!this._layout.overflowMenuWidth) {
			// this._layout.overflowMenuWidth = this._overflowMenu.offsetWidth;
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
		const overflowHidden = items.length === showing.count;
		if (this.minToShow > 0 && (showing.width + this._layout.overflowMenuWidth >= this._layout.availableWidth) && !overflowHidden) {
			this._mini = true;
		} else {
			this._mini = false;
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
		} else if (tagName === 'd2l-dropdown' || tagName === 'd2l-dropdown-button-subtle') {
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
	}
	_removeEventListeners() {
		window.removeEventListener('resize', this._throttledResize);
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
		const menuOpener = item.querySelector('d2l-dropdown-button');
		const subMenu = item.querySelector('d2l-menu');
		const menuItem = document.createElement('d2l-menu-item');
		menuItem.setAttribute('text', menuOpener.text);
		menuItem.appendChild(subMenu);
		return menuItem;
	}
}

customElements.define('d2l-button-group', ButtonGroup);
