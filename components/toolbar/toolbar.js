import '../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

const keyCodes = Object.freeze({
	END: 35,
	HOME: 36,
	LEFT: 37,
	RIGHT: 39
});

/**
 * A toolbar that provides a slot for toolbar items
 * @slot - Slot for toolbar items (ex. ``)
 */
class Toolbar extends PropertyRequiredMixin(LitElement) {

	static properties = {
		/**
		 * ACCESSIBILITY: REQUIRED: Accessible label for the toolbar
		 * @type {string}
		 */
		label: { type: String, required: true }
	};

	static styles = css`
		:host {
			display: inline-block;
		}
		:host([hidden]) {
			display: none;
		}
		.container {
			border-block-end: 1px solid var(--d2l-theme-border-color-standard);
			display: flex;
			flex-wrap: wrap;
			gap: 4px;
			padding-block-end: 4px;
		}
	`;

	constructor() {
		super();
		this.label = '';
	}

	render() {
		return html`
			<div
				aria-label="${this.label}"
				class="container"
				@keydown="${this.#handleKeyDown}"
				role="toolbar">
				<slot @slotchange="${this.#handleSlotChange}"></slot>
			</div>
		`;
	}

	focus() {
		const focusables = this.#getFocusables();
		const item = focusables.find(item => item._activeFocusable);
		if (!item) return;
		item.focus();
	}

	setActiveFocusable(focusable) {
		const focusables = this.#getFocusables();
		const currentFocusable = focusables.find(item => item._activeFocusable);
		currentFocusable._activeFocusable = false;
		focusable._activeFocusable = true;
	}

	#getFocusables(slot) {
		if (!slot) slot = this.shadowRoot.querySelector('slot');
		return slot.assignedElements({ flatten: true }).filter(elem => elem.tagName === 'D2L-TOOLBAR-BUTTON');
	}

	async #handleKeyDown(e) {

		// todo: don't steal focus if arrow key originated from inside a dropdown

		if (e.keyCode !== keyCodes.LEFT && e.keyCode !== keyCodes.RIGHT && e.keyCode !== keyCodes.HOME && e.keyCode !== keyCodes.END) return;

		const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
		const focusables = this.#getFocusables();

		const index = focusables.findIndex(item => item._activeFocusable);
		focusables[index]._activeFocusable = false;

		let focusable;
		if (isRtl && e.keyCode === keyCodes.LEFT) {
			if (index === focusables.length - 1) focusable = focusables[0];
			else focusable = focusables[index + 1];
		} else if (isRtl && e.keyCode === keyCodes.RIGHT) {
			if (index === 0) focusable = focusables[focusables.length - 1];
			else focusable = focusables[index - 1];
		} else if (e.keyCode === keyCodes.LEFT) {
			if (index === 0) focusable = focusables[focusables.length - 1];
			else focusable = focusables[index - 1];
		} else if (e.keyCode === keyCodes.RIGHT) {
			if (index === focusables.length - 1) focusable = focusables[0];
			else focusable = focusables[index + 1];
		} else if (e.keyCode === keyCodes.HOME) {
			focusable = focusables[0];
		} else if (e.keyCode === keyCodes.END) {
			focusable = focusables[focusables.length - 1];
		}

		// prevent default so page doesn't scroll when hitting HOME/END
		e.preventDefault();

		focusable._activeFocusable = true;
		await focusable.updateComplete;
		requestAnimationFrame(() => focusable.focus());
	}

	#handleSlotChange(e) {
		const focusables = this.#getFocusables(e.target);
		this.#resetActiveFocusable(focusables);
	}

	#resetActiveFocusable(focusables) {
		const item = focusables.find(item => item._activeFocusable);
		if (item) item._activeFocusable = false;

		focusables[0]._activeFocusable = true;
	}

}

customElements.define('d2l-toolbar', Toolbar);
