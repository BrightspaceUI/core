import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { getFocusPseudoClass, getFocusRingStyles } from '../../helpers/focus.js';
import { VisibleOnAncestorMixin, visibleOnAncestorStyles } from '../../mixins/visible-on-ancestor/visible-on-ancestor-mixin.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

const MODE = {
	icon: 'icon',
	icon_and_text: 'icon-and-text',
	icon_when_interacted: 'icon-when-interacted'
};

/**
 * A component for quickly adding items to a specific locaiton.
 */
class ButtonAdd extends PropertyRequiredMixin(FocusMixin(LocalizeCoreElement(LitElement))) {
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
			text: { type: String, required: true }
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
			${getFocusRingStyles(pseudoClass => `button:${pseudoClass} d2l-button-add-icon-text`, { extraStyles: css`background-color: white; border-radius: 0.3rem;` })}
			:host([mode="icon-when-interacted"]) button:${unsafeCSS(getFocusPseudoClass())} d2l-button-add-icon-text,
			:host([mode="icon"]) button:${unsafeCSS(getFocusPseudoClass())} d2l-button-add-icon-text {
				border-radius: 0.2rem;
				padding: 0.15rem;
			}

			@media (prefers-reduced-motion: no-preference) {
				button:hover .line,
				button:focus .line {
					animation: line-start-animation var(--d2l-button-add-animation-duration) ease-in var(--d2l-button-add-animation-delay) 1 forwards;
					transition: all var(--d2l-button-add-animation-duration) ease-in var(--d2l-button-add-animation-delay);
				}
				button:hover .line-end,
				button:focus .line-end {
					animation-name: line-end-animation;
				}

				@keyframes line-start-animation {
					0% {
						background: linear-gradient(to var(--d2l-inline-end, right), var(--d2l-button-add-line-color) 0%, var(--d2l-button-add-line-color) 11%, var(--d2l-button-add-hover-focus-color) 11%) var(--d2l-inline-start, left) center / 113%;
						opacity: 10%;
					}
					100% {
						background: linear-gradient(to var(--d2l-inline-end, right), var(--d2l-button-add-line-color) 0%, var(--d2l-button-add-line-color) 11%, var(--d2l-button-add-hover-focus-color) 11%) var(--d2l-inline-start, left) center / 113%; /* safari */
						background-position: var(--d2l-inline-end, right);
					}
				}
				@keyframes line-end-animation {
					0% {
						background: linear-gradient(to var(--d2l-inline-start, left), var(--d2l-button-add-line-color) 0%, var(--d2l-button-add-line-color) 11%, var(--d2l-button-add-hover-focus-color) 11%) var(--d2l-inline-end, right) center / 113%;
						opacity: 10%;
					}
					100% {
						background: linear-gradient(to var(--d2l-inline-start, left), var(--d2l-button-add-line-color) 0%, var(--d2l-button-add-line-color) 11%, var(--d2l-button-add-hover-focus-color) 11%) var(--d2l-inline-end, right) center / 113%; /* safari */
						background-position: var(--d2l-inline-start, left);
					}
				}
			}
			@media (prefers-contrast: more) {
				.line {
					background-color: ButtonBorder;
				}
				button:hover .line,
				button:focus .line {
					background-color: Highlight !important;
				}
			}
		`;
	}

	constructor() {
		super();

		this.mode = MODE.icon;

		this._buttonId = getUniqueId();
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
				--d2l-focus-ring-offset: 0;
				--d2l-focus-ring-color: var(--d2l-button-add-hover-focus-color);
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
		return html`
			<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
				<g>
					<circle cx="9" cy="9" r="9" fill="#fff"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M9 2a7 7 0 1 1-7 7 7.008 7.008 0 0 1 7-7Zm0-2a9 9 0 1 0 0 18A9 9 0 0 0 9 0Z"/>
					<path fill-rule="evenodd" clip-rule="evenodd" d="M10 5a1 1 0 0 0-2 0v3H5a1 1 0 0 0 0 2h3v3a1 1 0 1 0 2 0v-3h3a1 1 0 1 0 0-2h-3V5Z"/>
				</g>
			</svg>
			${this.text ? html`<span class="d2l-label-text">${this.text}</span>` : nothing}
		`;
	}
}
customElements.define('d2l-button-add-icon-text', ButtonAddIconText);
