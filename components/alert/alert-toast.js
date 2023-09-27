import './alert.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { styleMap } from 'lit/directives/style-map.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const states = {
	CLOSED: 'closed', // the toast is closed
	CLOSING: 'closing', // the close animation is running
	PREOPENING: 'preopening', // a pause before running the opening animation because transitions won't run when changing from 'diplay: none' to 'display: block'
	OPENING: 'opening', // the opening animation is running
	OPEN: 'open', // the toast is open
	SLIDING: 'sliding' // the transform animation when multiple alerts are on the page is running
};

const TOAST_SPACING = 0.6;
const TOAST_SPACING_SMALL = 0.3;

const mediaQueryList = window.matchMedia('(max-width: 615px)');

let ALERT_HAS_FOCUS = false; // if this alert or sibling alert is focused on
let ALERT_HAS_HOVER = false; // if this alert or sibling alert is hovered on

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
			_closeClicked: { state: true },
			_numAlertsBelow: { state: true },
			_smallWidth: { state: true },
			_state: { type: String },
			_totalSiblingHeightBelow: { state: true }
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
			.d2l-alert-toast-container.d2l-alert-toast-container-lowest[data-state="closing"] {
				transition-duration: 600ms;
				transition-property: opacity, transform;
				transition-timing-function: ease;
			}
			.d2l-alert-toast-container[data-state="closing"] {
				transition: opacity 200ms ease;
			}

			.d2l-alert-toast-container.d2l-alert-toast-container-close-clicked[data-state="closing"] {
				transition-duration: 200ms;
			}

			.d2l-alert-toast-container[data-state="preopening"],
			.d2l-alert-toast-container[data-state="closing"] {
				opacity: 0;
			}
			.d2l-alert-toast-container[data-state="preopening"],
			.d2l-alert-toast-container.d2l-alert-toast-container-lowest[data-state="closing"] {
				transform: translateY(calc(100% + 1.5rem));
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

		this._closeClicked = false;
		this._hasFocus = false;
		this._hasMouse = false;
		this._height = 0;
		this._numAlertsBelow = 0;
		this._smallWidth = false;
		this._state = states.CLOSED;
		this._totalSiblingHeightBelow = 0;

		this._closeTimerStop = this._closeTimerStop.bind(this);
		this._handlePageResize = this._handlePageResize.bind(this);
		this._handleSiblingCloseTimerStart = this._handleSiblingCloseTimerStart.bind(this);
		this._handleSiblingResize = this._handleSiblingResize.bind(this);
		this._resizeObserver = null;
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

	async connectedCallback() {
		super.connectedCallback();
		document.body.addEventListener('d2l-alert-toast-close', this._handleSiblingResize);
		document.body.addEventListener('d2l-alert-toast-resize', this._handleSiblingResize);
		document.body.addEventListener('d2l-alert-toast-timer-start', this._handleSiblingCloseTimerStart);
		document.body.addEventListener('d2l-alert-toast-timer-stop', this._closeTimerStop);
		if (mediaQueryList.addEventListener) mediaQueryList.addEventListener('change', this._handlePageResize);

		await this.updateComplete;
		this._resizeObserver = new ResizeObserver((e) => requestAnimationFrame(() => this._handleResize(e)));
		this._resizeObserver.observe(this._innerContainer);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		document.body.removeEventListener('d2l-alert-toast-close', this._handleSiblingResize);
		document.body.removeEventListener('d2l-alert-toast-resize', this._handleSiblingResize);
		document.body.removeEventListener('d2l-alert-toast-timer-start', this._handleSiblingCloseTimerStart);
		document.body.removeEventListener('d2l-alert-toast-timer-stop', this._closeTimerStop);
		if (this._resizeObserver) this._resizeObserver.disconnect();
		if (mediaQueryList.removeEventListener) mediaQueryList.removeEventListener('change', this._handlePageResize);

		if (this._hasMouse) ALERT_HAS_HOVER = false;
		if (this._hasFocus) ALERT_HAS_FOCUS = false;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this._innerContainer = this.shadowRoot.querySelector('.d2l-alert-toast-container');
		this._smallWidth = mediaQueryList.matches;
	}

	render() {
		const spaceBetweenAlerts = this._numAlertsBelow * (this._smallWidth ? TOAST_SPACING_SMALL : TOAST_SPACING);
		const containerStyles = {
			bottom: (this._totalSiblingHeightBelow || this._numAlertsBelow) ? `calc(${this._totalSiblingHeightBelow}px + ${spaceBetweenAlerts}rem)` : 0
		};
		const containerClasses = {
			'd2l-alert-toast-container': true,
			'd2l-alert-toast-container-close-clicked': this._closeClicked,
			'd2l-alert-toast-container-lowest': !this._totalSiblingHeightBelow,
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
		if (!this.noAutoClose && !ALERT_HAS_FOCUS && !ALERT_HAS_HOVER) {
			const duration = this.buttonText ? 10000 : 4000;
			this._setTimeoutId = setTimeout(() => {
				this.open = false;
			}, duration);
		}
	}

	_closeTimerStop() {
		if (!this.open) return;
		clearTimeout(this._setTimeoutId);
	}

	_handleButtonPress(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('d2l-alert-toast-button-press'));
	}

	_handlePageResize(e) {
		this._smallWidth = e.matches;
	}

	_handleResize() {
		const boundingClientRect = this._innerContainer.getBoundingClientRect();
		const newHeight = boundingClientRect.height;
		const oldHeight = this._height;
		this._height = newHeight;
		if (newHeight === oldHeight || newHeight === 0) return; // do not run if height has not changed or if closed

		const bottom = boundingClientRect.bottom;
		const opening = oldHeight === 0;

		/** @ignore */
		this.dispatchEvent(new CustomEvent(
			'd2l-alert-toast-resize', {
				bubbles: true,
				composed: false,
				detail: { bottom, heightDifference: (newHeight - oldHeight), opening, closing: false }
			}
		));
	}

	_handleSiblingCloseTimerStart() {
		if (!this.open) return;
		this._closeTimerStart();
	}

	_handleSiblingResize(e) {
		if (e?.target === this || !this.open) return;

		if (!e.detail.opening) {
			const containerBottom = this._innerContainer.getBoundingClientRect().bottom;
			const siblingContainerBottom = e.detail.bottom;
			if (siblingContainerBottom < containerBottom) return; // resized alert is above this alert, no need to adjust bottom spacing
		}

		this._totalSiblingHeightBelow += e.detail.heightDifference;
		if (e.detail.opening) {
			this._numAlertsBelow += 1;
			if (!reduceMotion) this._state = states.SLIDING;
		} else if (e.detail.closing) {
			this._numAlertsBelow -= 1;
			if (!reduceMotion) this._state = states.SLIDING;
		}
	}

	_onBlur() {
		ALERT_HAS_FOCUS = false;
		this._hasFocus = false;
		this._closeTimerStart();
		if (!ALERT_HAS_HOVER) {
			/** @ignore */
			this.dispatchEvent(new CustomEvent('d2l-alert-toast-timer-start', { bubbles: true, composed: false }));
		}
	}

	_onCloseClicked(e) {
		e.preventDefault();
		this._closeClicked = true;
		this.open = false;
	}

	_onFocus() {
		ALERT_HAS_FOCUS = true;
		this._hasFocus = true;
		this._closeTimerStop();
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-alert-toast-timer-stop', { bubbles: true, composed: false }));
	}

	_onMouseEnter() {
		ALERT_HAS_HOVER = true;
		this._hasMouse = true;
		this._closeTimerStop();
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-alert-toast-timer-stop', { bubbles: true, composed: false }));
	}

	_onMouseLeave() {
		ALERT_HAS_HOVER = false;
		this._hasMouse = false;
		this._closeTimerStart();
		if (!ALERT_HAS_FOCUS) {
			/** @ignore */
			this.dispatchEvent(new CustomEvent('d2l-alert-toast-timer-start', { bubbles: true, composed: false }));
		}
	}

	_onTransitionEnd() {
		if (this._state === states.OPENING || this._state === states.SLIDING) {
			this._state = states.OPEN;
		} else if (this._state === states.CLOSING) {
			this._state = states.CLOSED;
			this._totalSiblingHeightBelow = 0;
			this._closeClicked = false;
			this._numAlertsBelow = 0;
		}
	}

	_openChanged(newOpen) {
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
		} else {
			if (!this._innerContainer) return;

			if (reduceMotion || this._state === states.PREOPENING) {
				cancelAnimationFrame(this._preopenFrame);
				this.removeAttribute('role');
			} else if (this._state === states.OPENING || this._state === states.OPEN || this._state === states.SLIDING) {
				this._state = states.CLOSING;
			}

			if (this._hasMouse) ALERT_HAS_HOVER = false;
			if (this._hasFocus) ALERT_HAS_FOCUS = false;

			requestAnimationFrame(() => {
				const bottom = this._innerContainer.getBoundingClientRect().bottom;

				if (reduceMotion || this._state === states.PREOPENING) {
					this._state = states.CLOSED;
					this._totalSiblingHeightBelow = 0;
					this._numAlertsBelow = 0;
					this._closeClicked = false;
				}

				this.dispatchEvent(new CustomEvent(
					'd2l-alert-toast-close', {
						bubbles: true,
						composed: false,
						detail: { bottom, heightDifference: -this._height, opening: false, closing: true }
					}
				));
			});
		}
	}

	_stateChanged(newState, oldState) {
		const newlyOpened = (newState === states.OPEN && oldState === states.OPENING);
		const newlyOpenedReduceMotion = (newState === states.OPEN && oldState === states.CLOSED);
		if (newlyOpened || newlyOpenedReduceMotion) {
			this._closeTimerStart();
		} else if (newState !== states.SLIDING && newState !== states.OPEN) {
			this._closeTimerStop();
		}
	}
}

customElements.define('d2l-alert-toast', AlertToast);
