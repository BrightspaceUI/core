import '../colors/colors.js';
import { css, html } from 'lit-element/lit-element.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

export const SwitchMixin = superclass => class extends RtlMixin(superclass) {

	static get properties() {
		return {
			label: { type: String, reflect: true },
			labelHidden: { type: Boolean, attribute: 'label-hidden', reflect: true },
			on: { type: Boolean, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-switch-container {
				background-color: #ffffff;
				border: 2px solid transparent;
				border-radius: 1rem;
				box-sizing: border-box;
				display: inline-block;
				font-size: 0;
				line-height: 0;
				outline-style: none;
				padding: 0.1rem;
				vertical-align: middle;
			}
			.d2l-switch-inner {
				border: 1px solid var(--d2l-color-ferrite);
				border-radius: 0.8rem;
				box-sizing: border-box;
				padding: 0.3rem;
			}
			:host([on]) .d2l-switch-inner {
				background-color: var(--d2l-color-celestine-plus-2);
				border-color: var(--d2l-color-celestine);
			}
			.d2l-switch-toggle {
				position: relative;
				transition: transform 150ms linear;
			}
			.d2l-switch-toggle > div {
				background-color: #ffffff;
				border: 1px solid var(--d2l-color-ferrite);
				border-radius: 0.6rem;
				box-sizing: border-box;
				display: inline-block;
				height: 1.2rem;
				left: -0.2rem;
				position: absolute;
				top: -0.2rem;
				width: 1.2rem;
			}
			:host([dir="rtl"]) .d2l-switch-toggle > div {
				left: auto;
				right: -0.2rem;
			}
			:host([on]) .d2l-switch-toggle {
				transform: translateX(1.2rem);
			}
			:host([dir="rtl"][on]) .d2l-switch-toggle {
				transform: translateX(-1.2rem);
			}
			:host([on]) .d2l-switch-toggle > div {
				border-color: var(--d2l-color-celestine);
			}
			.d2l-switch-container:focus,
			.d2l-switch-container:hover {
				border-color: var(--d2l-color-celestine);
				border-width: 2px;
			}
			d2l-icon, d2l-icon-custom {
				height: 0.8rem;
				width: 0.8rem;
			}
			.d2l-switch-icon-on, .d2l-switch-icon-off {
				display: inline-block;
			}
			.d2l-switch-icon-on {
				margin-right: 0.4rem;
			}
			:host([dir="rtl"]) .d2l-switch-icon-on {
				margin-left: 0.4rem;
				margin-right: 0;
			}
			:host([on]) .d2l-switch-icon-on > d2l-icon,
			:host([on]) .d2l-switch-icon-on > d2l-icon-custom {
				color: var(--d2l-color-celestine);
			}
			@media (prefers-reduced-motion: reduce) {
				.d2l-switch-toggle {
					transition: none;
				}
			}
		`;
	}

	constructor() {
		super();
		this.labelHidden = false;
		this.on = false;
		this._labelId = getUniqueId();
	}

	render() {
		return html`
			<div
				aria-checked="${this.on ? 'true' : 'false'}"
				aria-label="${ifDefined(this.labelHidden ? this.label : undefined)}"
				aria-labelledby="${ifDefined(!this.labelHidden ? this._labelId : undefined)}"
				class="d2l-switch-container"
				@click="${this._handleClick}"
				@keydown="${this._handleKeyDown}"
				@keyup="${this._handleKeyUp}"
				role="switch"
				tabindex="0">
				<div class="d2l-switch-inner">
					<div class="d2l-switch-toggle"><div></div></div>
					<div class="d2l-switch-icon-on">${this.onIcon}</div>
					<div class="d2l-switch-icon-off">${this.offIcon}</div>
				</div>
			</div>
			${!this.labelHidden ? html`<span id="${this._labelId}">${this.label}</span>` : ''}
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (!changedProperties.has('on')) return;
		this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
	}

	_handleClick() {
		this.on = !this.on;
	}

	_handleKeyDown(e) {
		// space pressed... prevent default browser scroll
		if (e.keyCode === 32) e.preventDefault();
	}

	_handleKeyUp(e) {
		// space pressed... toggle state
		if (e.keyCode === 32) this.on = !this.on;
	}

};
