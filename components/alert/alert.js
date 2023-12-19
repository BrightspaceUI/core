import '../button/button-icon.js';
import '../button/button-subtle.js';
import '../colors/colors.js';
import { bodyCompactStyles, bodyStandardStyles } from '../typography/styles.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

/**
 * A component for communicating important information relating to the state of the system and the user's work flow.
 * @slot - Default content placed inside of the component
 * @fires d2l-alert-close - Dispatched when the alert's close button is clicked
 * @fires d2l-alert-button-press - Dispatched when the alert's action button is clicked
 */
class Alert extends LocalizeCoreElement(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Text that is displayed within the alert's action button. If no text is provided the button is not displayed.
			 * @type {string}
			 */
			buttonText: { type: String, attribute: 'button-text' },

			/**
			 * Gives the alert a close button that will close the alert when clicked
			 * @type {boolean}
			 */
			hasCloseButton: { type: Boolean, attribute: 'has-close-button' },

			/**
			 * Opt out of default padding/whitespace around the alert
			 * @type {boolean}
			 */
			noPadding: { type: Boolean, attribute: 'no-padding', reflect: true },

			/**
			 * The text that is displayed below the main alert message
			 * @type {string}
			 */
			subtext: { type: String },

			/**
			 * Type of the alert being displayed
			 * @type {'default'|'critical'|'success'|'warning'}
			 */
			type: { type: String, reflect: true }
		};
	}
	static get styles() {
		return [bodyCompactStyles, bodyStandardStyles, css`

			:host {
				animation: 600ms ease drop-in;
				background: white;
				border: 1px solid var(--d2l-color-mica);
				border-radius: 0.3rem;
				box-sizing: border-box;
				display: flex;
				flex: 1;
				max-width: 710px;
				position: relative;
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
				position: absolute;
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
				padding: 0.9rem 1.5rem;
				position: relative;
			}
			.d2l-alert-text-with-actions {
				padding-right: 0.9rem;
			}

			:host([dir="rtl"]) .d2l-alert-text-with-actions {
				padding-left: 0.9rem;
				padding-right: 1.5rem;
			}
			:host([no-padding]) .d2l-alert-text,
			:host([no-padding]) .d2l-alert-text-with-actions {
				padding: 0 0 0 0.3rem;
			}
			:host([dir="rtl"][no-padding]) .d2l-alert-text,
			:host([dir="rtl"][no-padding]) .d2l-alert-text-with-actions {
				padding: 0 0.3rem 0 0;
			}

			.d2l-alert-subtext {
				margin: 0.5rem 0 0;
			}

			.d2l-alert-action {
				margin: 0.6rem 0.6rem 0.6rem 0;
			}
			:host([dir="rtl"]) .d2l-alert-action {
				margin-left: 0.6rem;
				margin-right: 0;
			}
			:host([no-padding]) .d2l-alert-action {
				margin: 0;
			}

			@media (max-width: 615px) {
				.d2l-alert-text {
					flex: 1;
					position: relative;
				}
				.d2l-alert-action {
					margin: 0.45rem;
				}
			}

			@keyframes drop-in {
				from {
					opacity: 0;
					transform: translate(0, -10px);
				}
				to {
					opacity: 1;
					transform: translate(0, 0);
				}
			}

			@media (prefers-reduced-motion: reduce) {
				:host {
					animation: none;
				}
			}
		`];
	}

	constructor() {
		super();
		this.hasCloseButton = false;
		this.noPadding = false;
		this.type = 'default';
	}

	render() {
		const hasActions = this.buttonText && this.buttonText.length > 0 || this.hasCloseButton;
		const alertTextClasses = {
			'd2l-alert-text': true,
			'd2l-alert-text-with-actions': hasActions,
			'd2l-body-standard': true
		};

		return html`
			<div class="d2l-alert-highlight"></div>
			<div class="${classMap(alertTextClasses)}">
				<slot></slot>
				${this.subtext ? html`<p class="d2l-body-compact d2l-alert-subtext">${this.subtext}</p>` : null}
			</div>
			${hasActions ? html`
				<div class="d2l-alert-action">
					${this.buttonText && this.buttonText.length > 0 ? html`
						<d2l-button-subtle @click=${this._onButtonClick} text=${this.buttonText}></d2l-button-subtle>` : null}
					${this.hasCloseButton ? html`
						<d2l-button-icon @click=${this.close} icon="tier1:close-default" text="${this.localize('components.alert.close')}"></d2l-button-icon>` : null}
				</div>` : null}
		`;
	}

	close() {
		if (this.dispatchEvent(new CustomEvent('d2l-alert-close', { bubbles: true, composed: true, cancelable: true }))) {
			this.hidden = true;
		}
	}

	_onButtonClick() {
		this.dispatchEvent(new CustomEvent(
			'd2l-alert-button-press', { bubbles: true, composed: true }
		));
	}

}

customElements.define('d2l-alert', Alert);
