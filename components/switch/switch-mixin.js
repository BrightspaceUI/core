import '../colors/colors.js';
import '../tooltip/tooltip.js';
import { css, html } from 'lit-element/lit-element.js';
import { FocusVisiblePolyfillMixin } from '../../mixins/focus-visible-polyfill-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

export const SwitchMixin = superclass => class extends RtlMixin(FocusVisiblePolyfillMixin(superclass)) {

	static get properties() {
		return {
			disabled: { type: Boolean, reflect: true },
			on: { type: Boolean, reflect: true },
			text: { type: String, reflect: true },
			textPosition: { type: String, attribute: 'text-position', reflect: true },
			tooltip: { type: String, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				white-space: nowrap;
			}
			:host([hidden]) {
				display: none;
			}

			.d2l-switch-container {
				background-color: #ffffff;
				border: 2px solid transparent;
				border-radius: 1rem;
				box-sizing: border-box;
				cursor: pointer;
				display: inline-block;
				font-size: 0;
				line-height: 0;
				outline-style: none;
				padding: 0.1rem;
				vertical-align: middle;
			}
			.d2l-switch-container.focus-visible {
				border-color: var(--d2l-color-celestine);
			}
			.d2l-switch-container:hover > .d2l-switch-inner {
				box-shadow: 0 0 0 1px var(--d2l-color-celestine) inset;
				border-color: var(--d2l-color-celestine);
			}
			:host([disabled]) .d2l-switch-container {
				cursor: default;
				opacity: 0.5;
			}
			:host([disabled]) .d2l-switch-container:hover > .d2l-switch-inner,
			:host([disabled]) .d2l-switch-inner:hover {
				box-shadow: none;
				border-color: var(--d2l-color-ferrite);
			}
			.d2l-switch-inner {
				width: 3rem;
				border: 1px solid var(--d2l-color-ferrite);
				border-radius: 0.8rem;
				box-sizing: border-box;
				padding: 0.3rem;
				position: relative;
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
				position: absolute;
				top: -0.15rem;
				left: -0.1rem;
				width: 1.1rem;
				height: 1.1rem;
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
				transform: translateX(-1.2rem);
				right: -0.2rem;
			}
			d2l-icon, d2l-icon-custom {
				height: 0.8rem;
				width: 0.8rem;
			}
			.d2l-switch-icon-on, .d2l-switch-icon-off {
				display: inline-block;
				transition: transform 150ms ease-out;
				transform: scale(1);
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
			:host([on]) .d2l-switch-icon-off,
			:host([on]) .d2l-switch-icon-off {
				transform: scale(0.35);
			}
			:host(:not([on])) .d2l-switch-icon-on,
			:host(:not([on])) .d2l-switch-icon-on {
				color: var(--d2l-color-celestine);
				transform: scale(0.35);
			}
			.d2l-switch-text {
				font-size: 0.8rem;
				font-weight: 400;
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
		this._switchId = getUniqueId();
		this._textId = getUniqueId();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		if (!this.text || this.text.length === 0) {
			console.warn('Switch components require accessible text.');
		}
	}

	render() {
		const tabindex = (!this.disabled ? '0' : undefined);
		const text = html`<span id="${this._textId}" class="d2l-switch-text">${this.text}</span>`;
		const textPosition = (this.textPosition === 'start' || this.textPosition === 'hidden'
			? this.textPosition : 'end');
		const tooltip = (this.tooltip ? html`<d2l-tooltip for="${this._switchId}">${this.tooltip}</d2l-tooltip>` : '');
		return html`
			${textPosition === 'start' ? text : ''}
			<div
				aria-checked="${this.on ? 'true' : 'false'}"
				aria-label="${ifDefined(textPosition === 'hidden' ? this.text : undefined)}"
				aria-labelledby="${ifDefined(textPosition !== 'hidden' ? this._textId : undefined)}"
				class="d2l-switch-container"
				@click="${this._handleClick}"
				id="${this._switchId}"
				@keydown="${this._handleKeyDown}"
				@keyup="${this._handleKeyUp}"
				role="switch"
				tabindex="${ifDefined(tabindex)}">
				<div class="d2l-switch-inner">
					<div class="d2l-switch-toggle"><div></div></div>
					<div class="d2l-switch-icon-on">${this.onIcon}</div>
					<div class="d2l-switch-icon-off">${this.offIcon}</div>
				</div>
			</div>
			${tooltip}
			${textPosition === 'end' ? text : ''}
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (!changedProperties.has('on') || changedProperties.get('on') === undefined) return;
		this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
	}

	focus() {
		const elem = this.shadowRoot.querySelector('.d2l-switch-container');
		if (elem) elem.focus();
	}

	_handleClick() {
		this._toggleState();
	}

	_handleKeyDown(e) {
		// space pressed... prevent default browser scroll
		if (e.keyCode === 32) e.preventDefault();
	}

	_handleKeyUp(e) {
		// space pressed... toggle state
		if (e.keyCode === 32) this._toggleState();
	}

	_toggleState() {
		if (this.disabled) return;
		this.on = !this.on;
	}

};
