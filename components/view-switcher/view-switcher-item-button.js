import '../colors/colors.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { ButtonMixin } from '../button/button-mixin.js';
import { buttonStyles } from '../button/button-styles.js';
import { formatNumber } from '@brightspace-ui/intl';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { labelStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * A segmented button item component used with JS handlers.
 * @fires d2l-view-switcher-item-button-select - Dispatched when the item is selected
 */
class ButtonSegmentedItem extends PropertyRequiredMixin(ButtonMixin(LocalizeCoreElement(LitElement))) {

	static get properties() {
		return {
			/**
			 * REQUIRED: Key of the action
			 * @type {string}
			 */
			key: { type: String, required: true },
			/**
			 * REQUIRED: Button text
			 * @type {string}
			 */
			text: { type: String, required: true },
			/**
			 * Indicates if the item is selected
			 * @type {boolean}
			 */
			selected: { type: Boolean, reflect: true },
			_index: { type: Number },
			_total: { type: Number }
		};
	}

	static get styles() {
		return [labelStyles, buttonStyles, css`
			/* Firefox includes a hidden border which messes up button dimensions */
			button::-moz-focus-inner {
				border: 0;
			}

			button {
				background-color: transparent;
				border-radius: 0.2rem;
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
			slot[name="icon"]::slotted(d2l-icon-custom) {
				color: #ffffff;
			}
		`];
	}

	constructor() {
		super();
		this.selected = false;
		this._index = 0;
		this._total = 1;
	}

	render() {
		const styles = {
			marginInlineEnd: this._index === this._total - 1 ? '0.3rem' : '0rem',
			marginInlineStart: this._index === 0 ? '0.3rem' : '0rem'
		};
		return html`
			<button
				class="d2l-label-text"
				type="button"
				aria-description="${this.localize('components.view-switcher-item-button.position', {
					index: formatNumber(this._index + 1),
					total: formatNumber(this._total)
				})}"
				aria-pressed="${this.selected ? 'true' : 'false'}"
				style="${styleMap(styles)}"
				@click="${this.#handleClick}">
				${this.text}
			</button>
		`;
	}

	async #handleClick() {
		if (this.disabled || this.selected) return;
		this.selected = true;
		this.dispatchEvent(new CustomEvent('d2l-view-switcher-item-button-select', {
			detail: { key: this.key },
			bubbles: true,
			composed: true
		}));

		this.focusable = true;
		await this.updateComplete;
		this.shadowRoot.querySelector('button').focus();
	}

}

customElements.define('d2l-view-switcher-item-button', ButtonSegmentedItem);
