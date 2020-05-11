import '../button/button-icon.js';
import '../button/button-subtle.js';
import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { LocalizeStaticMixin } from '../../mixins/localize-static-mixin.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class Alert extends LocalizeStaticMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			buttonText: { type: String, attribute: 'button-text' },
			hasCloseButton: { type: Boolean, attribute: 'has-close-button' },
			subtext: { type: String },
			type: { type: String, reflect: true }
		};
	}
	static get styles() {
		return [bodyCompactStyles, css`

			:host {
				animation: 600ms ease drop-in;
				background: white;
				border-radius: 0.3rem;
				border: 1px solid var(--d2l-color-mica);
				box-sizing: border-box;
				display: flex;
				flex: 1;
				max-width: 710px;
				width: 100%;
			}

			:host([hidden]) {
				display: none;
			}

			.d2l-alert-highlight {
				border-radius: 0.3rem 0 0 0.3rem;
				bottom: 0;
				left: 0;
				margin: -1px;
				min-width: 0.3rem;
				top: 0;
				width: 0.3rem;
			}
			:host([dir="rtl"]) .d2l-alert-highlight {
				border-radius: 0 0.3rem 0.3rem 0;
				left: auto;
				right: 0;
			}
			:host([type="critical"]) .d2l-alert-highlight,
			:host([type="error"]) .d2l-alert-highlight {
				background-color: var(--d2l-color-feedback-error);
			}
			:host([type="warning"]) .d2l-alert-highlight {
				background-color: var(--d2l-color-feedback-warning);
			}
			:host([type="default"]) .d2l-alert-highlight,
			:host([type="call-to-action"]) .d2l-alert-highlight {
				background-color: var(--d2l-color-feedback-action);
			}
			:host([type="success"]) .d2l-alert-highlight {
				background-color: var(--d2l-color-feedback-success);
			}

			.d2l-alert-text {
				flex: 1;
				padding: 1rem 1.2rem 1rem 1.5rem;
				position: relative;
			}
			:host([dir="rtl"]) .d2l-alert-text {
				padding-left: 1.2rem;
				padding-right: 1.5rem;
			}
			.d2l-alert-subtext {
				margin: 0.5rem 0 0;
			}

			.d2l-alert-action {
				margin: 0.3rem;
			}

			@keyframes drop-in {
				from {
					opacity: 0.0;
					transform: translate(0,-10px);
				}
				to {
					opacity: 1;
					transform: translate(0,0);
				}
			}

			@media (prefers-reduced-motion: reduce) {
				:host {
					animation: none;
				}
			}
		`];
	}

	static get resources() {
		return {
			'ar': { 'close': 'إغلاق التنبيه'},
			'de': { 'close': 'Benachrichtigung schließen' },
			'en': { 'close': 'Close Alert'},
			'es': { 'close': 'Alerta de cierre' },
			'fr': { 'close': 'Fermer l\'alerte' },
			'ja': { 'close': 'アラートを閉じる' },
			'ko': { 'close': '경보 닫기' },
			'nl': { 'close': 'Waarschuwing sluiten' },
			'pt': { 'close': 'Fechar Alerta' },
			'sv': { 'close': 'Stängningsvarning' },
			'tr': { 'close': 'Kapatma Uyarısı' },
			'zh-tw': { 'close': '關閉警示' },
			'zh': { 'close': '关闭警报' }
		};
	}

	constructor() {
		super();
		this.hasCloseButton = false;
		this.type = 'default';
	}

	close() {
		const event = new CustomEvent('d2l-alert-closed', { bubbles: true, composed: true, cancelable: true });
		if (this.dispatchEvent(event)) {
			this.hidden = true;
		}
	}

	_onButtonClick() {
		this.dispatchEvent(new CustomEvent(
			'd2l-alert-button-pressed', { bubbles: true, composed: true }
		));
	}

	render() {
		return html`
			<div class="d2l-alert-highlight"></div>
			<div class="d2l-alert-text">
				<slot></slot>
				${this.subtext ? html`<p class="d2l-body-compact d2l-alert-subtext">${this.subtext}</p>` : null}
			</div>
			${this.buttonText && this.buttonText.length > 0 ? html`<d2l-button-subtle class="d2l-alert-action" text=${this.buttonText} @click=${this._onButtonClick}></d2l-button-subtle>` : null}
			${this.hasCloseButton ? html`<d2l-button-icon class="d2l-alert-action" icon="d2l-tier1:close-default" text="${this.localize('close')}" @click=${this.close}></d2l-button-icon>` : null}
		`;
	}
}

customElements.define('d2l-alert', Alert);
