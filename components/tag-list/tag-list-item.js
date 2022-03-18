import { html, LitElement } from 'lit-element/lit-element.js';
import { TagListItemMixin } from './tag-list-item-mixin.js';

class TagListItem extends TagListItemMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * REQUIRED: Text to display
			 * @type {string}
			 */
			text: { type: String }
		};
	}

	render() {
		const tag = this._renderTag(this.text);

		return html`
			${tag}
		`;
	}
}

customElements.define('d2l-tag-list-item', TagListItem);
