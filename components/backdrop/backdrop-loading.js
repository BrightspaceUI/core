import '../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { getOffsetParent } from '../../helpers/dom.js';

const BACKDROP_DELAY_MS = 800;
const BACKDROP_FADE_IN_DURATION_MS = 500;
const BACKDROP_FADE_OUT_DURATION_MS = 200;
const SPINNER_DELAY_MS = BACKDROP_DELAY_MS + BACKDROP_FADE_IN_DURATION_MS;
const SPINNER_FADE_IN_DURATION_MS = 500;
const SPINNER_FADE_OUT_DURATION_MS = 200;

/**
 * A component for displaying a semi-transparent backdrop and a loading spinner over the containing element
 */
class LoadingBackdrop extends LitElement {

	static get properties() {
		return {
			/**
			 * Used to control whether the loading backdrop is shown
			 * @type {boolean}
			 */
			shown: { type: Boolean },
			_state: { type: String, reflect: true },
		};
	}

	static get styles() {
		return css`
			:host, .backdrop, d2l-loading-spinner {
				width: 0%;
				height: 0%;
				position: absolute;
			}

			.backdrop, d2l-loading-spinner {
				opacity: 0;
			}

			:host {
				z-index: 999;
				top: 0px;
			}

			.backdrop {
				background-color: var(--d2l-color-regolith);
			}

			d2l-loading-spinner {
				top: 100px;
			}

			:host([_state="showing"]),
			:host([_state="hiding"]),
			d2l-loading-spinner[_state="showing"],
			d2l-loading-spinner[_state="hiding"],
			.backdrop[_state="showing"],
			.backdrop[_state="hiding"] {
				width: 100%;
				height: 100%;
			}

			d2l-loading-spinner[_state="showing"] {
				opacity: 1;
				transition: opacity ${SPINNER_FADE_IN_DURATION_MS}ms ease-in ${SPINNER_DELAY_MS}ms;
			}

			.backdrop[_state="showing"] {
				opacity: 0.7;
				transition: opacity ${BACKDROP_FADE_IN_DURATION_MS}ms ease-in ${BACKDROP_DELAY_MS}ms;
			}

			d2l-loading-spinner[_state="hiding"] {
				transition: opacity ${SPINNER_FADE_OUT_DURATION_MS}ms ease-out;
			}

			.backdrop[_state="hiding"] {
				transition: opacity ${BACKDROP_FADE_OUT_DURATION_MS}ms ease-out;
			}

			@media (prefers-reduced-motion: reduce) {
				* { transition: none}
			}
		`;
	}

	constructor() {
		super();
		this.shown = false;
		this._state = null;
	}

	render() {
		return html`
			<div class="backdrop" _state=${this._state}></div>
			<d2l-loading-spinner _state=${this._state}></d2l-loading-spinner>
		`;
	}

	willUpdate(changedProperties) {
		if (changedProperties.has('shown')) {
			if (this.shown) {
				this._show();
			} else if (changedProperties.get('shown') !== undefined) {
				this._fadeThenHide();
			}
		}
	}

	_fadeThenHide() {
		this._state = 'hiding';

		const backdrop = this.shadowRoot.querySelector('.backdrop');
		const loadingSpinner = this.shadowRoot.querySelector('d2l-loading-spinner');

		Promise.all([
			new Promise(resolve => {
				backdrop.addEventListener('transitionend', resolve, { once: true });
				backdrop.addEventListener('transitioncancel', resolve, { once: true });
			}),
			new Promise(resolve => {
				loadingSpinner.addEventListener('transitionend', resolve, { once: true });
				loadingSpinner.addEventListener('transitioncancel', resolve, { once: true });
			})
		]).then(() => { this._hide(); });
	}

	_hide() {
		this._state = null;

		const containingBlock = getOffsetParent(this);

		containingBlock.setAttribute('aria-busy', 'false');

		if (!this._initiallyIntert) containingBlock.removeAttribute('inert');
	}

	_show() {
		this._state = 'showing';

		const containingBlock = getOffsetParent(this);

		containingBlock.setAttribute('aria-busy', 'true');

		this._initiallyIntert = containingBlock.getAttribute('inert') !== null;
		if (!this._initiallyIntert) containingBlock.setAttribute('inert', '');
	}

}

customElements.define('d2l-backdrop-loading', LoadingBackdrop);
