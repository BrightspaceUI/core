import './alert.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';

/**
 * TODO: what if alert resizes? would need to adjust heights on all other alerts
 */

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const states = {
	CLOSED: 'closed', // the toast is closed
	CLOSING: 'closing', // the close animation is running
	PREOPENING: 'preopening', // a pause before running the opening animation because transitions won't run when changing from 'diplay: none' to 'display: block'
	SLIDING: 'sliding', // the transform animation when multiple alerts are on the page is running
	OPENING: 'opening', // the opening animation is running
	OPEN: 'open' // the toast is open
};

/**
 *  A component for communicating important information relating to the state of the system and the user's work flow, displayed as a pop-up at the bottom of the screen that automatically dismisses itself by default.
 * @slot - Default content placed inside of the component
 * @fires d2l-alert-toast-button-press - Dispatched when the toast's action button is clicked
 * @fires d2l-alert-toast-close - Dispatched when the toast is closed
 */
class AlertToast extends LitElement {

	static get properties() {
		return {
			/**
			 * Text that is displayed within the alert's action button. If no text is provided the button is not displayed.
			 * @type {string}
			 */
			buttonText: { type: String, attribute: 'button-text' },

			/**
			 * Hide the close button to prevent users from manually closing the alert
			 * @type {boolean}
			 */
			hideCloseButton: { type: Boolean, attribute: 'hide-close-button' },

			/**
			 * Prevents the alert from automatically closing 4 seconds after opening
			 * @type {boolean}
			 */
			noAutoClose: { type: Boolean, attribute: 'no-auto-close' },

			/**
			 * Open or close the toast alert
			 * @type {boolean}
			 */
			open: { type: Boolean, reflect: true },

			/**
			 * The text that is displayed below the main alert message
			 * @type {string}
			 */
			subtext: { type: String },

			/**
			 * Type of the alert being displayed
			 * @type {'default'|'critical'|'success'|'warning'}
			 * @default "default"
			 */
			type: { type: String, reflect: true },
			_bottomHeight: { type: Number },
			_bottomMargin: { type: Number },
			_closeClicked: { state: true },
			_state: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}

			.d2l-alert-toast-container {
				border-radius: 0.3rem;
				box-shadow: 0 0.1rem 0.6rem 0 rgba(0, 0, 0, 0.1);
				display: none;
				left: 0;
				margin: 0 auto 1.5rem;
				max-width: 600px;
				position: fixed;
				right: 0;
				width: 100%;
				z-index: 10000;
			}

			.d2l-alert-toast-container:not([data-state="closed"]) {
				display: block;
			}

			.d2l-alert-toast-container[data-state="opening"],
			.d2l-alert-toast-container[data-state="closing"] {
				transition-duration: 600ms;
				transition-property: transform, opacity;
				transition-timing-function: ease;
			}

			.d2l-alert-toast-container.d2l-alert-toast-container-not-bottom[data-state="closing"] {
				transition-property: opacity;
				transform: unset;
			}

			.d2l-alert-toast-container.d2l-alert-toast-container-close-clicked[data-state="closing"] {
				transition-duration: 200ms;
			}

			.d2l-alert-toast-container[data-state="preopening"],
			.d2l-alert-toast-container[data-state="closing"] {
				opacity: 0;
				transform: translateY(5rem);
			}

			.d2l-alert-toast-container[data-state="opening"] {
				opacity: 1;
				transform: translateY(0);
			}

			.d2l-alert-toast-container[data-state="sliding"] {
				transition: bottom 600ms ease;
			}

			d2l-alert {
				animation: none;
			}

			@media (max-width: 615px) {
				.d2l-alert-toast-container {
					margin-bottom: 12px;
					width: calc(100% - 16px);
				}
			}
		`;
	}

	constructor() {
		super();
		this.hideCloseButton = false;
		this.noAutoClose = false;
		this.open = false;

		this._bottomHeight = 0;
		this._bottomMargin = 0;
		this._closeClicked = false;
		this._hasFocus = false;
		this._hasMouse = false;
		this._state = states.CLOSED;

		this._handleAlertOpen = this._handleAlertOpen.bind(this);
		this._handleAlertClose = this._handleAlertClose.bind(this);
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

	connectedCallback() {
		super.connectedCallback();
		document.body.addEventListener('d2l-alert-toast-open', this._handleAlertOpen);
		document.body.addEventListener('d2l-alert-toast-close', this._handleAlertClose);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		document.body.removeEventListener('d2l-alert-toast-open', this._handleAlertOpen);
		document.body.removeEventListener('d2l-alert-toast-close', this._handleAlertClose);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this._innerContainer = this.shadowRoot.querySelector('.d2l-alert-toast-container');
	}

	render() {
		const bottomSpacing = (this._bottomHeight || this._bottomMargin) ? `calc(${this._bottomHeight}px + ${this._bottomMargin}rem)` : undefined;
		const containerStyles = {
			bottom: bottomSpacing || 0
		};
		const containerClasses = {
			'd2l-alert-toast-container': true,
			'd2l-alert-toast-container-close-clicked': this._closeClicked,
			'd2l-alert-toast-container-not-bottom': this._bottomHeight > 0,
			'vdiff-target': true
		};
		return html`
			<div
				class="${classMap(containerClasses)}"
				data-state="${this._state}"
				style="${styleMap(containerStyles)}"
				@transitionend=${this._onTransitionEnd}>
				<d2l-alert
					@blur=${this._onBlur}
					button-text="${ifDefined(this.buttonText)}"
					@d2l-alert-button-press=${this._handleButtonPress}
					@d2l-alert-close=${this._onCloseClicked}
					@focus=${this._onFocus}
					?has-close-button="${!this.hideCloseButton}"
					?hidden="${this._state === states.CLOSED}"
					@mouseenter=${this._onMouseEnter}
					@mouseleave=${this._onMouseLeave}
					subtext="${ifDefined(this.subtext)}"
					type="${ifDefined(this.type)}">
					<slot></slot>
				</d2l-alert>
			</div>
		`;
	}

	updated(changedProperties) {
		if (changedProperties.get('open') && this.open === false) {
			this._hasFocus = false;
			this._hasMouse = false;
		}
	}

	/** @ignore */
	get _state() {
		return this.__state;
	}

	set _state(val) {
		const oldVal = this.__state;
		if (oldVal !== val) {
			this.__state = val;
			this.requestUpdate('_state', oldVal);
			this._stateChanged(val, oldVal);
		}
	}

	_closeTimerStart() {
		clearTimeout(this._setTimeoutId);
		if (!this.noAutoClose && !this._hasFocus && !this._hasMouse) {
			const duration = this.buttonText ? 10000 : 4000;
			this._setTimeoutId = setTimeout(() => {
				this.open = false;
			}, duration);
		}
	}

	_closeTimerStop() {
		clearTimeout(this._setTimeoutId);
	}

	_handleAlertClose(e) {
		if (!e || e.target === this || !this.open) return;

		const containerBottom = parseFloat(getComputedStyle(this._innerContainer).getPropertyValue('bottom'));
		const closingContainerBottom = e.detail.bottom;
		if (closingContainerBottom > containerBottom) return; // closing alert is above this alert, no need to adjust bottom spacing

		this._bottomHeight -= e.detail.height;
		this._bottomMargin -= 0.6;
		if (!reduceMotion) this._state = states.SLIDING;
	}

	_handleAlertOpen(e) {
		if (!e || e.target === this || !this.open) return;

		this._bottomHeight += e.detail.height;
		this._bottomMargin += 0.6;
		if (!reduceMotion) this._state = states.SLIDING;
	}

	_handleButtonPress(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('d2l-alert-toast-button-press'));
	}

	_onBlur() {
		this._hasFocus = false;
		this._closeTimerStart();
	}

	_onCloseClicked(e) {
		e.preventDefault();
		this._closeClicked = true;
		this.open = false;
	}

	_onFocus() {
		this._hasFocus = true;
		this._closeTimerStop();
	}

	_onMouseEnter() {
		this._hasMouse = true;
		this._closeTimerStop();
	}

	_onMouseLeave() {
		this._hasMouse = false;
		this._closeTimerStart();
	}

	_onTransitionEnd() {
		if (this._state === states.OPENING || this._state === states.SLIDING) {
			this._state = states.OPEN;
		} else if (this._state === states.CLOSING) {
			this._state = states.CLOSED;
			this._bottomHeight = 0;
			this._bottomMargin = 0;
			this._closeClicked = false;
		}
	}

	async _openChanged(newOpen) {
		let computedStyles;
		if (this._innerContainer) computedStyles = getComputedStyle(this._innerContainer);
		if (newOpen) {
			if (this._state === states.CLOSING) {
				this._state = states.OPENING;
			} else if (this._state === states.CLOSED) {
				if (!reduceMotion) {
					this._state = states.PREOPENING;
					// pause before running the opening animation because transitions won't run when changing from 'diplay: none' to 'display: block'
					this._preopenFrame = requestAnimationFrame(() => {
						this._preopenFrame = requestAnimationFrame(() => {
							this._state = states.OPENING;
						});
					});
				} else {
					this._state = states.OPEN;
				}
			}
			this.setAttribute('role', 'alert');
			await this.updateComplete;
			const height = this._innerContainer.offsetHeight;
			this.dispatchEvent(new CustomEvent(
				'd2l-alert-toast-open', {
					bubbles: true,
					composed: false,
					detail: { height }
				}
			));
		} else {
			let height = 0;
			let bottom = 0;
			if (this._innerContainer) {
				height = this._innerContainer.offsetHeight;
				bottom = parseFloat(computedStyles.getPropertyValue('bottom'));
			}
			if (reduceMotion || this._state === states.PREOPENING) {
				cancelAnimationFrame(this._preopenFrame);
				this.removeAttribute('role');
				this._state = states.CLOSED;
			} else if (this._state === states.OPENING || this._state === states.OPEN || this._state === states.SLIDING) {
				this._state = states.CLOSING;
			}
			this.dispatchEvent(new CustomEvent(
				'd2l-alert-toast-close', {
					bubbles: true,
					composed: false,
					detail: { bottom, height, click: this._closeClicked }
				}
			));
		}
	}

	_stateChanged(newState) {
		if (newState === states.OPEN) {
			this._closeTimerStart();
		} else {
			this._closeTimerStop();
		}
	}
}

customElements.define('d2l-alert-toast', AlertToast);
