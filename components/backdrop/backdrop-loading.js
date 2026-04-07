import '../colors/colors.js';
import '../loading-spinner/loading-spinner.js';
import '../empty-state/empty-state-action-button.js';
import '../empty-state/empty-state-simple.js';
import { css, html, LitElement, nothing } from 'lit';
import { getComposedChildren, getComposedParent } from '../../helpers/dom.js';
import { styleMap } from 'lit/directives/style-map.js';

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
			 * The state of data in the element being overlaid. Set to 'clean' when the data represents the user's latest selections, 'dirty' when the data does not represent the user's latest selections, and 'loading' if the data is being actively refreshed
			 * @type {'clean'|'dirty'|'loading'}
			 */
			dataState: {
				reflect: true,
				type: String
			},
			/**
			 * Used to identify content that the backdrop should make inert
			 * @type {boolean}
			 */
			for: { type: String },
			_state: { type: String, reflect: true },
			_spinnerTop: { state: true }
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
			:host([_state="loading"]),
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
			:host([_state="shown"]) .backdrop, :host([_state="loading"]) .backdrop {
				opacity: 0.7;
			}

			d2l-loading-spinner {
				opacity: 0;
				position: absolute;
				transition: opacity ${FADE_DURATION_MS}ms ease-in;
			}
			:host([_state="loading"]) d2l-loading-spinner {
				opacity: 1;
			}

			:host([_state="hiding"]) .d2l-backdrop,
			:host([_state="hiding"]) d2l-empty-state-simple,
			:host([_state="loading"]) d2l-empty-state-simple,
			:host([_state="hiding"]) d2l-loading-spinner {
				transition: opacity ${FADE_DURATION_MS}ms ease-out;
			}

			d2l-empty-state-simple {
				background-color: var(--d2l-table-controls-background-color, white);
				top: 0;
				opacity: 0;
				height: fit-content;
				justify-content: center;
				position: relative;
				z-index: 1000;
				transition: opacity ${FADE_DURATION_MS}ms ease-in;
			}

			:host([_state="shown"]) d2l-empty-state-simple {
				opacity: 1;
			}

			@media (prefers-reduced-motion: reduce) {
				* { transition: none; }
			}
		`;
	}

	constructor() {
		super();
		this.dataState = 'clean';
		this._state = 'hidden';
		this._spinnerTop = LOADING_SPINNER_MINIMUM_BUFFER;
		this._dirtyDialogTop = LOADING_SPINNER_MINIMUM_BUFFER;
	}

	render() {
		if (this._state === 'hidden') return nothing;
		return html`
			<div class="backdrop" @transitionend="${this.#handleTransitionEnd}" @transitioncancel="${this.#handleTransitionEnd}"></div>
			<d2l-loading-spinner style=${styleMap({ top: `${this._spinnerTop}px` })} size="${LOADING_SPINNER_SIZE}"></d2l-loading-spinner>
			<d2l-empty-state-simple style=${styleMap({ top: `${this._dirtyDialogTop}px` })} description="${this.localize('components.backdrop-loading.dirtyDialogDescription')}">
				<d2l-empty-state-action-button @d2l-empty-state-action=${this.#handleApplyButton} text="${this.localize('components.backdrop-loading.dirtyDialogAction')}"></d2l-empty-state-action-button>
			</div>
		`;
	}
	updated(changedProperties) {
		if (changedProperties.has('dataState') && (
			(reduceMotion && this._state === 'shown') || (!reduceMotion && this._state === 'showing') || (!reduceMotion && this._state === 'loading')
		)) {
			this.#centerLoadingSpinner();
		}

		if (changedProperties.has('_state')) {
			if (this._state === 'showing') {
				this._state = 'shown';
			}
		}

	}
	willUpdate(changedProperties) {
		if (changedProperties.has('dataState') && changedProperties.get('dataState') !== undefined) {
			if (changedProperties.get('dataState') === 'clean' && this.dataState !== 'clean') {
				this.#show();

			} else if (changedProperties.get('dataState') !== 'clean' && this.dataState === 'clean') {
				this.#fade();
			}

			if (this.dataState === 'loading') {
				this.#showLoadingSpinner();
			}
		}
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

		// Adjust for the size of the dirty dialog
		const dirtyDialogSizeOffset = this.shadowRoot.querySelector('d2l-empty-state-simple').getBoundingClientRect().height / 2;

		this._spinnerTop = Math.max(LOADING_SPINNER_MINIMUM_BUFFER, centeringOffset + topOffset - spinnerSizeOffset);
		this._dirtyDialogTop = Math.max(LOADING_SPINNER_MINIMUM_BUFFER, centeringOffset + topOffset - dirtyDialogSizeOffset);
	}

	#fade() {
		let hideImmediately = reduceMotion || this._state === 'showing';
		if (this._state === 'shown' || this._state === 'loading') {
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
	#handleApplyButton() {
		this.dispatchEvent(new CustomEvent('d2l-apply-button-click', { bubbles: true, composed: true }));
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
	#show() {
		this._state = reduceMotion ? 'shown' : 'showing';

		const containingBlock = this.#getBackdropTarget();

		if (containingBlock.getAttribute('inert') !== null) containingBlock.dataset.initiallyInert = '1';

		containingBlock.setAttribute('inert', 'inert');
	}
	#showLoadingSpinner() {
		this._state = 'loading';
	}

}

customElements.define('d2l-backdrop-loading', LoadingBackdrop);
