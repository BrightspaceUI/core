import '../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';

/**
 * A segmented view switcher.
 */
class ViewSwitcher extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			/**
			 * ACCESSIBILITY: Label for the switcher
			 * @type {string}
			 */
			label: { type: String, required: true },
			_count: { state: true }
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
				box-sizing: border-box;
				display: flex;
				gap: 0.3rem;
				padding: 0.3rem;
			}
		`;
	}
	constructor() {
		super();
		this._count = 0;
		this._focusOnFirstRender = false;
	}

	get items() {
		return this.shadowRoot?.querySelector('slot')?.assignedElements({ flatten: true }).filter(e => e._isSwitcherItem) || [];
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (this._focusOnFirstRender) {
			this.focus();
			this._focusOnFirstRender = false;
		}
	}

	render() {

		return html`
			<div
				class="container"
				role="group"
				aria-label="${this.label}"
				aria-roledescription="${this.localize('components.view-switcher.role-description', { count: this._count })}"
				@d2l-view-switcher-item-select=${this.#handleItemSelect}>
				<slot @slotchange="${this.#handleSlotChange}"></slot>
			</div>
		`;
	}

	focus() {
		if (!this.hasUpdated) {
			this._focusOnFirstRender = true;
			return;
		}
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
		this._count = items.length;
		if (items.length === 0) return;
		if (!items.find(i => i.selected)) items[0].selected = true;
	}

}

customElements.define('d2l-view-switcher', ViewSwitcher);
