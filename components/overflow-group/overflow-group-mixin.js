import { css, html, nothing } from 'lit';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

export const OVERFLOW_CLASS = 'd2l-overflow-container';
export const OVERFLOW_MINI_CLASS = 'd2l-overflow-container-mini';

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

export const OverflowGroupMixin = superclass => class extends LocalizeCoreElement(RtlMixin(superclass)) {

	static get properties() {
		return {
			/**
			 * @ignore
			 */
			autoShow: {
				type: Boolean,
				attribute: 'auto-show',
			},
			/**
			 * minimum amount of slotted items to show
			 * @type {number}
			 */
			minToShow: {
				type: Number,
				reflect: true,
				attribute: 'min-to-show',
			},
			/**
			 * maximum amount of slotted items to show
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
			openerType: {
				type: String,
				attribute: 'opener-type'
			},
			_chompIndex: { state: true },
			_mini: { state: true },
			_wrapping: { state: true }
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
		this._itemObserver = new MutationObserver(this._handleItemMutation);
		this._resizeObserver = new ResizeObserver((entries) => requestAnimationFrame(() => this._handleResize(entries)));

		this._hasResized = false;
		this._isObservingResize = false;
		this._itemHeight = 0;
		this._mini = this.openerType === OPENER_TYPE.ICON;
		this._overflowContainerHidden = false;
		this._slotItems = [];
		this._wrapping = false;

		this.autoShow = false;
		this.maxToShow = -1;
		this.minToShow = 1;
		this.openerType = OPENER_TYPE.DEFAULT;
	}

	connectedCallback() {
		super.connectedCallback();
		this._observeItems();
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		this._itemObserver.disconnect();

		if (this._isObservingResize) {
			this._isObservingResize = false;
			this._resizeObserver.disconnect();
		}
	}

	render() {
		const chompedOverflowItems = this._overflowItems ? this._overflowItems.slice(this._chompIndex) : [];
		const overflowContainer = (!this._overflowContainerHidden && this._overflowItems)
			? this.getOverflowContainer(chompedOverflowItems, this._mini)
			: nothing;

		this._slotItems.forEach((element, index) => {
			if (!this._overflowContainerHidden && index >= this._chompIndex) {
				element.setAttribute('data-is-chomped', '');
			} else {
				element.removeAttribute('data-is-chomped');
			}
		});

		const containerStyles = {
			flexWrap: this._wrapping ? 'wrap' : 'nowrap',
			minHeight: this.autoShow ? 'none' : (this._itemHeight ? `${this._itemHeight}px` : 'auto'),
			maxHeight: this.autoShow ? 'none' : (this._itemHeight ? `${this._itemHeight}px` : 'auto')
		};

		return html`
			<div class="d2l-overflow-group-container" style="${styleMap(containerStyles)}">
				<slot @slotchange="${this._handleSlotChange}"></slot>
				${overflowContainer}
			</div>
			<slot name="adjacent"></slot>
		`;
	}

	update(changedProperties) {
		super.update(changedProperties);

		if (!this._isObservingResize) {
			this._isObservingResize = true;
			this._resizeObserver.observe(this.shadowRoot.querySelector('.d2l-overflow-group-container'));
		}

		if (changedProperties.has('autoShow') && this.autoShow) {
			this._autoDetectBoundaries(this._slotItems);
		}

		if (changedProperties.has('minToShow')
			|| changedProperties.has('maxToShow')) {
			this._chomp();
		}

		// Slight hack to get the overflow container width the first time it renders
		if (!this._overflowContainerWidth) {
			// this action needs to be deferred until first render of our overflow container
			requestAnimationFrame(() => {
				this._chomp();
			});
		}
	}

	convertToOverflowItem() {
		throw new Error('OverflowGroupMixin.convertToOverflowItem must be overridden');
	}

	getOverflowContainer() {
		throw new Error('OverflowGroupMixin.getOverflowContainer must be overridden');
	}

	_autoDetectBoundaries(items) {
		if (!items) return;

		let minToShow, maxToShow;
		for (let i = 0; i < items.length; i++) {
			if (!items[i].classList) continue;

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

		this._overflowContainer = this.shadowRoot.querySelector(`.${OVERFLOW_CLASS}`);
		this._overflowContainerMini = this.shadowRoot.querySelector(`.${OVERFLOW_MINI_CLASS}`);
		if (this.openerType === OPENER_TYPE.ICON && this._overflowContainerMini) {
			this._overflowContainerWidth = this._overflowContainerMini.offsetWidth;
		} else if (this._overflowContainer) {
			this._overflowContainerWidth = this._overflowContainer.offsetWidth;
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

		// if there is at least one showing and no more to be hidden, enable collapsing overflow container to mini overflow container
		this._overflowContainerHidden = this._itemLayouts.length === showing.count;
		if (!this._overflowContainerHidden && (isSoftOverflowing || isForcedOverflowing)) {
			for (let j = this._itemLayouts.length; j--;) {
				if (showing.width + this._overflowContainerWidth < this._availableWidth) {
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

		const overflowOverflowing = (showing.width + this._overflowContainerWidth >= this._availableWidth);
		const swapToMini = overflowOverflowing && !this._overflowContainerHidden;

		const requiredWidth = (isSoftOverflowing || isForcedOverflowing) ? showing.width + this._overflowContainerWidth : showing.width;
		this._wrapping = (requiredWidth > this._availableWidth);

		this._mini = this.openerType === OPENER_TYPE.ICON || swapToMini;
		this._chompIndex = this._overflowContainerHidden ? null : showing.count;

		/** Dispatched when there is an update performed to the overflow group */
		this.dispatchEvent(new CustomEvent('d2l-overflow-group-updated', { composed: false, bubbles: true }));
	}

	_getItemLayouts(filteredNodes) {
		const items = filteredNodes.map((node) => {
			node.removeAttribute('data-is-chomped');
			const computedStyles = window.getComputedStyle(node);
			const itemHidden = computedStyles.display === 'none';
			this._itemHeight = !itemHidden ? Math.max(this._itemHeight, Math.ceil(parseFloat(computedStyles.height))) : this._itemHeight;

			return {
				type: node.tagName.toLowerCase(),
				isChomped: false,
				isHidden: itemHidden,
				width: Math.ceil(parseFloat(computedStyles.width) || 0)
					+ (parseInt(computedStyles.marginRight) || 0)
					+ (parseInt(computedStyles.marginLeft) || 0),
				node: node
			};
		});

		return items.filter(({ isHidden }) => !isHidden);
	}

	async _getItems() {
		// get the items from the slot
		this._slotItems = await this._getSlotItems();
		// convert them to layout items (calculate widths)
		this._itemLayouts = this._getItemLayouts(this._slotItems);
		// convert to overflow items (for overflow container)
		this._overflowItems = this._slotItems.map((node) => this.convertToOverflowItem(node));
	}

	async _getSlotItems() {
		const filteredNodes = await filterAsync(this.shadowRoot.querySelector('slot').assignedNodes({ flatten: true }), async(node) => {
			if (node.nodeType !== Node.ELEMENT_NODE) return false;
			if (node.updateComplete) await node.updateComplete;
			return node.tagName.toLowerCase() !== 'template';
		});

		return filteredNodes;
	}

	_handleItemMutation(mutations) {
		if (!mutations || mutations.length === 0) return;
		if (this._updateOverflowItemsRequested) return;

		let isWidthModifyingMutation = false;
		for (const mutation of mutations) {
			if (mutation.attributeName
				&& (mutation.attributeName === 'selected' || mutation.attributeName === 'text')
			) {
				isWidthModifyingMutation = true;
				break;
			}
		}

		this._updateOverflowItemsRequested = true;
		setTimeout(() => {
			this._overflowItems = this._slotItems.map((node) => this.convertToOverflowItem(node));

			// when certain attributes change the corresponding item width can also change and so we need to re-get the layouts and chomp
			if (isWidthModifyingMutation) {
				this._itemLayouts = this._getItemLayouts(this._slotItems);
				this._chomp();
			}
			this._updateOverflowItemsRequested = false;
			this.requestUpdate();
		}, 0);
	}

	async _handleResize(entries) {
		await (document.fonts ? document.fonts.ready : Promise.resolve()); // computed widths can be incorrect if we don't wait for fonts to load
		this._availableWidth = Math.ceil(entries[0].contentRect.width);

		if (!this._hasResized) {
			this._hasResized = true;
			this._handleSlotChange();
		} else {
			this._chomp();
		}
	}

	_handleSlotChange() {
		if (!this._hasResized) return;
		requestAnimationFrame(async() => {
			await this._getItems();

			this._observeItems();

			if (this.autoShow) {
				this._autoDetectBoundaries(this._slotItems);
			}

			this._chomp();
			this.requestUpdate();
		});
	}

	_observeItems() {
		this._itemObserver.disconnect();
		this._slotItems.forEach(item => {
			this._itemObserver.observe(item, {
				attributes: true, /* required for legacy-Edge, otherwise attributeFilter throws a syntax error */
				attributeFilter: ['disabled', 'text', 'selected'],
				childList: false,
				subtree: true
			});
		});
	}

};
