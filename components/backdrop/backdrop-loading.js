import '../colors/colors.js';
import '../loading-spinner/loading-spinner.js';
import { css, html, LitElement, nothing } from 'lit';
import { getOffsetParent } from '../../helpers/dom.js';
import { styleMap } from 'lit/directives/style-map.js';

const BACKDROP_DELAY_MS = 800;
const FADE_DURATION_MS = 500;
const SPINNER_DELAY_MS = FADE_DURATION_MS;

const LOADING_SPINNER_MINIMUM_BUFFER = 100;

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
			_spinnerTop: { type: Number, reflect: true }
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
				transition: opacity ${FADE_DURATION_MS}ms ease-in ${SPINNER_DELAY_MS}ms;
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
		this._spinnerTop = LOADING_SPINNER_MINIMUM_BUFFER;
	}

	render() {
		if (this._state === 'hidden') return nothing;
		return html`
			<div class="backdrop" @transitionend="${this.#handleTransitionEnd}" @transitioncancel="${this.#hide}"></div>
			<d2l-loading-spinner style=${styleMap({ top: `${this._spinnerTop}px` })}></d2l-loading-spinner>
		`;
	}
	updated(changedProperties) {
		if (changedProperties.has('_state')) {
			if (this._state === 'showing') {
				setTimeout(() => {
					if (this._state === 'showing') this._state = 'shown';
				}, BACKDROP_DELAY_MS);
			}
		}

		if (this.#mustRepositionSpinner) {
			this.#centerLoadingSpinner();
			this.#mustRepositionSpinner = false;
		}
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
	#mustRepositionSpinner;

	#centerLoadingSpinner() {
		if (this._state === 'hidden') { return; }

		const loadingSpinner = this.shadowRoot.querySelector('d2l-loading-spinner');
		if (!loadingSpinner) { return; }

		const boundingRect = this.getBoundingClientRect();

		// Calculate the centerpoint of the visible portion of the element
		const upperVisibleBound = Math.max(0, boundingRect.top);
		const lowerVisibleBound = Math.min(window.innerHeight, boundingRect.bottom);
		const visibleHeight = lowerVisibleBound - upperVisibleBound;
		const centeringOffset = visibleHeight / 2;

		// Calculate if an offset is required to move to the top of the viewport before centering
		const topOffset = Math.max(0, -boundingRect.top); // measures the distance below the top of the viewport, which is negative if the element starts above the viewport
		const newPosition = centeringOffset + topOffset;

		this._spinnerTop = Math.max(LOADING_SPINNER_MINIMUM_BUFFER, newPosition);
	}

	#fade() {
		if (reduceMotion || this._state === 'showing') {
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
		this.#mustRepositionSpinner = true;

		this._state = reduceMotion ? 'shown' : 'showing';

		const containingBlock = getOffsetParent(this);

		if (containingBlock.getAttribute('inert') !== null) containingBlock.dataset.initiallyInert = '1';

		containingBlock.setAttribute('inert', 'inert');
	}

}

customElements.define('d2l-backdrop-loading', LoadingBackdrop);
