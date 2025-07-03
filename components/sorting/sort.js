import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-menu.js';
import '../menu/menu.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * Allows the user to adjust the sort order of data in a list.
 * @slot - Sort item components
 * @fires d2l-sort-change - Dispatched when the selected sort item changes
 */
class Sort extends FocusMixin(LocalizeCoreElement(LitElement)) {

	static properties = {
		/**
		 * Disables the sort
		 * @type {boolean}
		 */
		disabled: { type: Boolean, reflect: true },
		/** @ignore */
		opened: { type: Boolean, reflect: true },
		_selectedItemText: { state: true },
		_selectedItemValue: { state: true },
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
		this._selectedItemValue = '';
	}

	static get focusElementSelector() {
		return 'd2l-dropdown-button-subtle';
	}

	render() {
		return html`
			<d2l-dropdown-button-subtle
				?disabled="${this.disabled}"
				text="${this.localize('components.sort.text', { selectedItemText: this._selectedItemText })}">
				<d2l-dropdown-menu class="vdiff-target" ?opened="${this.opened}">
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

	#handleMenuItemChange(e) {
		if (this._selectedItemValue === e.target.value) return;

		this._selectedItemText = e.target.text;
		this._selectedItemValue = e.target;
		this.dispatchEvent(new CustomEvent(
			'd2l-sort-change', {
				detail: { value: e.detail.value }
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
		this._selectedItemText = selectedItem.text;
		this._selectedItemValue = selectedItem.value;
	}

}

customElements.define('d2l-sort', Sort);
