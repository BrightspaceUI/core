import '../icons/icon.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ButtonMixin } from './button-mixin.js';
import { buttonStyles } from './button-styles.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { labelStyles } from '../typography/styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * The `d2l-button-subtle` element can be used just like the native `button`, but for advanced or de-emphasized actions.
 * @slot - Default content placed inside of the button
 */
class ButtonSubtle extends ButtonMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * A description to be added to the `button` for accessibility
			 */
			description: { type: String },

			/**
			 * Aligns the leading edge of text if value is set to "text".
			 */
			hAlign: { type: String, reflect: true, attribute: 'h-align' },

			/**
			 * Preset icon key (e.g. `tier1:gear`)
			 */
			icon: { type: String, reflect: true },

			/**
			 * Indicates that the icon should be rendered on right
			 */
			iconRight: { type: Boolean, reflect: true, attribute: 'icon-right' },

			/**
			 * Text for the button
			 */
			text: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [ labelStyles, buttonStyles,
			css`
				:host {
					display: inline-block;
				}
				:host([hidden]) {
					display: none;
				}

				button {
					background-color: transparent;
					border-color: transparent;
					font-family: inherit;
					padding: 0.55rem 0.6rem;
					position: relative;
				}

				:host([h-align="text"]) button {
					left: -0.6rem;
				}
				:host([dir="rtl"][h-align="text"]) button {
					left: 0;
					right: -0.6rem;
				}

				/* Firefox includes a hidden border which messes up button dimensions */
				button::-moz-focus-inner {
					border: 0;
				}
				button[disabled]:hover,
				button[disabled]:focus,
				:host([active]) button[disabled] {
					background-color: transparent;
				}
				button:hover,
				button:focus,
				:host([active]) button {
					background-color: var(--d2l-color-gypsum);
				}

				.d2l-button-subtle-content {
					color: var(--d2l-color-celestine);
					vertical-align: middle;
				}
				button:hover:not([disabled]) .d2l-button-subtle-content,
				button:focus:not([disabled]) .d2l-button-subtle-content,
				:host([active]:not([disabled])) button .d2l-button-subtle-content {
					color: var(--d2l-color-celestine-minus-1);
				}
				:host([icon]) .d2l-button-subtle-content {
					padding-left: 1.2rem;
				}
				:host([icon][icon-right]) .d2l-button-subtle-content {
					padding-left: 0;
					padding-right: 1.2rem;
				}

				:host([dir="rtl"][icon]) .d2l-button-subtle-content {
					padding-left: 0;
					padding-right: 1.2rem;
				}

				:host([dir="rtl"][icon][icon-right]) .d2l-button-subtle-content {
					padding-left: 1.2rem;
					padding-right: 0;
				}

				d2l-icon.d2l-button-subtle-icon {
					color: var(--d2l-color-celestine);
					display: none;
					height: 0.9rem;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
					width: 0.9rem;
				}
				button:hover:not([disabled]) d2l-icon.d2l-button-subtle-icon,
				button:focus:not([disabled]) d2l-icon.d2l-button-subtle-icon,
				:host([active]:not([disabled])) button d2l-icon.d2l-button-subtle-icon {
					color: var(--d2l-color-celestine-minus-1);
				}
				:host([icon]) d2l-icon.d2l-button-subtle-icon {
					display: inline-block;
				}
				:host([icon][icon-right]) d2l-icon.d2l-button-subtle-icon {
					right: 0.6rem;
				}
				:host([dir="rtl"][icon][icon-right]) d2l-icon.d2l-button-subtle-icon {
					left: 0.6rem;
					right: auto;
				}

				button[disabled] {
					cursor: default;
					opacity: 0.5;
				}
			`
		];
	}

	constructor() {
		super();

		this.iconRight = false;
	}

	render() {
		const icon = this.icon ?
			html`<d2l-icon icon="${this.icon}" class="d2l-button-subtle-icon"></d2l-icon>` : '';
		return html`
			<button
				aria-expanded="${ifDefined(this.ariaExpanded)}"
				aria-haspopup="${ifDefined(this.ariaHaspopup)}"
				aria-label="${ifDefined(this.description || this.ariaLabel)}"
				?autofocus="${this.autofocus}"
				class="d2l-label-text"
				?disabled="${this.disabled}"
				form="${ifDefined(this.form)}"
				formaction="${ifDefined(this.formaction)}"
				formenctype="${ifDefined(this.formenctype)}"
				formmethod="${ifDefined(this.formmethod)}"
				?formnovalidate="${this.formnovalidate}"
				formtarget="${ifDefined(this.formtarget)}"
				name="${ifDefined(this.name)}"
				type="${this._getType()}">
				${icon}
				<span class="d2l-button-subtle-content">${this.text}</span>
				<slot></slot>
		</button>
		`;
	}

}

customElements.define('d2l-button-subtle', ButtonSubtle);
