import '../button/button.js';
import '../colors/colors.js';
import '../dropdown/dropdown.js';
import '../dropdown/dropdown-menu.js';
import '../icons/icon.js';
import '../menu/menu.js';
import { css, html, LitElement } from 'lit';
import { ArrowKeysMixin } from '../../mixins/arrow-keys/arrow-keys-mixin.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * A segmented button component.
 */
class ButtonSegmented extends ArrowKeysMixin(LocalizeCoreElement(LitElement)) {

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.container {
				align-items: center;
				background-color: var(--d2l-color-gypsum);
				border-radius: 0.3rem;
				column-gap: 0.3rem;
				display: flex;
				min-height: calc(2rem + 2px);
			}
		`;
	}

	get items() {
		return [...this.querySelectorAll('d2l-button-segmented-item')];
	}

	render() {

		return html`
			<div
				class="container"
				@d2l-button-segmented-item-select=${this.#handleItemSelect}
				@keydown="${this._handleArrowKeys}">
				<slot @slotchange="${this.#handleSlotChange}"></slot>
			</div>
		`;
	}

	arrowKeysFocusablesProvider() {
		return this.items;
	}

	arrowKeysOnBeforeFocus(elem) {
		const currentFocusable = this.items.find(i => i._focusable);
		if (currentFocusable) currentFocusable._focusable = false;
		elem._focusable = true;
	}

	#handleItemSelect(e) {
		const items = this.items;
		for (const item of items) {
			if (item.key === e.detail.key) continue;
			item.selected = false;
		}
	}

	#handleSlotChange() {
		const items = this.items;
		if (items.length === 0) return;
		if (!items.find(i => i.selected)) items[0].selected = true;
		if (!items.find(i => i._focusable)) items[0]._focusable = true;
	}

}

customElements.define('d2l-button-segmented', ButtonSegmented);
