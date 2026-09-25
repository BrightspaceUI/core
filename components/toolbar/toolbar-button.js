import { html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { SlottedIconMixin } from '../icons/slotted-icon-mixin.js';
import { ThemeMixin } from '../../mixins/theme/theme-mixin.js';
import { toolbarButtonStyles } from './toolbar-item-styles.js';

/**
 * A toolbar button that performs an action
 */
class ToolbarButton extends SlottedIconMixin(FocusMixin(ThemeMixin(PropertyRequiredMixin(LitElement)))) {

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
		text: { type: String, required: true },
		_activeFocusable: { state: true }
	};

	static styles = [super.styles, toolbarButtonStyles];

	constructor() {
		super();
		this.disabled = false;
		this.text = '';
		this._activeFocusable = false;
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		return html`
			<button
				aria-disabled="${this.disabled ? 'true' : 'false'}"
				aria-label="${this.text}"
				@click="${this.#handleClick}"
				tabindex="${this._activeFocusable ? 0 : -1}"
				title="${this.text}"
				type="button">
				<div class="background"></div>
				${this._renderIcon()}
			</button>
		`;
	}

	#handleClick(e) {
		if (this.disabled) e.stopPropagation();
	}

}

customElements.define('d2l-toolbar-button', ToolbarButton);
