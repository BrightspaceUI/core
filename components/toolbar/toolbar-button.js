import '../tooltip/tooltip.js';
import { html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { SlottedIconMixin } from '../icons/slotted-icon-mixin.js';
import { ThemeMixin } from '../../mixins/theme/theme-mixin.js';
import { toolbarButtonStyles } from './toolbar-item-styles.js';
import { ToolbarItemMixin } from './toolbar-item-mixin.js';

/**
 * A toolbar button that performs an action
 */
class ToolbarButton extends SlottedIconMixin(FocusMixin(ToolbarItemMixin(ThemeMixin(PropertyRequiredMixin(LitElement))))) {

	static properties = {
		/**
		 * Disables the toolbar button
		 * @type {boolean}
		 */
		disabled: { type: Boolean },
		/**
		 * ACCESSIBILITY: REQUIRED: Accessible text for the button
		 * @type {string}
		 */
		text: { type: String, required: true }
	};

	static styles = [super.styles, toolbarButtonStyles];

	constructor() {
		super();
		this.disabled = false;
		this.text = '';
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		return html`
			<button
				aria-disabled="${this.disabled ? 'true' : 'false'}"
				@click="${this.#handleClick}"
				id="action-button"
				tabindex="${this._activeFocusable ? 0 : -1}"
				type="button">
				<div class="background"></div>
				${this._renderIcon()}
			</button>
			<d2l-tooltip class="vdiff-target" for="action-button" for-type="label">${this.text}</d2l-tooltip>
		`;
	}

	#handleClick(e) {
		e.stopPropagation();
		if (this.disabled) return;

		/** Dispatched when the toggle is clicked. */
		this.dispatchEvent(new CustomEvent('click'));
	}

}

customElements.define('d2l-toolbar-button', ToolbarButton);
