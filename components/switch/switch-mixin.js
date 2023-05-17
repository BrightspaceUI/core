import '../colors/colors.js';
import { css, html, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

export const SwitchMixin = superclass => class extends FocusMixin(RtlMixin(superclass)) {

	static get properties() {
		return {
			/**
			 * Disables the switch from being toggled.
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Active state.
			 * @type {boolean}
			 */
			on: { type: Boolean, reflect: true },
			/**
			 * @ignore - Need to add documentation in each component that uses this mixin.
			 */
			text: { type: String, reflect: true },
			/**
			 * Determines where text should be positioned relative to the switch.
			 * @type {'start'|'end'|'hidden'}
			 * @default end
			 */
			textPosition: { type: String, attribute: 'text-position', reflect: true },
			_hovering: { state: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				user-select: none;
				white-space: nowrap;
			}
			:host([hidden]) {
				display: none;
			}

			.d2l-switch-container {
				background-color: var(--d2l-switch-container-background-color, '#fff');
				border: 2px solid transparent;
				border-radius: 1rem;
				box-sizing: border-box;
				cursor: default;
				display: inline-block;
				font-size: 0;
				line-height: 0;
				outline-style: none;
				padding: 0.1rem;
				vertical-align: middle;
			}
			.d2l-switch-container:${unsafeCSS(getFocusPseudoClass())} {
				border-color: var(--d2l-color-celestine);
			}
			:host([disabled]) .d2l-switch-container {
				cursor: default;
				opacity: 0.5;
			}
			:host([disabled]) .d2l-switch-container:hover > .d2l-switch-inner,
			:host([disabled]) .d2l-switch-inner:hover {
				border-color: var(--d2l-color-ferrite);
				box-shadow: none;
			}
			.d2l-switch-inner {
				background-color: var(--d2l-color-regolith);
				border: 1px solid var(--d2l-color-ferrite);
				border-radius: 0.8rem;
				box-sizing: border-box;
				padding: 0.3rem;
				position: relative;
				width: 3rem;
			}
			:host([on]) .d2l-switch-inner {
				background-color: var(--d2l-color-celestine-plus-2);
			}
			.d2l-switch-toggle {
				position: relative;
				transition: transform 150ms ease-out;
				z-index: 1;
			}
			.d2l-switch-toggle > div {
				background-color: #ffffff;
				border: 1px solid var(--d2l-color-ferrite);
				border-radius: 0.6rem;
				box-sizing: border-box;
				display: inline-block;
				height: 1.1rem;
				left: -0.1rem;
				position: absolute;
				top: -0.15rem;
				width: 1.1rem;
			}
			:host([on]) .d2l-switch-toggle > div {
				left: 0.1rem;
			}
			:host([dir="rtl"][on]) .d2l-switch-toggle > div {
				right: 0.3rem;
			}
			:host([dir="rtl"]) .d2l-switch-toggle > div {
				left: auto;
				right: -0.1rem;
			}
			:host([on]) .d2l-switch-toggle {
				transform: translateX(1.2rem);
			}
			:host([dir="rtl"][on]) .d2l-switch-toggle {
				right: -0.2rem;
				transform: translateX(-1.2rem);
			}
			d2l-icon, d2l-icon-custom {
				height: 0.8rem;
				width: 0.8rem;
			}
			.d2l-switch-icon-on, .d2l-switch-icon-off {
				display: inline-block;
				transform: scale(1);
				transition: transform 150ms ease-out;
			}
			.d2l-switch-icon-on {
				margin-right: 0.65rem;
			}
			:host([dir="rtl"]) .d2l-switch-icon-on {
				margin-left: 0.65rem;
				margin-right: 0;
			}
			:host([on]) .d2l-switch-icon-on > d2l-icon,
			:host([on]) .d2l-switch-icon-on > d2l-icon-custom {
				color: var(--d2l-color-celestine);
			}
			:host([on]) .d2l-switch-icon-off {
				transform: scale(0.35);
			}
			:host(:not([on])) .d2l-switch-icon-on {
				color: var(--d2l-color-celestine);
				transform: scale(0.35);
			}
			.d2l-switch-text {
				cursor: default;
				font-size: 0.8rem;
				font-weight: 400;
			}
			:host([text-position="hidden"]) .d2l-switch-text {
				display: none;
			}
			.d2l-switch-inner:hover, .switch-hover {
				border-color: var(--d2l-color-celestine);
				box-shadow: 0 0 0 1px var(--d2l-color-celestine) inset;
			}
			@media (prefers-reduced-motion: reduce) {
				.d2l-switch-toggle,
				.d2l-switch-icon-on,
				.d2l-switch-icon-off {
					transition: none;
				}
			}
		`;
	}

	constructor() {
		super();
		this.disabled = false;
		this.labelHidden = false;
		this.on = false;
		this.textPosition = 'end';
		this._textId = getUniqueId();
		this._hovering = false;
	}

	static get focusElementSelector() {
		return '.d2l-switch-container';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (!this.text || this.text.length === 0) {
			console.warn('Switch components require accessible text.');
		}
	}

	render() {
		const tabindex = (!this.disabled ? '0' : undefined);
		const innerSwitchClasses = {
			'switch-hover': this._hovering,
			'd2l-switch-inner': true
		};
		const switchLabel = html`<span id="${this._textId}" class="d2l-switch-text">${this._labelContent}</span>`;
		const textPosition = (this.textPosition === 'start' || this.textPosition === 'hidden'
			? this.textPosition : 'end');

		// Note: we render the switchLabel in the case of textPosition === 'hidden' so that any slot handlers can pick up on content being passed in
		return html`
			${textPosition === 'start' ? switchLabel : ''}
			<div
				aria-checked="${this.on ? 'true' : 'false'}"
				aria-label="${ifDefined(textPosition === 'hidden' ? this.text : undefined)}"
				aria-labelledby="${ifDefined(textPosition !== 'hidden' ? this._textId : undefined)}"
				class="d2l-switch-container"
				@click="${this._handleClick}"
				@keydown="${this._handleKeyDown}"
				@keyup="${this._handleKeyUp}"
				role="switch"
				tabindex="${ifDefined(tabindex)}">
				<div class="${classMap(innerSwitchClasses)}">
					<div class="d2l-switch-toggle"><div></div></div>
					<div class="d2l-switch-icon-on">${this.onIcon}</div>
					<div class="d2l-switch-icon-off">${this.offIcon}</div>
				</div>
			</div>
			${textPosition === 'end' || textPosition === 'hidden' ? switchLabel : ''}
		`;
	}

	get _labelContent() {
		return html`<span
						@click='${this._handleClick}'
						@mouseenter='${this._handleSwitchHover}'
						@mouseleave='${this._handleSwitchHoverLeave}'>
						${this.text}
					</span>`;
	}

	_handleClick() {
		this._toggleState();
	}

	_handleKeyDown(e) {
		// enter/space pressed... prevent default browser scroll
		if (e.keyCode === 13 || e.keyCode === 32) e.preventDefault();
	}

	_handleKeyUp(e) {
		// enter/space pressed... toggle state
		if (e.keyCode === 13 || e.keyCode === 32) this._toggleState();
	}

	_handleSwitchHover() {
		this._hovering = true;
	}

	_handleSwitchHoverLeave() {
		this._hovering = false;
	}

	_toggleState() {
		if (this.disabled) return;
		this.on = !this.on;
		/** Dispatched when the `on` property is updated */
		this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
	}
};
