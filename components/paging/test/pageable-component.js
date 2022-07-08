import { html, LitElement } from 'lit';
import { PageableMixin } from '../pageable-mixin.js';

class TestPageable extends PageableMixin(LitElement) {
	render() {
		return html`
			<ul><slot></slot></ul>
			${this._renderPagerContainer()}
		`;
	}
	_getItemByIndex(index) {
		return this._getItems()[index];
	}
	_getItems() {
		return this.shadowRoot.querySelector('slot').assignedElements().find(node => node.tagName === 'UL').querySelectorAll('li');
	}
	async _getItemsShowingCount() {
		return this._getItems().length;
	}
	_getLastItemIndex() {
		return this.getItems().length - 1;
	}
}
customElements.define('d2l-test-pageable', TestPageable);
