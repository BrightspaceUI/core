import { LitElement } from 'lit';
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
			description: { type: String }
		};
	}

	render() {
		return this._renderTag(this.text, true, this.description);
	}

	_onListItemResize() {
		const itemContent = this.shadowRoot.querySelector('.tag-list-item-content');
		this._isTruncated = itemContent.scrollWidth > itemContent.offsetWidth;
	}
}

customElements.define('d2l-tag-list-item', TagListItem);
