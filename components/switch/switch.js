import '../colors/colors.js';
import '../icons/icon.js';
import '../icons/icon-custom.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class Switch extends LitElement {

	static get properties() {
		return {
			label: { type: String },
			labelHidden: { type: Boolean, attribute: 'label-hidden' },
			offIcon: { type: String, attribute: 'off-icon' },
			on: { type: Boolean, reflect: true },
			onIcon: { type: String, attribute: 'on-icon' },
			role: { type: String, reflect: true },
			tabindex: { type: String, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				outline-style: none;
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
			:host([on]) .d2l-switch-toggle {
				transform: translateX(1.2rem);
			}
			:host([on]) .d2l-switch-toggle > div {
				border-color: var(--d2l-color-celestine);
			}
			:host(:focus) .d2l-switch-container,
			:host(:hover) .d2l-switch-container {
				border-color: var(--d2l-color-celestine);
				border-width: 2px;
			}
			d2l-icon, d2l-icon-custom {
				height: 0.8rem;
				width: 0.8rem;
			}
			d2l-icon-custom {
				stroke: var(--d2l-color-tungsten);
			}
			.d2l-switch-icon-on {
				margin-right: 0.4rem;
			}
			:host([on]) .d2l-switch-icon-on {
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
		this.onIcon = 'tier1:check';
		this.role = 'switch';
		this.tabindex = '0';
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.addEventListener('click', () => {
			this.on = !this.on;
		});
		this.addEventListener('keydown', (e) => {
			// space pressed... prevent defaul browser scroll
			if (e.keyCode === 32) e.preventDefault();
		});
		this.addEventListener('keyup', (e) => {
			if (e.keyCode === 32) this.on = !this.on;
		});
	}

	render() {
		const offIcon = (this.offIcon && this.offIcon.length > 0)
			? html`<d2l-icon class="d2l-switch-icon-off" icon="${this.offIcon}"></d2l-icon>`
			: html`<d2l-icon-custom size="tier1">
				<svg viewBox="0 0 18 18" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
					<circle cx="9" cy="9" r="6" stroke-width="3" fill="none" />
				</svg>
			</d2l-icon-custom>`;

		return html`
			<div class="d2l-switch-container">
				<div class="d2l-switch-inner">
					<div class="d2l-switch-toggle"><div></div></div>
					<d2l-icon class="d2l-switch-icon-on" icon="${this.onIcon}"></d2l-icon>
					${offIcon}
				</div>
			</div>
			${!this.labelHidden ? html`<span aria-hidden="true">${this.label}</span>` : ''}
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('label')) {
			this.setAttribute('aria-label', this.label);
		}
		if (changedProperties.has('on')) {
			if (this.on) this.setAttribute('aria-checked', 'true');
			else this.setAttribute('aria-checked', 'false');
		}
	}

}

customElements.define('d2l-switch', Switch);
