import '../colors/colors.js';
import { css, html, LitElement } from 'lit';

/**
 * A segmented button component.
 */
class ButtonSegmented extends LitElement {

	static get properties() {
		return {
			/**
			 * ACCESSIBILITY: Label for the segmented button
			 * @type {string}
			 */
			label: { type: String, required: true }
		};
	}

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
		return this.shadowRoot.querySelector('slot').assignedElements({ flatten: true }).filter(e => e.tagName.toLowerCase() === 'd2l-button-segmented-item');
	}

	render() {

		return html`
			<div
				class="container"
				role="listbox"
				aria-label="${this.label}"
				@d2l-button-segmented-item-select=${this.#handleItemSelect}
				@keydown="${this._handleArrowKeys}">
				<slot @slotchange="${this.#handleSlotChange}"></slot>
			</div>
		`;
	}

	focus() {
		const items = this.items;
		if (items.length === 0) return;
		items[0].focus();
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
	}

}

customElements.define('d2l-button-segmented', ButtonSegmented);
