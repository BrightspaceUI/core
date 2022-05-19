import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit';
import { announce } from '../../helpers/announce.js';
import { ArrowKeysMixin } from '../../mixins/arrow-keys-mixin.js';
import { classMap } from 'lit/directives/class-map.js';
import { InteractiveMixin } from '../../mixins/interactive-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { styleMap } from 'lit/directives/style-map.js';

const PAGE_SIZE = {
	medium: 600,
	large: 970
};
const PAGE_SIZE_LINES = {
	large: 1,
	medium: 2,
	small: 3
};
const GAP = 6;

async function filterAsync(arr, callback) {
	const fail = Symbol();
	const results = await Promise.all(arr.map(async item => {
		const callbackResult = await callback(item);
		return callbackResult ? item : fail;
	}));
	return results.filter(i => i !== fail);
}

class TagList extends LocalizeCoreElement(InteractiveMixin(ArrowKeysMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * Enables the option to clear all inner tag list items. The `d2l-tag-list-item-clear` event will be dispatched for each list item when the user selects to Clear All. The consumer must handle the actual item deletion.
			 * @type {boolean}
			 */
			clearable: { type: Boolean },
			/**
			 * ADVANCED: When an item is `clearable`, optionally add a timeout before the focus happens on clear. This is useful if the consumer has some operations that will reload the list items prior to wanting focus to occur.
			 * @type {number}
			 */
			clearFocusTimeout: { type: Number, attribute: 'clear-focus-timeout' },
			/**
			 * ADVANCED: Text on the clear all button that appears when `clearable` is true.
			 * @default "Clear All"
			 * @type {string}
			 */
			clearText: { type: String, attribute: 'clear-text' },
			/**
			 * REQUIRED: A description of the tag list for additional accessibility context
			 * @type {string}
			 */
			description: { type: String },
			/**
			 * ADVANCED: Hide the clear all button that by default appears when `clearable` is true.
			 * @type {boolean}
			 */
			hideClearButton: { type: Boolean, attribute: 'hide-clear-button' },
			_chompIndex: { type: Number },
			_contentReady: { type: Boolean },
			_lines: { type: Number },
			_showHiddenTags: { type: Boolean }
		};
	}

	static get styles() {
		return [...super.styles, css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.tag-list-container {
				display: flex;
				flex-wrap: wrap;
				gap: 6px;
				padding: 0;
			}
			::slotted([data-is-chomped]) {
				display: none !important;
			}
			.d2l-tag-list-hidden-button {
				position: absolute;
				visibility: hidden;
			}
			.d2l-tag-list-clear-button {
				position: absolute;
				visibility: hidden;
			}
			.d2l-tag-list-clear-button.d2l-tag-list-clear-button-visible {
				position: static;
				visibility: visible;
			}
			.tag-list-hidden {
				visibility: hidden;
			}
		`];
	}

	constructor() {
		super();
		/** @ignore */
		this.arrowKeysDirection = 'leftrightupdown';
		this.clearable = false;
		this.clearFocusTimeout = 0;
		this.hideClearButton = false;

		this._chompIndex = 10000;
		this._clearButtonHeight = 0;
		this._clearButtonWidth = 0;
		this._contentReady = false;
		this._hasResized = false;
		this._hasShownKeyboardTooltip = false;
		this._itemHeight = 0;
		this._listContainerObserver = null;
		this._resizeObserver = null;
		this._showHiddenTags = false;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._clearButtonResizeObserver) this._clearButtonResizeObserver.disconnect();
		if (this._listContainerObserver) this._listContainerObserver.disconnect();
		if (this._resizeObserver) this._resizeObserver.disconnect();
		if (this._subtleButtonResizeObserver) this._subtleButtonResizeObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		const subtleButton = this.shadowRoot.querySelector('.d2l-tag-list-hidden-button');
		this._subtleButtonResizeObserver = new ResizeObserver(() => {
			this._subtleButtonWidth = Math.ceil(parseFloat(getComputedStyle(subtleButton).getPropertyValue('width')));
		});
		this._subtleButtonResizeObserver.observe(subtleButton);

		const clearButton = this.shadowRoot.querySelector('d2l-button-subtle.d2l-tag-list-clear-button');
		this._clearButtonResizeObserver = new ResizeObserver(() => {
			this._clearButtonWidth = Math.ceil(parseFloat(getComputedStyle(clearButton).getPropertyValue('width')));
			this._clearButtonHeight = Math.ceil(parseFloat(getComputedStyle(clearButton).getPropertyValue('height')));
		});
		this._clearButtonResizeObserver.observe(clearButton);

		const container = this.shadowRoot.querySelector('.tag-list-outer-container');
		this._resizeObserver = new ResizeObserver((e) => requestAnimationFrame(() => this._handleResize(e)));
		this._resizeObserver.observe(container);

		const listContainer = this.shadowRoot.querySelector('.tag-list-container');
		this._listContainerObserver = new ResizeObserver(() => requestAnimationFrame(() => this._handleSlotChange()));
		this._listContainerObserver.observe(listContainer);
	}

	render() {
		let hiddenCount = 0;
		let hasHiddenTags = false;
		if (this._items) {
			this._items.forEach((element, index) => {
				if (index >= this._chompIndex) hasHiddenTags = true;
				if (!this._showHiddenTags && index >= this._chompIndex) {
					hiddenCount++;
					element.setAttribute('data-is-chomped', '');
				} else {
					element.removeAttribute('data-is-chomped');
				}
			});
		}

		let overflowButton = null;
		if (hasHiddenTags) {
			overflowButton = this._showHiddenTags ? html`
				<d2l-button-subtle
					class="d2l-tag-list-button"
					@click="${this._toggleHiddenTagVisibility}"
					slim
					text="${this.localize('components.tag-list.show-less')}">
				</d2l-button-subtle>
			` : html`
				<d2l-button-subtle
					class="d2l-tag-list-button d2l-tag-list-button-show-more"
					@click="${this._toggleHiddenTagVisibility}"
					description="${this.localize('components.tag-list.show-more-description')}"
					slim
					text="${this.localize('components.tag-list.num-hidden', { count: hiddenCount })}">
				</d2l-button-subtle>
			`;
		}
		const clearableClasses = {
			'd2l-tag-list-clear-button': true,
			'd2l-tag-list-clear-button-visible': this.clearable && !this.hideClearButton && this._items && this._items.length > 0
		};

		const containerClasses = {
			'tag-list-container': true,
			'tag-list-hidden': !this._contentReady
		};

		const list = html`
			<div
				aria-label="${this.description}"
				class="${classMap(containerClasses)}"
				role="list"
				@d2l-tag-list-item-clear="${this._handleItemDeleted}"
				@d2l-tag-list-item-tooltip-show="${this._handleKeyboardTooltipShown}"
			>
				<slot @slotchange="${this._handleSlotChange}"></slot>
				${overflowButton}
				<d2l-button-subtle
					class="${classMap(clearableClasses)}"
					@click="${this._handleClearAll}"
					slim
					text="${this.clearText || this.localize('components.tag-list.clear-all')}"
				>
				</d2l-button-subtle>
			</div>
		`;

		const outerContainerStyles = {
			maxHeight: (this._showHiddenTags || !this._lines) ? undefined : `${(this._itemHeight + GAP) * this._lines}px`,
			minHeight: `${Math.max(this._clearButtonHeight, this._itemHeight)}px`
		};

		return this.renderInteractiveContainer(
			html`
				<div role="application" class="tag-list-outer-container" style="${styleMap(outerContainerStyles)}">
					<d2l-button-subtle aria-hidden="true" slim text="${this.localize('components.tag-list.num-hidden', { count: '##' })}" class="d2l-tag-list-hidden-button"></d2l-button-subtle>
					${this.arrowKeysContainer(list)}
				</div>
			`, this.localize('components.tag-list.interactive-label', { count: this._items ? this._items.length : 0 }),
			() => {
				if (this._items && this._items.length > 0) this._items[0].focus();
			}
		);
	}

	async arrowKeysFocusablesProvider() {
		return this._getVisibleEffectiveChildren();
	}

	_chomp() {
		if (!this.shadowRoot || !this._lines || !this._itemLayouts) return;

		const clearButtonWidth = this.clearable ? this._clearButtonWidth : 0;

		const showing = {
			count: 0,
			width: 0
		};

		/**
		 * _lines is determined by page width in _handleResize function
		 * For each line we calculate the max items that can fit in that width, then go to the next line
		 * If on the last line there is/are item(s) that won't fit in the width, we mark them as soft-hide and set isOverflowing
		 */
		let isOverflowing = false;
		let overflowingIndex = 0;
		for (let k = 1; k <= this._lines; k++) {
			showing.width = 0;

			for (let i = overflowingIndex; i < this._itemLayouts.length; i++) {
				const itemLayout = this._itemLayouts[i];
				const itemWidth = Math.min(itemLayout.width + GAP, this._availableWidth);

				if (!isOverflowing && ((showing.width + itemWidth) <= (this._availableWidth + GAP))) {
					showing.width += itemWidth;
					showing.count += 1;
					itemLayout.trigger = 'soft-show';
				} else if (k < this._lines) {
					overflowingIndex = i;
					break;
				} else {
					isOverflowing = true;
					itemLayout.trigger = 'soft-hide';
				}
			}
		}

		if (!isOverflowing && !this.clearable) {
			this._chompIndex = showing.count;
			return;
		}

		// calculate if additional item(s) should be hidden due to subtle button(s) needing space
		for (let j = this._itemLayouts.length; j--;) {
			if ((this.clearable && !isOverflowing && ((showing.width + clearButtonWidth) < this._availableWidth))
				|| ((showing.width + this._subtleButtonWidth + clearButtonWidth) < this._availableWidth)) {
				break;
			}
			const itemLayoutOverflowing = this._itemLayouts[j];
			if (itemLayoutOverflowing.trigger !== 'soft-show') {
				continue;
			}
			isOverflowing = true;
			showing.width -= itemLayoutOverflowing.width;
			showing.count -= 1;
		}
		this._chompIndex = showing.count;
	}

	_getItemLayouts(filteredNodes) {
		const items = filteredNodes.map((node) => {
			const computedStyles = window.getComputedStyle(node);

			return {
				isHidden: computedStyles.display === 'none',
				width: Math.ceil(parseFloat(computedStyles.width) || 0)
			};
		});

		return items.filter(({ isHidden }) => !isHidden);
	}

	async _getTagListItems() {
		const slot = this.shadowRoot && this.shadowRoot.querySelector('slot');
		if (!slot) return;

		const results = await filterAsync(slot.assignedNodes({ flatten: true }), async node => {
			if (node.nodeType !== Node.ELEMENT_NODE) return false;
			await node.updateComplete;

			const role = node.getAttribute('role');
			if (role !== 'listitem') return false;

			if (this.clearable) node.setAttribute('clearable', 'clearable');
			node.removeAttribute('data-is-chomped');
			node.removeAttribute('keyboard-tooltip-item');

			return true;
		});
		return results;
	}

	_getVisibleEffectiveChildren() {
		if (!this.shadowRoot) {
			return [];
		}

		const showMoreButton = this.shadowRoot.querySelector('.d2l-tag-list-button') || [];
		const clearButton = !this.clearable ? [] : (this.shadowRoot.querySelector('.d2l-tag-list-clear-button') || []);
		const items = this._showHiddenTags ? this._items : this._items.slice(0, this._chompIndex);
		return items.concat(showMoreButton).concat(clearButton);
	}

	_handleClearAll(e) {
		if (!this._items) return;

		/** Dispatched when a user selects to delete all tag list items. The consumer must handle the actual element deletion and focus behaviour. */
		this.dispatchEvent(new CustomEvent(
			'd2l-tag-list-clear-all',
			{ bubbles: true, composed: true }
		));

		announce(this.localize('components.tag-list.cleared-all'));

		this._items.forEach((item) => {
			item.handleClearItem(e, true);
		});
	}

	_handleItemDeleted(e) {
		if (!this.clearable) return;
		if (!e || !e.detail || !e.detail.handleFocus) return;

		const rootTarget = e.composedPath()[0];
		const children = this._getVisibleEffectiveChildren();
		const itemIndex = children.indexOf(rootTarget);

		if (children.length <= 1) return;
		const focusableElem = children[itemIndex - 1] || children[itemIndex + 1];

		setTimeout(() => focusableElem.focus(), this.clearFocusTimeout);
	}

	_handleKeyboardTooltipShown() {
		this._hasShownKeyboardTooltip = true;
	}

	async _handleResize(entries) {
		this._availableWidth = Math.floor(entries[0].contentRect.width);
		if (this._availableWidth >= PAGE_SIZE.large) this._lines = PAGE_SIZE_LINES.large;
		else if (this._availableWidth < PAGE_SIZE.large && this._availableWidth >= PAGE_SIZE.medium) this._lines = PAGE_SIZE_LINES.medium;
		else this._lines = PAGE_SIZE_LINES.small;
		if (!this._hasResized) {
			this._hasResized = true;
			await this._handleSlotChange();
		} else {
			this._chomp();
		}
	}

	async _handleSlotChange() {
		if (!this._hasResized) return;
		this._contentReady = false;
		await this.updateComplete;

		this._items = await this._getTagListItems();
		if (!this._items || this._items.length === 0) {
			this._chompIndex = 10000;
			return;
		}

		this._itemLayouts = this._getItemLayouts(this._items);
		this._itemHeight = this._items[0].offsetHeight;
		this._items.forEach((item, index) => {
			item.setAttribute('tabIndex', index === 0 ? 0 : -1);
		});
		this._chomp();
		this._contentReady = true;
		if (!this._hasShownKeyboardTooltip) this._items[0].setAttribute('keyboard-tooltip-item', 'keyboard-tooltip-item');
	}

	async _toggleHiddenTagVisibility(e) {
		this._showHiddenTags = !this._showHiddenTags;

		if (!this.shadowRoot) return;

		await this.updateComplete;
		if (e.target.classList.contains('d2l-tag-list-button-show-more')) this._items[this._chompIndex].focus();
		else {
			const button = this.shadowRoot.querySelector('.d2l-tag-list-button');
			if (button) button.focus();
		}
	}

}

customElements.define('d2l-tag-list', TagList);
