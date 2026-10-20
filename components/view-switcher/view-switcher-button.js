import '../colors/colors.js';
import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { buttonStyles } from '../button/button-styles.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { labelStyles } from '../typography/styles.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { SlottedIconMixin } from '../icons/slotted-icon-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * A button component to be used in d2l-view-switcher.
 * @fires d2l-view-switcher-select - Dispatched when the item is selected
 */
class ViewSwitcherButton extends PropertyRequiredMixin(FocusMixin(SlottedIconMixin(LitElement))) {

	static properties = {
		/**
		 * REQUIRED: Key for the button
		 * @type {string}
		 */
		key: { type: String, required: true },
		/**
		 * REQUIRED: Text for the button
		 * @type {string}
		 */
		text: { type: String, required: true },
		/**
		 * Indicates if the item is selected
		 * @type {boolean}
		 */
		selected: { type: Boolean, reflect: true },
	};

	static styles = [labelStyles, buttonStyles, css`
		/* Firefox includes a hidden border which messes up button dimensions */
		button::-moz-focus-inner {
			border: 0;
		}

		button {
			background-color: transparent;
			border-radius: 0.2rem;
			display: block;
			font-family: inherit;
			min-height: auto;
			padding-block: 0.3rem;
			padding-inline: 1rem;
		}

		button:hover {
			background-color: var(--d2l-color-mica);
		}

		button:${unsafeCSS(getFocusPseudoClass())} {
			box-shadow: 0 0 0 2px #ffffff;
		}

		:host([selected]) button {
			background-color: var(--d2l-color-tungsten);
			color: #ffffff;
		}
		:host([selected]) d2l-icon,
		:host([selected]) ::slotted(d2l-icon-custom) {
			color: #ffffff;
		}
	`];

	constructor() {
		super();
		this.selected = false;
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		const label = this.hasIcon() ? this.text : undefined;
		const iconPaddingOverride = {
			paddingInline: this.hasIcon() ? '0.3rem' : undefined
		};
		return html`
			<button
				aria-label="${ifDefined(label)}"
				aria-pressed="${this.selected ? 'true' : 'false'}"
				class="d2l-label-text"
				@click="${this.#handleClick}"
				style="${styleMap(iconPaddingOverride)}"
				type="button">
				${this.hasIcon() ? nothing : this.text}
				${this._renderIcon()}
			</button>
		`;
	}

	get _isSwitcherItem() {
		return true;
	}

	async #handleClick() {
		if (this.selected) return;
		this.selected = true;
		this.dispatchEvent(new CustomEvent('d2l-view-switcher-select', {
			detail: { key: this.key },
			bubbles: true,
			composed: true
		}));
	}

}

customElements.define('d2l-view-switcher-button', ViewSwitcherButton);
