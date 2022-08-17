import { LitElement } from 'lit';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { TagListItemMixin } from './tag-list-item-mixin.js';

class TagListItem extends TagListItemMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: Text to display
			 * @type {string}
			 */
			text: { type: String },
			/**
			 * Optional: Text to display in tooltip.
			 * Tooltip will also include text property value if truncated.
			 * @type {string}
			 */
			description: { type: String },
			_isTruncated: { state: true }
		};
	}

	constructor() {
		super();
		this._isTruncated = false;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._resizeObserver) this._resizeObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (this.description) {
			// observe resize events so we can update tooltip text when truncated
			const itemContent = this.shadowRoot.querySelector('.tag-list-item-content');
			this._onListItemResize();
			this._resizeObserver = new ResizeObserver(() => this._onListItemResize());
			this._resizeObserver.observe(itemContent);
		}
	}

	render() {
		const description = this._isTruncated ? `${this.text} ${this.description}` : this.description;
		return this._renderTag(this.text, true, description);
	}

	_onListItemResize() {
		const itemContent = this.shadowRoot.querySelector('.tag-list-item-content');
		this._isTruncated = itemContent.scrollWidth > itemContent.offsetWidth;
	}
}

customElements.define('d2l-tag-list-item', TagListItem);
