import '../colors/colors.js';
import '../icons/icon.js';
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
				border-top-color: var(--d2l-color-celestine);
			}

			button:hover d2l-button-add-icon-text,
			button:focus d2l-button-add-icon-text {
				--d2l-button-add-icon-text-icon-color: var(--d2l-color-celestine);
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
				--d2l-button-add-icon-text-icon-color: var(--d2l-color-galena);
				align-items: center;
				display: flex;
			}
			:host([text]) {
				color: var(--d2l-color-celestine);
				height: 1.5rem;
				padding: 0 0.3rem;
			}

			:host([text]) d2l-icon {
				color: var(--d2l-color-celestine);
				padding-inline-end: 0.2rem;
			}
			:host(:not([text])) d2l-icon {
				color: var(--d2l-button-add-icon-text-icon-color);
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
			<d2l-icon icon="tier1:plus-default"></d2l-icon>
			${this.text ? html`<span class="d2l-label-text">${this.text}</span>` : nothing}
		`;
	}
}
customElements.define('d2l-button-add-icon-text', ButtonAddIconText);
