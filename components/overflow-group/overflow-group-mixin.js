import { css, html } from 'lit';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';

export const OVERFLOW_DROPDOWN_CLASS = 'd2l-overflow-dropdown';
export const OVERFLOW_MINI_DROPDOWN_CLASS = 'd2l-overflow-dropdown-mini';

const AUTO_SHOW_CLASS = 'd2l-button-group-show';
const AUTO_NO_SHOW_CLASS = 'd2l-button-group-no-show';

const OPENER_TYPE = {
	DEFAULT: 'default',
	ICON: 'icon'
};

async function filterAsync(arr, callback) {
	const fail = Symbol();
	const results = await Promise.all(arr.map(async item => {
		const callbackResult = await callback(item);
		return callbackResult ? item : fail;
	}));
	return results.filter(i => i !== fail);
}

export const OverflowGroupMixin = superclass => class extends LocalizeCoreElement(superclass) {

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
			 * @ignore
			 */
			chompIndex: {
				type: Number,
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
			 * @ignore
			 */
			mini: {
				type: Boolean,
				reflect: true
			},
			/**
			 * Set the opener type to 'icon' for a `...` menu icon instead of `More actions` text
			 * @type {'default'|'icon'}
			 */
			openerType: {
				type: String,
				attribute: 'opener-type'
			}
		};
	}

	static get styles() {
		return [offscreenStyles, css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-overflow-group-container {
				display: flex;
				flex-wrap: wrap;
				justify-content: var(--d2l-overflow-group-justify-content, normal);
			}
			.d2l-overflow-group-container ::slotted([data-is-chomped]) {
				display: none !important;
			}
		`];
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
		this.mini = this.openerType === OPENER_TYPE.ICON;
		this.openerType = OPENER_TYPE.DEFAULT;
		this._resizeObserver = null;
		this._slotItems = [];
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._resizeObserver) this._resizeObserver.disconnect();
	}

	async firstUpdated() {
		super.firstUpdated();

		// selected elements
		this._buttonSlot = this.shadowRoot.querySelector('slot');

		this._container = this.shadowRoot.querySelector('.d2l-overflow-group-container');

		this._resizeObserver = new ResizeObserver(this._throttledResize);
		this._resizeObserver.observe(this._container);
	}

	render() {
		const overflowMenu = this.getOverflowMenu();

		this._slotItems.forEach((element, index) => {
			if (!this.overflowMenuHidden && index >= this.chompIndex) {
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

		this._overflowMenu = this.shadowRoot.querySelector(`.${OVERFLOW_DROPDOWN_CLASS}`);
		this._overflowMenuMini = this.shadowRoot.querySelector(`.${OVERFLOW_MINI_DROPDOWN_CLASS}`);
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
		this.overflowMenuHidden = this._itemLayouts.length === showing.count;
		if (!this.overflowMenuHidden && (isSoftOverflowing || isForcedOverflowing)) {
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
		const swapToMiniButton = overflowDropdownOverflowing && !this.overflowMenuHidden;

		this.mini = this.openerType === OPENER_TYPE.ICON || swapToMiniButton;
		this.chompIndex = this.overflowMenuHidden ? null : showing.count;

		/** Dispatched when there is an update performed to the overflow group */
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

	async _getItems() {
		// get the items from the button slot
		this._slotItems = await this._getSlotItems();
		// convert them to layout items (calculate widths)
		this._itemLayouts = this._getItemLayouts(this._slotItems);
		// convert to dropdown items (for overflow menu)
		this.dropdownItems = this._slotItems.map((node) => this.convertToOverflowItem(node));
	}

	async _getSlotItems() {
		const filteredNodes = await filterAsync(this._buttonSlot.assignedNodes({ flatten: true }), async(node) => {
			if (node.nodeType !== Node.ELEMENT_NODE) return false;
			await node.updateComplete;
			return node.tagName.toLowerCase() !== 'template';
		});

		return filteredNodes;
	}

	_handleItemMutation(mutations) {
		if (!mutations || mutations.length === 0) return;
		if (this._updateDropdownItemsRequested) return;

		this._updateDropdownItemsRequested = true;
		setTimeout(() => {
			this.dropdownItems = this._slotItems.map(node => this.convertToOverflowItem(node));
			this._updateDropdownItemsRequested = false;
			this.requestUpdate();
		}, 0);
	}

	_handleResize(entries) {
		this._availableWidth = Math.ceil(entries[0].contentRect.width);
		this._chomp();
	}

	_handleSlotChange() {
		requestAnimationFrame(async() => {
			await this._getItems();

			this._slotItems.forEach(item => {
				const observer = new MutationObserver(this._handleItemMutation);
				observer.observe(item, {
					attributes: true, /* required for legacy-Edge, otherwise attributeFilter throws a syntax error */
					attributeFilter: ['disabled', 'text', 'selected'],
					childList: false,
					subtree: true
				});
			});

			if (this.autoShow) {
				this._autoDetectBoundaries(this._slotItems);
			}

			this._chomp();
		});
	}
};
