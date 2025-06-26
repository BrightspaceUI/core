import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-menu.js';
import '../menu/menu.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

class Sort extends FocusMixin(LocalizeCoreElement(LitElement)) {

	static properties = {
		disabled: { type: Boolean, reflect: true },
		opened: { type: Boolean, reflect: true },
		_selectedItemText: { state: true },
	};

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			::slotted(:not(d2l-sort-item)) {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this.disabled = false;
		this.opened = false;
		this._selectedItemText = '';
	}

	static get focusElementSelector() {
		return 'd2l-dropdown-button-subtle';
	}

	render() {
		return html`
			<d2l-dropdown-button-subtle
				?disabled="${this.disabled}"
				text="${this.localize('components.sort.text', { selectedItemText: this._selectedItemText })}">
				<d2l-dropdown-menu ?opened="${this.opened}">
					<d2l-menu
						label="${this.localize('components.sort.label')}"
						@d2l-menu-item-change="${this.#handleMenuItemChange}">
						<slot
							@d2l-sort-item-selected-text-change="${this.#recalculateState}"
							@slotchange="${this.#handleSlotChange}"></slot>
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown-button-subtle>
		`;
	}

	#getItems() {
		const elems = this.shadowRoot?.querySelector('slot')?.assignedElements();
		if (!elems) return [];
		return elems.filter(el => el.tagName === 'D2L-SORT-ITEM');
	}

	#handleMenuItemChange() {
		const selectedItem = this.#recalculateState();

		this.dispatchEvent(new CustomEvent(
			'd2l-sort-change', {
				bubbles: false,
				composed: false,
				detail: { value: selectedItem.value }
			}
		));
	}

	#handleSlotChange() {
		this.#recalculateState();
	}

	#recalculateState() {
		const items = this.#getItems();
		if (items.length === 0) return;

		const selectedItems = items.filter(i => i.selected);
		if (selectedItems.length === 0) {
			items[0].selected = true;
			selectedItems.push(items[0]);
		}
		const selectedItem = selectedItems[selectedItems.length - 1];

		// only the last selected item is actually selected
		for (let i = 0; i < selectedItems.length - 1; i++) {
			selectedItems[i].selected = false;
		}

		this._selectedItemText = selectedItem.text;
		return selectedItem;
	}

}

customElements.define('d2l-sort', Sort);
