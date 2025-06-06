import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { VisibleOnAncestorMixin, visibleOnAncestorStyles } from '../../mixins/visible-on-ancestor/visible-on-ancestor-mixin.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFlag } from '../../helpers/flags.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

const MODE = {
	icon: 'icon',
	icon_and_text: 'icon-and-text',
	icon_when_interacted: 'icon-when-interacted'
};
const whiteAddButtonBackgroundFlag = getFlag('GAUD-7495-add-button-white-background', true);

/**
 * A component for quickly adding items to a specific locaiton.
 */
class ButtonAdd extends RtlMixin(PropertyRequiredMixin(FocusMixin(LocalizeCoreElement(LitElement)))) {
	static get properties() {
		return {
			/**
			 * Display mode of the component. Defaults to `icon` (plus icon is always visible). Other options are `icon-and-text` (plus icon and text are always visible), and `icon-when-interacted` (plus icon is only visible when hover or focus).
			 * @type {'icon'|'icon-and-text'|'icon-when-interacted'}
			 */
			mode: { type: String, reflect: true },
			/**
			 * ACCESSIBILITY: The text associated with the button. When mode is `icon-and-text` this text is displayed next to the icon, otherwise this text is in a tooltip.
			 * @type {string}
			 */
			text: { type: String, required: true },
			_whiteBackgroundAddButton: { type: Boolean, attribute: '_white-background-add-button', reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				--d2l-button-add-animation-delay: 0ms;
				--d2l-button-add-animation-duration: 200ms;
				--d2l-button-add-hover-focus-color: var(--d2l-color-celestine-minus-1);
				--d2l-button-add-line-color: var(--d2l-color-mica);
				--d2l-button-add-line-height: 1px;
				--d2l-button-add-hover-focus-line-height: 2px;
			}
			:host([mode="icon-when-interacted"]) {
				--d2l-button-add-animation-delay: 50ms;
			}
			button {
				align-items: center;
				background-color: transparent;
				border: 0;
				box-shadow: none;
				cursor: pointer;
				display: flex;
				font-family: inherit;
				height: 11px;
				justify-content: center;
				margin: 6.5px 0; /* (d2l-button-add-icon-text height - line height) / 2 */
				outline: none;
				padding: 0;
				position: relative;
				user-select: none;
				white-space: nowrap;
				width: 100%;
				z-index: 1; /* needed for button-add to have expected hover behaviour in list (hover from below, tooltip position) */
			}
			:host([mode="icon-and-text"]) button {
				margin: calc((1.5rem - 11px) / 2) 0; /* (d2l-button-add-icon-text height - line height) / 2 */
			}

			.line {
				background: var(--d2l-button-add-line-color);
				height: var(--d2l-button-add-line-height);
				margin: 5px 0;
				width: 100%;
			}

			button:hover .line,
			button:focus .line {
				background: var(--d2l-button-add-hover-focus-color);
				height: var(--d2l-button-add-hover-focus-line-height);
			}
			button:hover d2l-button-add-icon-text,
			button:focus d2l-button-add-icon-text {
				--d2l-button-add-icon-text-color: var(--d2l-button-add-hover-focus-color);
			}
			:host([mode="icon-when-interacted"]) button:hover .line {
				transition-delay: var(--d2l-button-add-animation-delay);
			}

			:host([mode="icon-when-interacted"]) button:not(:focus):not(:hover) d2l-button-add-icon-text {
				position: absolute;
			}
			:host([mode="icon-when-interacted"]) button:hover d2l-button-add-icon-text,
			:host([mode="icon-when-interacted"]) button:focus d2l-button-add-icon-text {
				animation: position-change-animation var(--d2l-button-add-animation-delay); /* add delay in changing position to avoid flash of missing icon space */
			}
			@keyframes position-change-animation {
				0% { position: absolute; }
				100% { position: static; }
			}

			button:${unsafeCSS(getFocusPseudoClass())} d2l-button-add-icon-text {
				background-color: white;
				border-radius: 0.3rem;
				box-shadow: 0 0 0 2px var(--d2l-button-add-hover-focus-color);
			}
			/* remove when GAUD-7495-add-button-white-background is cleaned up */
			:host(:not([_white-background-add-button])) button:${unsafeCSS(getFocusPseudoClass())} d2l-button-add-icon-text {
				background-color: transparent;
			}
			:host([mode="icon-when-interacted"]) button:${unsafeCSS(getFocusPseudoClass())} d2l-button-add-icon-text,
			:host([mode="icon"]) button:${unsafeCSS(getFocusPseudoClass())} d2l-button-add-icon-text {
				border-radius: 0.2rem;
				padding: 0.15rem;
			}

			@media (prefers-reduced-motion: no-preference) {
				button:hover .line,
				button:focus .line {
					transition: all var(--d2l-button-add-animation-duration) ease-in var(--d2l-button-add-animation-delay);
				}
				button:hover .line,
				button:focus .line,
				:host([dir="rtl"]) button:hover .line-end,
				:host([dir="rtl"]) button:focus .line-end {
					animation: line-start-animation var(--d2l-button-add-animation-duration) ease-in var(--d2l-button-add-animation-delay) 1 forwards;
				}
				button:hover .line-end,
				button:focus .line-end,
				:host([dir="rtl"]) button:hover .line-start,
				:host([dir="rtl"]) button:focus .line-start {
					animation-name: line-end-animation;
				}

				@keyframes line-start-animation {
					0% {
						background: linear-gradient(to right, var(--d2l-button-add-line-color) 0%, var(--d2l-button-add-line-color) 11%, var(--d2l-button-add-hover-focus-color) 11%) left center / 113%;
						opacity: 10%;
					}
					100% {
						background: linear-gradient(to right, var(--d2l-button-add-line-color) 0%, var(--d2l-button-add-line-color) 11%, var(--d2l-button-add-hover-focus-color) 11%) left center / 113%; /* safari */
						background-position: right;
					}
				}
				@keyframes line-end-animation {
					0% {
						background: linear-gradient(to left, var(--d2l-button-add-line-color) 0%, var(--d2l-button-add-line-color) 11%, var(--d2l-button-add-hover-focus-color) 11%) right center / 113%;
						opacity: 10%;
					}
					100% {
						background: linear-gradient(to left, var(--d2l-button-add-line-color) 0%, var(--d2l-button-add-line-color) 11%, var(--d2l-button-add-hover-focus-color) 11%) right center / 113%; /* safari */
						background-position: left;
					}
				}
			}
		`;
	}

	constructor() {
		super();

		this.mode = MODE.icon;

		this._buttonId = getUniqueId();
		this._whiteBackgroundAddButton = whiteAddButtonBackgroundFlag;
	}

	static get focusElementSelector() {
		return 'button';
	}

	render() {
		const text = this.text || this.localize('components.button-add.addItem');
		const id = !this.mode !== MODE.icon_and_text ? this._buttonId : undefined;

		const content = this.mode !== MODE.icon_and_text
			? html`<d2l-button-add-icon-text ?visible-on-ancestor="${this.mode === MODE.icon_when_interacted}" animation-type="opacity"></d2l-button-add-icon-text>`
			: html`<d2l-button-add-icon-text text="${text}"></d2l-button-add-icon-text>`;
		const tooltip = this.mode !== MODE.icon_and_text
			? html`<d2l-tooltip class="vdiff-target" delay="100" offset="21" for="${this._buttonId}" for-type="label">${text}</d2l-tooltip>`
			: nothing;

		return html`
			<button
				class="d2l-label-text d2l-visible-on-ancestor-target"
				id="${ifDefined(id)}"
				type="button">
				<div class="line line-start"></div>
				${content}
				<div class="line line-end"></div>
			</button>
			${tooltip}
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
				fill: var(--d2l-button-add-icon-text-color);
			}
			:host([visible-on-ancestor]),
			:host([text]) {
				--d2l-button-add-icon-text-color: var(--d2l-color-celestine);
			}
			:host([text]) {
				color: var(--d2l-button-add-icon-text-color);
				height: 1.5rem;
				padding: 0 0.3rem;
			}

			:host([text]) svg {
				padding-inline-end: 0.2rem;
			}
			:host(:not([text])) svg {
				margin: -0.15rem; /** hover/click target */
				padding: 0.15rem; /** hover/click target */
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
		const whiteBackgroundAddButton = html`
			<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<g>
					<circle cx="9" cy="9" r="9" fill="#fff"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M9 2a7 7 0 1 1-7 7 7.008 7.008 0 0 1 7-7Zm0-2a9 9 0 1 0 0 18A9 9 0 0 0 9 0Z"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M10 5a1 1 0 0 0-2 0v3H5a1 1 0 0 0 0 2h3v3a1 1 0 1 0 2 0v-3h3a1 1 0 1 0 0-2h-3V5Z"/>
				</g>
			</svg>
		`;
		const translucentBackgroundAddButton = html`
			<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<g>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M9 2C10.3845 2 11.7378 2.41054 12.889 3.17971C14.0401 3.94888 14.9373 5.04213 15.4672 6.32122C15.997 7.6003 16.1356 9.00777 15.8655 10.3656C15.5954 11.7235 14.9287 12.9708 13.9497 13.9497C12.9708 14.9287 11.7235 15.5954 10.3656 15.8655C9.00777 16.1356 7.6003 15.997 6.32122 15.4672C5.04213 14.9373 3.94888 14.0401 3.17971 12.889C2.41054 11.7378 2 10.3845 2 9C2.00212 7.14413 2.7403 5.36489 4.05259 4.05259C5.36489 2.7403 7.14413 2.00212 9 2V2ZM9 0C6.61305 0 4.32387 0.948212 2.63604 2.63604C0.948212 4.32387 0 6.61305 0 9C0 11.3869 0.948212 13.6761 2.63604 15.364C4.32387 17.0518 6.61305 18 9 18C11.3869 18 13.6761 17.0518 15.364 15.364C17.0518 13.6761 18 11.3869 18 9C18 6.61305 17.0518 4.32387 15.364 2.63604C13.6761 0.948212 11.3869 0 9 0V0Z" />
					<path fill-rule="evenodd" clip-rule="evenodd" d="M10 5C10 4.44772 9.55228 4 9 4C8.44772 4 8 4.44772 8 5V8H5C4.44772 8 4 8.44772 4 9C4 9.55228 4.44772 10 5 10H8V13C8 13.5523 8.44772 14 9 14C9.55228 14 10 13.5523 10 13V10H13C13.5523 10 14 9.55228 14 9C14 8.44772 13.5523 8 13 8H10V5Z" />
				</g>
			</svg>
		`;
		return html`
			${whiteAddButtonBackgroundFlag ? whiteBackgroundAddButton : translucentBackgroundAddButton}
			${this.text ? html`<span class="d2l-label-text">${this.text}</span>` : nothing}
		`;
	}
}
customElements.define('d2l-button-add-icon-text', ButtonAddIconText);
