import { html, LitElement } from 'lit';
import { PageableMixin } from '../pageable-mixin.js';

class TestPageable extends PageableMixin(LitElement) {
	disconnectedCallback() {
		super.disconnectedCallback();
		if (this._mutationObserver) this._mutationObserver.disconnect();
	}
	render() {
		return html`
			<slot @slotchange="${this._handleSlotChange}"></slot>
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
		return this._getItems().length - 1;
	}
	_handleSlotChange(e) {
		const list = e.target.assignedElements().find(node => node.tagName === 'UL');
		if (!this._mutationObserver) {
			this._mutationObserver = new MutationObserver(async() => this._updatePagerCount(await this._getItemsShowingCount()));
		} else {
			this._mutationObserver.disconnect();
		}
		this._mutationObserver.observe(list, { childList: true });
	}
}
customElements.define('d2l-test-pageable', TestPageable);
