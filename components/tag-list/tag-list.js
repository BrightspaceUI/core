import '../button/button-subtle.js';
import { css, html, LitElement } from 'lit';
import { ArrowKeysMixin } from '../../mixins/arrow-keys-mixin.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';

const LARGE_SIZE = 970;
const MEDIUM_SIZE = 600;
const PAGE_SIZE_LINES = {
	large: 1,
	medium: 2,
	small: 3
};

class TagList extends ArrowKeysMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: A description of the tag list for additional accessibility context
			 * @type {string}
			 */
			description: { type: String },
			_showHiddenTags: { type: Boolean, reflect: true },
			_chompIndex: { type: Number }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.tag-list-container {
				display: flex;
				margin: -6px -6px 0 0;
				padding: 0;
				position: relative;
			}
			::slotted(*),
			d2l-button-subtle {
				margin: 6px 6px 0 0;
			}
			::slotted([data-is-chomped]) {
				display: none !important;
			}
			.d2l-tag-list-hidden-button {
				position: absolute;
				visibility: hidden;
			}
			:host([_showHiddenTags]) .tag-list-container {
				flex-wrap: wrap;
			}
		`;
	}

	constructor() {
		super();
		/** @ignore */
		this.arrowKeysDirection = 'leftrightupdown';
		this._items = [];
		this._resizeObserver = null;
		this._showHiddenTags = false;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._resizeObserver) this._resizeObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this._container = this.shadowRoot.querySelector('.tag-list-outer-container');
		this._resizeObserver = new ResizeObserver((e) => requestAnimationFrame(() => this._handleResize(e)));
		this._resizeObserver.observe(this._container);

	}

	_getButton(hiddenCount) {
		return this._showHiddenTags ? html`
		 	<d2l-button-subtle slim text="Show Less" @click="${this._toggleHiddenTagVisibility}"></d2l-button-subtle>
		` : html`
			<d2l-button-subtle slim text="+ ${hiddenCount} more" @click="${this._toggleHiddenTagVisibility}"></d2l-button-subtle>
		`;
	}

	render() {
		let hiddenCount = 0;
		let hasHiddenTags = false;
		this._items.forEach((element, index) => {
			if (index >= this._chompIndex) hasHiddenTags = true;
			if (!this._showHiddenTags && index >= this._chompIndex) {
				hiddenCount++;
				element.setAttribute('data-is-chomped', '');
			} else {
				element.removeAttribute('data-is-chomped');
			}
		});

		const button = hasHiddenTags ? this._getButton(hiddenCount) : null;

		const list = html`
			<div role="list" class="tag-list-container" aria-describedby="d2l-tag-list-description">
				<slot @slotchange="${this._handleSlotChange}"></slot>
				${button}
			</div>
		`;
		const hiddenButton = html`<d2l-button-subtle aria-hidden="true" slim text="+ ## more" class="d2l-tag-list-hidden-button"></d2l-button-subtle>`;

		return html`
			<div role="application" class="tag-list-outer-container">
				${hiddenButton}
				${this.arrowKeysContainer(list)}
				<div id="d2l-tag-list-description" hidden>${this.description}</div>
			</div>
		`;
	}

	async arrowKeysFocusablesProvider() {
		return this._items.slice(0, this._chompIndex);
	}

	focus() {
		if (this._items.length > 0) this._items[0].focus();
	}

	_chomp() {
		if (!this.shadowRoot) return;

		const subtleButton  = this.shadowRoot.querySelector('.d2l-tag-list-hidden-button');
		const subtleButtonWidth = Math.ceil(parseFloat(getComputedStyle(subtleButton).getPropertyValue('width')));

		const showing = {
			count: 0,
			width: 0
		};

		let isOverflowing = false;
		for (let i = 0; i < this._itemLayouts.length; i++) {
			const itemLayout = this._itemLayouts[i];

			// chomp or unchomp based on space available
			if (!isOverflowing && showing.width + itemLayout.width < this._availableWidth) {
				showing.width += itemLayout.width;
				showing.count += 1;
				itemLayout.isChomped = false;
				itemLayout.trigger = 'soft-show';
			} else {
				isOverflowing = true;
				itemLayout.isChomped = true;
				itemLayout.trigger = 'soft-hide';
			}
		}

		// if there is at least one showing and no more to be hidden, enable collapsing more button to [...]
		if (isOverflowing) {
			for (let j = this._itemLayouts.length; j--;) {
				if ((showing.width + subtleButtonWidth) < this._availableWidth) {
					break;
				}
				const itemLayoutOverflowing = this._itemLayouts[j];
				if (itemLayoutOverflowing.trigger !== 'soft-show') {
					continue;
				}
				showing.width -= itemLayoutOverflowing.width;
				showing.count -= 1;
				itemLayoutOverflowing.trigger = 'soft-hide';
				itemLayoutOverflowing.isChomped = true;
			}
		}
		this._chompIndex = showing.count;
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
		this._items = this._getTagListItems();
		this._itemLayouts = this._getItemLayouts(this._items);
	}

	_getTagListItems() {
		const slot = this.shadowRoot && this.shadowRoot.querySelector('slot');
		if (!slot) return;
		return slot.assignedNodes({ flatten: true }).filter((node) => {
			if (node.nodeType !== Node.ELEMENT_NODE) return false;
			const role = node.getAttribute('role');
			return (role === 'listitem');
		});
	}

	_handleResize(entries) {
		this._availableWidth = Math.ceil(entries[0].contentRect.width);
		if (this._availableWidth >= LARGE_SIZE) this._lines = PAGE_SIZE_LINES.large;
		else if (this._availableWidth < LARGE_SIZE && this._availableWidth >= MEDIUM_SIZE) this._lines = PAGE_SIZE_LINES.medium;
		else this._lines = PAGE_SIZE_LINES.small;
		this._chomp();
	}

	_handleSlotChange() {
		requestAnimationFrame(() => {
			this._getItems();
			this._items.forEach((item, index) => {
				item.setAttribute('tabIndex', index === 0 ? 0 : -1);
			});
			this._chomp();
		});
	}

	_toggleHiddenTagVisibility() {
		this._showHiddenTags = !this._showHiddenTags;
	}

}

customElements.define('d2l-tag-list', TagList);
