import { html } from 'lit';

export const PageableMixin = superclass => class extends superclass {

	constructor() {
		super();
		this._pageable = true;
	}

	/* must be implemented by consumer */
	_getItemByIndex(index) { } // eslint-disable-line no-unused-vars

	/* must be implemented by consumer */
	async _getItemsShowingCount() { }

	/* must be implemented by consumer */
	_getLastItemIndex() { }

	async _handlePagerSlotChange(e) {
		this._updatePagerCount(await this._getItemsShowingCount(), e.target);
	}

	_renderPagerContainer() {
		return html`<slot name="pager" @slotchange="${this._handlePagerSlotChange}"></slot>`;
	}

	_updatePagerCount(count, slot) {
		if (!slot) slot = this.shadowRoot.querySelector('slot[name="pager"]');
		const elements = slot.assignedElements({ flatten: true });
		if (elements.length > 0) {
			elements[0].itemShowingCount = count;
		}
	}

};
