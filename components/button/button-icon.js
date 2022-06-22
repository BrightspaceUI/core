import '../colors/colors.js';
import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { VisibleOnAncestorMixin, visibleOnAncestorStyles } from '../../mixins/visible-on-ancestor-mixin.js';
import { ButtonMixin } from './button-mixin.js';
import { buttonStyles } from './button-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { ThemeMixin } from '../../mixins/theme-mixin.js';

/**
 * A button component that can be used just like the native button for instances where only an icon is displayed.
 */
class ButtonIcon extends ThemeMixin(ButtonMixin(VisibleOnAncestorMixin(RtlMixin(LitElement)))) {

	static get properties() {
		return {
			/**
			 * A description to be added to the button for accessibility when text on button does not provide enough context
			 * @type {string}
			 */
			description: { type: String },

			/**
			 * Aligns the leading edge of text if value is set to "text"
			 * @type {'text'|''}
			 */
			hAlign: { type: String, reflect: true, attribute: 'h-align' },

			/**
			 * REQUIRED: Preset icon key (e.g. "tier1:gear")
			 * @type {string}
			 */
			icon: { type: String, reflect: true },

			/**
			 * REQUIRED: Accessible text for the button
			 * @type {string}
			 */
			text: { type: String, reflect: true },

			/**
			 * Indicates to display translucent (e.g., on rich backgrounds)
			 * @type {boolean}
			 */
			translucent: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return [ buttonStyles, visibleOnAncestorStyles,
			css`
				:host {
					--d2l-button-icon-background-color: transparent;
					--d2l-button-icon-background-color-hover: var(--d2l-color-gypsum);
					--d2l-button-icon-border-radius: 0.3rem;
					--d2l-button-icon-focus-box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
					--d2l-button-icon-min-height: calc(3rem + 2px);
					--d2l-button-icon-min-width: calc(2rem + 2px);
					--d2l-button-icon-h-align: calc(((2rem + 2px - 0.9rem) / 2) * -1);
					--d2l-icon-fill-color: var(--d2l-button-icon-fill-color, var(--d2l-color-tungsten));
					display: inline-block;
				}
				:host([hidden]) {
					display: none;
				}
				:host([translucent]) {
					--d2l-button-icon-background-color: rgba(0, 0, 0, 0.5);
					--d2l-button-icon-background-color-hover: var(--d2l-color-celestine);
					--d2l-button-icon-focus-box-shadow: inset 0 0 0 2px var(--d2l-color-celestine), inset 0 0 0 3px white;
					--d2l-icon-fill-color: white;
					--d2l-button-icon-fill-color-hover: white;
				}
				:host([theme="dark"]) {
					--d2l-button-icon-background-color: transparent;
					--d2l-button-icon-background-color-hover: rgba(51, 53, 54, 0.9); /* tungsten @70% @90% */
					--d2l-button-icon-focus-box-shadow: 0 0 0 2px black, 0 0 0 4px var(--d2l-color-celestine-plus-1);
					--d2l-icon-fill-color: var(--d2l-color-sylvite);
					--d2l-button-icon-fill-color-hover: var(--d2l-color-sylvite);
				}

				button {
					background-color: var(--d2l-button-icon-background-color);
					border-color: transparent;
					border-radius: var(--d2l-button-icon-border-radius);
					font-family: inherit;
					min-height: var(--d2l-button-icon-min-height);
					min-width: var(--d2l-button-icon-min-width);
					padding: 0;
					position: relative;
				}

				:host([h-align="text"]) button {
					left: var(--d2l-button-icon-h-align);
				}
				:host([dir="rtl"][h-align="text"]) button {
					left: 0;
					right: var(--d2l-button-icon-h-align);
				}

				/* Firefox includes a hidden border which messes up button dimensions */
				button::-moz-focus-inner {
					border: 0;
				}
				button[disabled]:hover,
				button[disabled]:focus,
				:host([active]) button[disabled] {
					background-color: var(--d2l-button-icon-background-color);
				}
				button:hover,
				button:focus,
				:host([active]) button {
					--d2l-icon-fill-color: var(--d2l-button-icon-fill-color-hover, var(--d2l-color-tungsten));
					background-color: var(--d2l-button-icon-background-color-hover);
				}
				button.focus-visible {
					box-shadow: var(--d2l-button-icon-focus-box-shadow);
				}

				.d2l-button-icon {
					height: 0.9rem;
					width: 0.9rem;
				}

				:host([translucent]) button {
					transition-duration: 0.2s, 0.2s;
					transition-property: background-color, box-shadow;
				}
				:host([translucent][visible-on-ancestor]) button {
					transition-duration: 0.4s, 0.4s;
				}

				:host([disabled]) button {
					cursor: default;
					opacity: 0.5;
				}

				@media (prefers-reduced-motion: reduce) {
					:host([translucent]) button {
						transition: none;
					}
				}
			`
		];
	}

	constructor() {
		super();
		this.translucent = false;

		/** @internal */
		this._buttonId = getUniqueId();
		/** @internal */
		this._describedById = getUniqueId();
	}

	render() {
		return html`
			<button
				aria-describedby="${ifDefined(this.description ? this._describedById : undefined)}"
				aria-disabled="${ifDefined(this.disabled && this.disabledTooltip ? 'true' : undefined)}"
				aria-expanded="${ifDefined(this.ariaExpanded)}"
				aria-haspopup="${ifDefined(this.ariaHaspopup)}"
				aria-label="${this.ariaLabel ? this.ariaLabel : ifDefined(this.text)}"
				?autofocus="${this.autofocus}"
				class="d2l-label-text"
				?disabled="${this.disabled && !this.disabledTooltip}"
				form="${ifDefined(this.form)}"
				formaction="${ifDefined(this.formaction)}"
				formenctype="${ifDefined(this.formenctype)}"
				formmethod="${ifDefined(this.formmethod)}"
				?formnovalidate="${this.formnovalidate}"
				formtarget="${ifDefined(this.formtarget)}"
				id="${this._buttonId}"
				name="${ifDefined(this.name)}"
				title="${ifDefined(this.text)}"
				type="${this._getType()}">
				<d2l-icon icon="${ifDefined(this.icon)}" class="d2l-button-icon"></d2l-icon>
		</button>
		${this.description ? html`<span id="${this._describedById}" hidden>${this.description}</span>` : null}
		${this.disabled && this.disabledTooltip ? html`<d2l-tooltip for="${this._buttonId}">${this.disabledTooltip}</d2l-tooltip>` : ''}
		`;
	}

}

customElements.define('d2l-button-icon', ButtonIcon);
