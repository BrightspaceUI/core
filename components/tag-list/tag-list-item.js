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
		return this._renderTag(this.text, {
			description: this.description,
			hasTruncationTooltip: true,
			plainText: this.text
		});
	}
}

customElements.define('d2l-tag-list-item', TagListItem);
