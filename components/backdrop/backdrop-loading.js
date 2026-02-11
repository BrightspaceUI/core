import '../colors/colors.js';
import '../loading-spinner/loading-spinner.js';
import { css, html, LitElement } from 'lit';
import { getOffsetParent } from '../../helpers/dom.js';

const BACKDROP_DELAY_MS = 800;
const FADE_IN_DURATION_MS = 500;
const FADE_OUT_DURATION_MS = 500;
const SPINNER_DELAY_MS = BACKDROP_DELAY_MS + FADE_IN_DURATION_MS;

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
				height: 0%;
				position: absolute;
				width: 0%;
			}

			.backdrop, d2l-loading-spinner {
				opacity: 0;
			}

			:host {
				top: 0;
				z-index: 999;
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
				height: 100%;
				width: 100%;
			}

			d2l-loading-spinner[_state="showing"] {
				opacity: 1;
				transition: opacity ${FADE_IN_DURATION_MS}ms ease-in ${SPINNER_DELAY_MS}ms;
			}

			.backdrop[_state="showing"] {
				opacity: 0.7;
				transition: opacity ${FADE_IN_DURATION_MS}ms ease-in ${BACKDROP_DELAY_MS}ms;
			}

			d2l-loading-spinner[_state="hiding"],
			.backdrop[_state="hiding"] {
				transition: opacity ${FADE_OUT_DURATION_MS}ms ease-out;
			}

			@media (prefers-reduced-motion: reduce) {
				* { transition: none; }
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
			<div class="backdrop" _state=${this._state} @transitionend=${this.#handleTransitionEnd} @transitioncancel=${this.#hide}></div>
			<d2l-loading-spinner _state=${this._state}></d2l-loading-spinner>
		`;
	}

	willUpdate(changedProperties) {
		if (changedProperties.has('shown')) {
			if (this.shown) {
				this.#show();
			} else if (changedProperties.get('shown') !== undefined) {
				this.#fade();
			}
		}
	}

	#fade() {
		if (reduceMotion) {
			this.#hide();
		} else {
			this._state = 'hiding';
		}
	}

	#handleTransitionEnd() {
		if (this._state === 'hiding') {
			this.#hide();
		}
	}

	#hide() {
		this._state = null;

		const containingBlock = getOffsetParent(this);

		if (containingBlock.dataset.initiallyInert !== '1') containingBlock.removeAttribute('inert');
	}

	#show() {
		this._state = 'showing';

		const containingBlock = getOffsetParent(this);

		if (containingBlock.getAttribute('inert') !== null) containingBlock.dataset.initiallyInert = '1';

		containingBlock.setAttribute('inert', 'inert');
	}

}

customElements.define('d2l-backdrop-loading', LoadingBackdrop);
