import '../colors/colors.js';
import '../loading-spinner/loading-spinner.js';
import { css, html, LitElement, nothing } from 'lit';
import { getOffsetParent } from '../../helpers/dom.js';

const BACKDROP_DELAY_MS = 800;
const FADE_DURATION_MS = 500;
const SPINNER_DELAY_MS = FADE_DURATION_MS;

const LOADING_SPINNER_BUFFER = 300;

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
			:host {
				display: none;
				height: 100%;
				justify-content: center;
				position: absolute;
				top: 0;
				width: 100%;
				z-index: 999;
			}
			:host([_state="showing"]),
			:host([_state="shown"]),
			:host([_state="hiding"]) {
				display: flex;
			}

			.backdrop {
				background-color: var(--d2l-color-regolith);
				height: 100%;
				opacity: 0;
				position: absolute;
				top: 0;
				transition: opacity ${FADE_DURATION_MS}ms ease-in;
				width: 100%;
			}
			:host([_state="shown"]) .backdrop {
				opacity: 0.7;
			}

			d2l-loading-spinner {
				opacity: 0;
				position: absolute;
				top: ${LOADING_SPINNER_BUFFER}px;
				transition: opacity ${FADE_DURATION_MS}ms ease-in ${SPINNER_DELAY_MS}ms, top .2s ease-in;
				transition
			}
			:host([_state="shown"]) d2l-loading-spinner.fixed {
				position: fixed;
				top: 50% !important;
			}
			:host([_state="shown"]) d2l-loading-spinner {
				opacity: 1;
			}

			:host([_state="hiding"]) .d2l-backdrop,
			:host([_state="hiding"]) d2l-loading-spinner {
				transition: opacity ${FADE_DURATION_MS}ms ease-out;
			}

			@media (prefers-reduced-motion: reduce) {
				* { transition: none; }
			}
		`;
	}

	constructor() {
		super();
		this.shown = false;
		this._state = 'hidden';

	}

	firstUpdated() {
		document.addEventListener('scroll', this.#updateLoadingSpinnerPos.bind(this));
	}

	render() {
		if (this._state === 'hidden') return nothing;
		return html`
			<div class="backdrop" @transitionend="${this.#handleTransitionEnd}" @transitioncancel="${this.#hide}"></div>
			<d2l-loading-spinner></d2l-loading-spinner>
		`;
	}
	updated(changedProperties) {
		if (changedProperties.has('_state')) {
			if (this._state === 'showing') {
				setTimeout(() => this._state = 'shown', BACKDROP_DELAY_MS);
			}
		}

		if (this._state !== 'hidden') {
			this.#updateLoadingSpinnerPos();
		};
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
		this._state = 'hidden';

		const containingBlock = getOffsetParent(this);

		if (containingBlock.dataset.initiallyInert !== '1') containingBlock.removeAttribute('inert');
	}
	#show() {
		this._state = reduceMotion ? 'shown' : 'showing';

		const containingBlock = getOffsetParent(this);

		if (containingBlock.getAttribute('inert') !== null) containingBlock.dataset.initiallyInert = '1';

		containingBlock.setAttribute('inert', 'inert');
	}
	#updateLoadingSpinnerPos() {
		if (this._state === 'hidden') { return; }

		const loadingSpinner = this.shadowRoot.querySelector('d2l-loading-spinner');
		const boundingRect = this.getBoundingClientRect();
		const top = boundingRect.top;

		if (top > 0) {
			const innerHeight = window.innerHeight;
			const visibleHeight = innerHeight - boundingRect.top;
			const centerPoint = visibleHeight / 2;
			const minimumOffset = 100;
			const adjustedOffset = Math.max(minimumOffset, centerPoint);
			loadingSpinner.style.top = `${adjustedOffset}px`;
			loadingSpinner.classList.remove('fixed');
		} else {
			loadingSpinner.classList.add('fixed');
		}
	}

}

customElements.define('d2l-backdrop-loading', LoadingBackdrop);
