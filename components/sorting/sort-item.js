import { MenuItemRadio } from '../menu/menu-item-radio.js';

class SortItem extends MenuItemRadio {

	updated(changedProperties) {
		super.updated(changedProperties);
		// handles case where the text loads after initial render
		if (changedProperties.has('text') && this.selected) {
			/** @ignore */
			this.dispatchEvent(new CustomEvent('d2l-sort-item-selected-text-change', {
				bubbles: true,
				composed: false
			}));
		}
	}

}

customElements.define('d2l-sort-item', SortItem);
