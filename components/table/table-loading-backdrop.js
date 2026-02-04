import '../colors/colors.js';
import { css, html, LitElement } from 'lit';

const BACKDROP_DELAY_MS = 800;
const BACKDROP_FADE_IN_DURATION_MS = 500;
const BACKDROP_FADE_OUT_DURATION_MS = 500;
const SPINNER_DELAY_MS = BACKDROP_DELAY_MS + BACKDROP_FADE_IN_DURATION_MS;
const SPINNER_FADE_IN_DURATION_MS = 500;
const SPINNER_FADE_OUT_DURATION_MS = 500;

/**
 * A component for displaying a semi-transparent backdrop and a loading spinner when a table enters a loading state.
 */
class TableLoadingBackdrop extends LitElement {

	static get properties() {
		return {
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
				z-index: 997
			}

			.backdrop {
				z-index: 998;
				background-color: var(--d2l-color-regolith);
			}

			d2l-loading-spinner {
				z-index: 999;
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
				transition: opacity ${SPINNER_FADE_IN_DURATION_MS}ms ease-in-out ${SPINNER_DELAY_MS}ms;
			}

			.backdrop[_state="showing"] {
				opacity: 0.7;
				transition: opacity ${BACKDROP_FADE_IN_DURATION_MS}ms ease-in-out ${BACKDROP_DELAY_MS}ms;
			}

			d2l-loading-spinner[_state="hiding"] {
				transition: opacity ${SPINNER_FADE_OUT_DURATION_MS}ms ease-in-out;
			}

			.backdrop[_state="hiding"] {
				transition: opacity ${BACKDROP_FADE_OUT_DURATION_MS}ms ease-in-out;
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
			<d2l-loading-spinner _state=${this._state} size="100"></d2l-loading-spinner>
			<div class="backdrop" _state=${this._state}></div>
		`;
	}

	willUpdate(changedProperties) {
		if (changedProperties.get('shown') !== undefined) {
			if (this.shown) {
				this._state = 'showing';
			} else {
				this._state = 'hiding';

				this._hideAfterFading();
			}
		}
	}

	_hideAfterFading() {
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
		]).then(() => {
			this._state = null;
		});
	}

}

customElements.define('d2l-table-loading-backdrop', TableLoadingBackdrop);
