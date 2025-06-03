import '../icons/icon.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement } from 'lit';
import { ButtonMixin } from './button-mixin.js';
import { buttonStyles } from './button-styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { labelStyles } from '../typography/styles.js';
import { SlottedIconMixin } from '../icons/slotted-icon-mixin.js';

/**
 * A button component that can be used just like the native button, but for advanced or de-emphasized actions.
 * @slot - Default content placed inside of the button
 * @slot icon - Optional slot for a custom icon
 */
class ButtonSubtle extends SlottedIconMixin(ButtonMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * ACCESSIBILITY: A description to be added to the button for accessibility when text on button does not provide enough context
			 * @type {string}
			 */
			description: { type: String },

			/**
			 * Aligns the leading edge of text if value is set to "text" for left-aligned layouts, the trailing edge of text if value is set to "text-end" for right-aligned layouts
			 * @type {'text'|'text-end'|''}
			 */
			hAlign: { type: String, reflect: true, attribute: 'h-align' },

			/**
			 * Indicates that the icon should be rendered on right
			 * @type {boolean}
			 */
			iconRight: { type: Boolean, reflect: true, attribute: 'icon-right' },

			/**
			 * Whether to render the slimmer version of the button
			 * @type {boolean}
			 */
			slim: { type: Boolean, reflect: true },

			/**
			 * ACCESSIBILITY: REQUIRED: Text for the button
			 * @type {string}
			 */
			text: { type: String, reflect: true }
		};
	}

	static get styles() {
		return [super.styles, labelStyles, buttonStyles,
			css`
				:host {
					--d2l-count-badge-background-color: var(--d2l-color-celestine);
					--d2l-count-badge-foreground-color: #ffffff;
					display: inline-block;
				}

				:host([hidden]) {
					display: none;
				}

				button {
					--d2l-button-subtle-padding-inline-start: 0.6rem;
					--d2l-button-subtle-padding-inline-end: 0.6rem;
					align-items: center;
					background-color: transparent;
					border-color: transparent;
					column-gap: 0.3rem;
					display: inline-flex;
					font-family: inherit;
					padding-block-end: 0;
					padding-block-start: 0;
					padding-inline-end: var(--d2l-button-subtle-padding-inline-end);
					padding-inline-start: var(--d2l-button-subtle-padding-inline-start);
					position: relative;
				}

				:host([slim]) button {
					--d2l-button-subtle-padding-inline-start: 0.5rem;
					--d2l-button-subtle-padding-inline-end: 0.5rem;
					min-height: 1.5rem;
				}

				:host([slim]) button.d2l-button-subtle-has-icon {
					--d2l-button-subtle-padding-inline-start: 0.4rem;
					--d2l-button-subtle-padding-inline-end: 0.5rem;
				}

				:host([slim][icon-right]) button.d2l-button-subtle-has-icon {
					--d2l-button-subtle-padding-inline-start: 0.5rem;
					--d2l-button-subtle-padding-inline-end: 0.4rem;
				}

				:host([h-align="text"]) button {
					inset-inline-start: calc(var(--d2l-button-subtle-padding-inline-start) * -1);
				}
				:host([h-align="text-end"]) button {
					inset-inline-end: calc(var(--d2l-button-subtle-padding-inline-end) * -1);
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
				}

				button:hover:not([disabled]) .d2l-button-subtle-content,
				button:focus:not([disabled]) .d2l-button-subtle-content,
				:host([active]:not([disabled])) button .d2l-button-subtle-content {
					color: var(--d2l-color-celestine-minus-1);
				}

				button:hover:not([disabled]),
				button:focus:not([disabled]),
				:host([active]:not([disabled])) {
					--d2l-count-badge-background-color: var(--d2l-color-celestine-minus-1);
				}

				.property-icon,
				slot[name="icon"]::slotted(d2l-icon-custom) {
					color: var(--d2l-color-celestine);
				}

				button:hover:not([disabled]) .property-icon,
				button:focus:not([disabled]) .property-icon,
				:host([active]:not([disabled])) button .property-icon,
				button:hover:not([disabled]) slot[name="icon"]::slotted(d2l-icon-custom),
				button:focus:not([disabled]) slot[name="icon"]::slotted(d2l-icon-custom),
				:host([active]:not([disabled])) slot[name="icon"]::slotted(d2l-icon-custom) {
					color: var(--d2l-color-celestine-minus-1);
				}

				:host([icon-right]) .property-icon,
				:host([icon-right]) slot[name="icon"]::slotted(d2l-icon-custom) {
					order: 1;
				}

				:host([disabled]) button {
					cursor: default;
					opacity: 0.5;
				}
			`
		];
	}

	constructor() {
		super();
		this.iconRight = false;
		this.slim = false;

		this._buttonId = getUniqueId();
		this._describedById = getUniqueId();
	}

	render() {
		const buttonClasses = {
			'd2l-button-subtle-has-icon': this.hasIcon(),
			'd2l-label-text': true
		};
		return html`
			<button
				aria-describedby="${ifDefined(this.description ? this._describedById : undefined)}"
				aria-disabled="${ifDefined(this.disabled && this.disabledTooltip ? 'true' : undefined)}"
				aria-expanded="${ifDefined(this.expanded)}"
				aria-haspopup="${ifDefined(this.ariaHaspopup)}"
				aria-label="${ifDefined(this.ariaLabel)}"
				?autofocus="${this.autofocus}"
				class="${classMap(buttonClasses)}"
				?disabled="${this.disabled && !this.disabledTooltip}"
				form="${ifDefined(this.form)}"
				formaction="${ifDefined(this.formaction)}"
				formenctype="${ifDefined(this.formenctype)}"
				formmethod="${ifDefined(this.formmethod)}"
				?formnovalidate="${this.formnovalidate}"
				formtarget="${ifDefined(this.formtarget)}"
				id="${this._buttonId}"
				name="${ifDefined(this.name)}"
				type="${this._getType()}">
				${this._renderIcon()}
				<span class="d2l-button-subtle-content-wrapper">
					<span class="d2l-button-subtle-content">${this.text}</span>
					<slot></slot>
				</span>
			</button>
			${this.description ? html`<span id="${this._describedById}" hidden>${this.description}</span>` : null}
			${this.disabled && this.disabledTooltip ? html`<d2l-tooltip class="vdiff-target" for="${this._buttonId}">${this.disabledTooltip}</d2l-tooltip>` : ''}
		`;
	}

}

customElements.define('d2l-button-subtle', ButtonSubtle);
