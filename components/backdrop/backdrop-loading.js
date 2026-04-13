import '../colors/colors.js';
import '../loading-spinner/loading-spinner.js';
import '../empty-state/empty-state-action-button.js';
import '../empty-state/empty-state-simple.js';
import '../offscreen/offscreen.js';
import { css, html, LitElement, nothing } from 'lit';
import { getComposedChildren, getComposedParent } from '../../helpers/dom.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { styleMap } from 'lit/directives/style-map.js';

const BACKDROP_DELAY_MS = 800;
const FADE_DURATION_MS = 500;
const SPINNER_DELAY_MS = FADE_DURATION_MS;
const LOADING_ANNOUNCEMENT_DELAY = 1000;

const LOADING_SPINNER_SIZE = 50;

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * A component for displaying a semi-transparent backdrop and a loading spinner over the containing element
 */
class LoadingBackdrop extends LocalizeCoreElement(LitElement) {

	static get properties() {
		return {
			/**
			 * Used to control whether the loading backdrop is shown
			 * @type {boolean}
			 */
			shown: { type: Boolean },
			/**
			 * Used to identify content that the backdrop should make inert
			 * @type {boolean}
			 */
			for: { type: String },
			_state: { type: String, reflect: true },
			_spinnerTop: { state: true },
			_ariaContent: { state: true }
		};
	}

	static get styles() {
		return css`
			#visible {
				display: none;
				height: 100%;
				justify-content: center;
				position: absolute;
				top: 0;
				width: 100%;
				z-index: 999;
			}
			:host([_state="showing"]) #visible,
			:host([_state="shown"]) #visible,
			:host([_state="hiding"]) #visible {
				display: flex;
			}

			.backdrop {
				background-color: var(--d2l-color-regolith);
				height: 100%;
				opacity: 0;
				position: absolute;
				top: 0;
				width: 100%;
			}
			:host([_state="shown"]) .backdrop {
				opacity: 0.7;
				transition: opacity ${FADE_DURATION_MS}ms ease-in;
			}
			:host([_state="hiding"]) .backdrop {
				transition: opacity ${FADE_DURATION_MS}ms ease-out;
			}

			d2l-loading-spinner {
				opacity: 0;
				position: absolute;
			}
			:host([_state="shown"]) d2l-loading-spinner {
				opacity: 1;
				transition: opacity ${FADE_DURATION_MS}ms ease-in ${SPINNER_DELAY_MS}ms;
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
		this._spinnerTop = 0;
		this._ariaContent = '';
	}

	render() {
		return html`
			${this._state === 'hidden' ? nothing :
					html`<div id="visible">
						<div class="backdrop" @transitionend="${this.#handleTransitionEnd}" @transitioncancel="${this.#handleTransitionEnd}"></div>
						<d2l-loading-spinner style=${styleMap({ top: `${this._spinnerTop}px` })} size="${LOADING_SPINNER_SIZE}"></d2l-loading-spinner>
					</div>`
			}
			<d2l-offscreen aria-live="polite">${this._ariaContent}</d2l-offscreen>
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
			this.#clearLiveArea();
			if (this.shown) {
				this.#setLiveArea(this.localize('components.backdrop-loading.loadingAnnouncement'), { delay: LOADING_ANNOUNCEMENT_DELAY });
				this.#show();
			} else if (changedProperties.get('shown') !== undefined) {
				this.#setLiveArea(this.localize('components.backdrop-loading.loadingCompleteAnnouncement'));
				this.#fade();
			}
		}
	}

	#centerLoadingSpinner() {
		if (this._state === 'hidden') { return; }

		const loadingSpinner = this.shadowRoot.querySelector('d2l-loading-spinner');
		if (!loadingSpinner) { return; }

		const boundingRect = this.shadowRoot.querySelector('#visible').getBoundingClientRect();

		// Calculate the centerpoint of the visible portion of the element
		const upperVisibleBound = Math.max(0, boundingRect.top);
		const lowerVisibleBound = Math.min(window.innerHeight, boundingRect.bottom);
		const visibleHeight = lowerVisibleBound - upperVisibleBound;
		const centeringOffset = (visibleHeight / 4);

		// Calculate if an offset is required to move to the top of the viewport before centering
		const topOffset = Math.max(0, -boundingRect.top); // measures the distance below the top of the viewport, which is negative if the element starts above the viewport

		// Adjust for the size of the spinner
		const spinnerSizeOffset = LOADING_SPINNER_SIZE / 2;

		this._spinnerTop = centeringOffset + topOffset - spinnerSizeOffset;
	}

	#clearLiveArea() {
		this._ariaContent = '';

		if (this.announcementTimeout) {
			clearTimeout(this.announcementTimeout);
		}

		this.announcementTimeout = null;
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
	#getBackdropTarget() {
		const parent = getComposedParent(this);

		if (!this.for) { return parent; }

		const targetedChildren = getComposedChildren(
			parent,
			(elem) => elem.id === this.for,
			false
		);

		return targetedChildren.length === 0 ? parent : targetedChildren[0];
	}
	#handleTransitionEnd() {
		if (this._state === 'hiding') {
			this.#hide();
		}
	}
	#hide() {
		this._state = 'hidden';

		const containingBlock = this.#getBackdropTarget();

		if (containingBlock.dataset.initiallyInert !== '1') containingBlock.removeAttribute('inert');
	}
	#setLiveArea(content, { delay } = {}) {
		this.announcementTimeout = setTimeout(() => this._ariaContent = content, delay || 0);
	}
	#show() {
		this._state = reduceMotion ? 'shown' : 'showing';

		const containingBlock = this.#getBackdropTarget();

		if (containingBlock.getAttribute('inert') !== null) containingBlock.dataset.initiallyInert = '1';

		containingBlock.setAttribute('inert', 'inert');
	}

}

customElements.define('d2l-backdrop-loading', LoadingBackdrop);
