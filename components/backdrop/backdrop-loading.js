import '../colors/colors.js';
import '../loading-spinner/loading-spinner.js';
import '../button/button.js';
import '../empty-state/empty-state-action-button.js';
import '../empty-state/empty-state-simple.js';
import { css, html, LitElement, nothing } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

const BACKDROP_DELAY_MS = 800;
const FADE_DURATION_MS = 500;

const LOADING_SPINNER_MINIMUM_BUFFER = 100;
const LOADING_SPINNER_SIZE = 50;

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
			loading: { type: Boolean },
			_state: { type: String, reflect: true },
			_spinnerTop: { state: true },
			onRefresh: { attribute: false }
		};
	}

	static get styles() {
		return css`
			#backdrop-styling-wrapper {
				display: none;
				height: 100%;
				justify-content: center;
				position: absolute;
				top: 0;
				width: 100%;
				z-index: 999;
			}

			#dirty-overlay {
				top: 0;
				opacity: 0;
				width: 100%;
				height: 100%;
				justify-content: center;
				display: none;
				position: absolute;
				z-index: 1000;
				transition: opacity ${FADE_DURATION_MS}ms ease-in;
			}

			d2l-empty-state-simple {
				position: relative;
				height: fit-content;
				background-color: var(--d2l-table-controls-background-color, white);
			}

			:host([_state="showing"]) #backdrop-styling-wrapper,
			:host([_state="shown"]) #backdrop-styling-wrapper,
			:host([_state="hiding"]) #backdrop-styling-wrapper,
			:host([_state="showing"]) #dirty-overlay,
			:host([_state="shown"]) #dirty-overlay,
			:host([_state="hiding"]) #dirty-overlay {
				display: flex;
			}

			:host([_state="shown"]) #dirty-overlay {
				opacity: 1;
			}
			:host([_state="hiding"]) #dirty-overlay {
				opacity: 0;
				transition: opacity ${FADE_DURATION_MS}ms ease-out;
			}
			:host([loading]) #dirty-overlay {
				opacity: 0;
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
				transition: opacity ${FADE_DURATION_MS}ms ease-in;
			}
			:host([_state="shown"][loading]) d2l-loading-spinner {
				opacity: 1;
			}

			:host([_state="hiding"]) .backdrop,
			:host([_state="hiding"]) d2l-loading-spinner {
				transition: opacity ${FADE_DURATION_MS}ms ease-out;
			}

			@media (prefers-reduced-motion: reduce) {
				* { transition: none; }
			}

			#overlay-layer, #backdrop-inert-wrapper {
				position: relative;
			}

		`;
	}

	constructor() {
		super();
		this.shown = false;
		this.loading = false;
		this._state = 'hidden';
		this._spinnerTop = LOADING_SPINNER_MINIMUM_BUFFER;
	}

	render() {
		return html`
			<div id="overlay-layer">
				<div id="backdrop-inert-wrapper">
					${this.renderBackdrop()}
					<slot></slot>
				</div>
				${this.renderDirtyDialog()}
			<div>
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

		if (changedProperties.has('shown') && (
			(reduceMotion && this._state === 'shown') || (!reduceMotion && this._state === 'showing')
		)) {
			this.#centerLoadingSpinner();
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

	renderBackdrop() {
		if (this._state === 'hidden') return nothing;

		return html`
			<div id="backdrop-styling-wrapper">
				<div class="backdrop" @transitionend="${this.#handleTransitionEnd}" @transitioncancel="${this.#hide}"></div>
				<d2l-loading-spinner style=${styleMap({ top: `${this._spinnerTop}px` })} size="${LOADING_SPINNER_SIZE}"></d2l-loading-spinner>
			</div>
		`;
	}

	renderDirtyDialog() {
		if (this._state === 'hidden') return nothing;

		return html`
			<div id="dirty-overlay">
				<d2l-empty-state-simple style=${styleMap({ top: `${this._spinnerTop - 10}px` })} description="Filters have been changed.">
					<d2l-empty-state-action-button @d2l-empty-state-action=${this.#handleApplyButton} text="Apply Filters"></d2l-empty-state-action-button>
				</div>
			</div>
		`;
	}

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

		// Adjust for the size of the spinner
		const spinnerSizeOffset = LOADING_SPINNER_SIZE / 2;

		const newPosition = centeringOffset + topOffset - spinnerSizeOffset;
		this._spinnerTop = Math.max(LOADING_SPINNER_MINIMUM_BUFFER, newPosition);
	}
	#fade() {
		let hideImmediately = reduceMotion || this._state === 'showing';
		if (this._state === 'shown') {
			const currentOpacity = getComputedStyle(this.shadowRoot.querySelector('.backdrop')).opacity;
			hideImmediately ||= (currentOpacity === '0');
		}

		if (hideImmediately) {
			this.#hide();
		} else {
			this._state = 'hiding';
		}
	}

	#handleApplyButton() {
		this.dispatchEvent(new CustomEvent('d2l-dirty-refresh-click'));
	}

	#handleTransitionEnd() {
		if (this._state === 'hiding') {
			this.#hide();
		}
	}

	#hide() {
		this._state = 'hidden';

		const containingBlock = this.shadowRoot.querySelector('#backdrop-inert-wrapper');

		if (containingBlock.dataset.initiallyInert !== '1') containingBlock.removeAttribute('inert');
	}

	#show() {
		this._state = reduceMotion ? 'shown' : 'showing';

		const containingBlock = this.shadowRoot.querySelector('#backdrop-inert-wrapper');

		if (containingBlock.getAttribute('inert') !== null) containingBlock.dataset.initiallyInert = '1';

		containingBlock.setAttribute('inert', 'inert');
	}

}

customElements.define('d2l-backdrop-loading', LoadingBackdrop);
