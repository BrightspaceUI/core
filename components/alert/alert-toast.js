import '../button/button-icon.js';
import '../button/button-subtle.js';
import '../colors/colors.js';
import './alert.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

class AlertToast extends LitElement {

	static get properties() {
		return {
			buttonText: { type: String, attribute: 'button-text' },
			hideCloseButton: { type: Boolean, attribute: 'hide-close-button' },
			noAutoClose: { type: Boolean, attribute: 'no-auto-close' },
			open: { type: Boolean, reflect: true },
			subtext: { type: String },
			type: { type: String, reflect: true },
			_visible: { type: Boolean }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}

			.d2l-alert-toast-container {
				border-radius: 0.3rem;
				bottom: 1rem;
				box-shadow: 0 0.1rem 0.6rem 0 rgba(0,0,0,0.10);
				display: none;
				left: 0;
				margin: 0 auto;
				max-width: 600px;
				position: fixed;
				right: 0;
				width: 100%;
				z-index: 10000;
			}

			:host([open]) .d2l-alert-toast-container {
				display: block;
				opacity: 0;
				transform: translateY(0);
				transition-duration: 250ms;
				transition-property: transform, opacity, visibility;
				transition-timing-function: ease-in;
				visibility: hidden;
			}

			:host([open]) .d2l-alert-toast-container.d2l-alert-toast-container-opened {
				opacity: 1;
				transform: translateY(-0.5rem);
				visibility: visible;
			}

			.d2l-alert-toast {
				animation: none;
			}
		`;
	}

	constructor() {
		super();
		this.hideCloseButton = false;
		this.noAutoClose = false;
		this.open = false;
		this._visible = false;
	}

	get open() {
		return this._open;
	}

	set open(val) {
		const oldVal = this._open;
		if (oldVal !== val) {
			this._open = val;
			this.requestUpdate('open', oldVal);
			this._openChanged(val);
		}
	}

	render() {
		const classes = {
			'd2l-alert-toast-container': true,
			'd2l-alert-toast-container-opened': this._visible
		};
		return html`
			<div class=${classMap(classes)} @transitionend=${this._onTransitionEnd}>
				<d2l-alert class="d2l-alert-toast" type=${ifDefined(this.type)} @d2l-alert-closed=${this._close} button-text=${ifDefined(this.buttonText)} ?has-close-button=${!this.hideCloseButton} subtext=${ifDefined(this.subtext)}>
					<slot></slot>
				</d2l-alert>
			</div>
		`;
	}

	connectedCallback() {
		super.connectedCallback();
	}

	_close() {
		this.open = false;
		const alert = this._getAlert();
		if (alert && alert.hasAttribute('hidden')) {
			alert.removeAttribute('hidden');
		}
	}

	_onTransitionEnd(e) {
		if (!this._visible && e.propertyName === 'visibility') {
			this.open = false;
		}
	}

	_getAlert() {
		return this.shadowRoot.querySelector('.d2l-alert-toast');
	}

	_openChanged() {
		if (this.open) {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {

					this.setAttribute('role', 'status');
					this._visible = true;

					if (!this.noAutoClose || this.hideCloseButton) {
						clearTimeout(this._setTimeoutId);
						this._setTimeoutId = setTimeout(() => {
							this._visible = false;
						}, 2500);
					}
				});
			});
		} else {
			this.removeAttribute('role', 'status');
			this._visible = false;
		}
	}
}

customElements.define('d2l-alert-toast', AlertToast);
