import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement, nothing } from 'lit';
import { VisibleOnAncestorMixin, visibleOnAncestorStyles } from '../../mixins/visible-on-ancestor/visible-on-ancestor-mixin.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

/**
 * A component for quickly adding items to a specific locaiton.
 */
class ButtonAdd extends PropertyRequiredMixin(FocusMixin(LocalizeCoreElement(LitElement))) {
	static get properties() {
		return {
			/**
			 * ONLY used when text-visible is FALSE. When true, icon is only visible when component receives hover or focus. When false (default), icon is always visible.
			 */
			iconOnlyVisibleOnHoverFocus: { type: Boolean, reflect: true, attribute: 'icon-only-visible-on-hover-focus' },
			/**
			 * When text-visible is true, the text to show in the button. When text-visible is false, the text to show in the tooltip.
			 * @type {string}
			 */
			text: { type: String, required: true },
			/**
			 * When true, show the button with icon and visible text. When false, only show icon.
			 * @type {boolean}
			 */
			textVisible: { type: Boolean, reflect: true, attribute: 'text-visible' }
		};
	}

	static get styles() {
		return css`
			:host {
				--d2l-button-add-line-style: solid;
			}
			button {
				align-items: center;
				background-color: transparent;
				border: 0;
				box-shadow: none;
				cursor: pointer;
				display: flex;
				font-family: inherit;
				height: 0.9rem;
				justify-content: center;
				outline: none;
				padding: 0;
				user-select: none;
				white-space: nowrap;
				width: 100%;
			}

			.line {
				border-top: 1px var(--d2l-button-add-line-style) var(--d2l-color-mica);
				width: 100%;
			}

			button:hover .line,
			button:focus .line {
				border-top-color: var(--d2l-color-celestine-minus-1);
			}
			button:hover d2l-button-add-icon-text,
			button:focus d2l-button-add-icon-text {
				--d2l-button-add-icon-text-color: var(--d2l-color-celestine-minus-1);
			}

			:host([icon-only-visible-on-hover-focus]) button:not(:focus):not(:hover) d2l-button-add-icon-text {
				position: absolute;
			}
		`;
	}

	constructor() {
		super();

		this.iconOnlyVisibleOnHoverFocus = false;
		this.textVisible = false;

		this._buttonId = getUniqueId();
		this._hasFocus = false;
		this._hasHover = false;
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		const text = this.text || this.localize('components.button-add.addItem');
		const id = !this.textVisible ? this._buttonId : undefined;

		const content = this.textVisible
			? html`<d2l-button-add-icon-text text="${text}"></d2l-button-add-icon-text>`
			: this._renderWithTextHidden(text);

		return html`
			<button
				@blur="${this._onBlur}"
				@focus="${this._onFocus}"
				@mouseenter="${this._onMouseEnter}"
				@mouseleave="${this._onMouseLeave}"
				class="d2l-label-text d2l-visible-on-ancestor-target"
				id="${ifDefined(id)}"
				type="button">
				<div class="line"></div>
				${content}
				<div class="line"></div>
			</button>
		`;
	}

	_renderWithTextHidden(text) {
		return html`
			<d2l-button-add-icon-text ?visible-on-ancestor="${this.iconOnlyVisibleOnHoverFocus}"></d2l-button-add-icon-text>
			<d2l-tooltip class="vdiff-target" offset="18" for="${this._buttonId}" for-type="label">${text}</d2l-tooltip>
		`;
	}

}
customElements.define('d2l-button-add', ButtonAdd);

/**
 * @ignore
 */
class ButtonAddIconText extends VisibleOnAncestorMixin(LitElement) {
	static get properties() {
		return {
			text: { type: String }
		};
	}

	static get styles() {
		return [visibleOnAncestorStyles, css`
			:host {
				--d2l-button-add-icon-text-color: var(--d2l-color-galena);
				align-items: center;
				display: flex;
			}
			:host([text]) {
				--d2l-button-add-icon-text-color: var(--d2l-color-celestine);
				color: var(--d2l-button-add-icon-text-color);
				height: 1.5rem;
				padding: 0 0.3rem;
			}

			svg {
				fill: var(--d2l-button-add-icon-text-color);
			}

			:host([text]) svg {
				padding-inline-end: 0.2rem;
			}
			:host(:not([text])) svg {
				margin: -3px; /** hover/click target */
				padding: 3px; /** hover/click target */
			}

			span {
				font-size: 0.7rem;
				font-weight: 700;
				letter-spacing: 0.2px;
				line-height: 1rem;
			}`
		];
	}

	render() {
		return html`
			<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<g>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M9 2C10.3845 2 11.7378 2.41054 12.889 3.17971C14.0401 3.94888 14.9373 5.04213 15.4672 6.32122C15.997 7.6003 16.1356 9.00777 15.8655 10.3656C15.5954 11.7235 14.9287 12.9708 13.9497 13.9497C12.9708 14.9287 11.7235 15.5954 10.3656 15.8655C9.00777 16.1356 7.6003 15.997 6.32122 15.4672C5.04213 14.9373 3.94888 14.0401 3.17971 12.889C2.41054 11.7378 2 10.3845 2 9C2.00212 7.14413 2.7403 5.36489 4.05259 4.05259C5.36489 2.7403 7.14413 2.00212 9 2V2ZM9 0C6.61305 0 4.32387 0.948212 2.63604 2.63604C0.948212 4.32387 0 6.61305 0 9C0 11.3869 0.948212 13.6761 2.63604 15.364C4.32387 17.0518 6.61305 18 9 18C11.3869 18 13.6761 17.0518 15.364 15.364C17.0518 13.6761 18 11.3869 18 9C18 6.61305 17.0518 4.32387 15.364 2.63604C13.6761 0.948212 11.3869 0 9 0V0Z" />
					<path fill-rule="evenodd" clip-rule="evenodd" d="M10 5C10 4.44772 9.55228 4 9 4C8.44772 4 8 4.44772 8 5V8H5C4.44772 8 4 8.44772 4 9C4 9.55228 4.44772 10 5 10H8V13C8 13.5523 8.44772 14 9 14C9.55228 14 10 13.5523 10 13V10H13C13.5523 10 14 9.55228 14 9C14 8.44772 13.5523 8 13 8H10V5Z" />
				</g>
			</svg>
			${this.text ? html`<span class="d2l-label-text">${this.text}</span>` : nothing}
		`;
	}
}
customElements.define('d2l-button-add-icon-text', ButtonAddIconText);
