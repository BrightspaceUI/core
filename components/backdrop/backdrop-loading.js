import '../colors/colors.js';
import '../loading-spinner/loading-spinner.js';
import './backdrop-dirty-overlay.js';
import { css, html, LitElement, nothing } from 'lit';
import { getComposedChildren, getComposedParent } from '../../helpers/dom.js';
import { DataStateMixin } from '../../mixins/data-state/data-state-mixin.js';
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
class LoadingBackdrop extends DataStateMixin(LocalizeCoreElement(LitElement)) {

	static properties = {
		/**
		 * Used to identify content that the backdrop should make inert
		 * @type {string}
		 */
		for: { type: String, required: true },
		_ariaContent: { state: true },
		_dirtyOverlayTop: { state: true },
		_loadingSpinnerTop: { state: true },
		_state: { type: String, reflect: true }
	};

	static styles = [css`
		.backdrop-container {
			display: none;
		}

		:host([_state="showing"]),
		:host([_state="shown"]),
		:host([_state="hiding"]),
		:host([_state="showing"]) .backdrop-container,
		:host([_state="shown"]) .backdrop-container,
		:host([_state="hiding"]) .backdrop-container {
			display: flex;
			inset: 0;
			justify-content: center;
			position: absolute;
			z-index: 999;
		}

		.backdrop {
			background-color: var(--d2l-theme-backdrop-background-color);
			inset: 0;
			opacity: 0;
			position: absolute;
		}
		:host([_state="shown"]) .backdrop {
			opacity: var(--d2l-theme-backdrop-opacity);
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
		:host([_state="shown"][data-state="dirty"]) d2l-loading-spinner,
		:host([_state="hiding"]) d2l-loading-spinner {
			opacity: 0;
			transition: opacity ${FADE_DURATION_MS}ms ease-out;
		}

		d2l-backdrop-dirty-overlay {
			background-color: var(--d2l-theme-backdrop-dialog-color);
			height: fit-content;
			justify-content: center;
			opacity: 0;
			position: relative;
			top: 0;
			z-index: 1000;
		}
		:host([_state="shown"]) d2l-backdrop-dirty-overlay {
			opacity: 1;
			transition: opacity ${FADE_DURATION_MS}ms ease-in;
		}
		:host([_state="shown"][data-state="loading"]) d2l-backdrop-dirty-overlay,
		:host([_state="hiding"]) d2l-backdrop-dirty-overlay {
			opacity: 0;
			transition: opacity ${FADE_DURATION_MS}ms ease-out;
		}

		@media (prefers-reduced-motion: reduce) {
			* { transition: none; }
		}
	`];

	constructor() {
		super();
		this._ariaContent = '';
		this._dirtyOverlayTop = 0;
		this._loadingSpinnerTop = 0;
		this._state = 'hidden';
	}

	render() {
		const backdropVisible = this._state !== 'hidden';

		return html`
			${backdropVisible ?
					html`<div class="backdrop-container">
						<div class="backdrop" @transitionend="${this.#handleTransitionEnd}" @transitioncancel="${this.#handleTransitionEnd}"></div>
						<d2l-loading-spinner style=${styleMap({ top: `${this._loadingSpinnerTop}px` })} size="${LOADING_SPINNER_SIZE}"></d2l-loading-spinner>
					</div>` : nothing
			}
			<div aria-live="polite" class="backdrop-dirty-container">
				${backdropVisible ?
					html`<d2l-backdrop-dirty-overlay
						style=${styleMap({ top: `${this._dirtyOverlayTop}px` })}
						description="${this.dirtyText}"
						action="${this.dirtyButtonText}"
						?inert=${this.dataState !== 'dirty'}
					></d2l-backdrop-dirty-overlay>` : nothing }
				<d2l-offscreen>
					${this._ariaContent}
				</d2l-offscreen>
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.get('_state') && changedProperties.get('_state') === 'hidden')
		{
			this.#centerLoadingSpinnerAndDialog();
		}

		if (changedProperties.has('_state')) {
			if (this._state === 'showing') {
				if (this.dataState === 'loading') {
					setTimeout(() => {
						if (this._state === 'showing') this._state = 'shown';
					}, BACKDROP_DELAY_MS);
				} else {
					this._state = 'shown';
				}
			}
		}
	}

	willUpdate(changedProperties) {
		super.willUpdate(changedProperties);
		if (changedProperties.has('dataState') && changedProperties.get('dataState') !== undefined) {
			this.#clearLiveArea();

			const oldState = changedProperties.get('dataState');
			const newState = this.dataState;

			// Calculate announcements
			if (newState === 'loading') {
				this.#setLiveArea(this.localize('components.backdrop-loading.loadingAnnouncement'), { delay: LOADING_ANNOUNCEMENT_DELAY });
			} else if (oldState === 'loading' && newState === 'clean') {
				this.#setLiveArea(this.localize('components.backdrop-loading.loadingCompleteAnnouncement'));
			}

			// Update backdrop
			if (oldState === 'clean') {
				this.#show();
			} else if (newState === 'clean') {
				this.#fade();
			} else if (oldState === 'loading' && newState === 'dirty') {
				setTimeout(() => {
					if (this._state === 'showing') this._state = 'shown';
				}, BACKDROP_DELAY_MS);
			}
		}
	}

	async #centerLoadingSpinnerAndDialog() {
		if (this._state === 'hidden') { return; }

		const loadingSpinner = this.shadowRoot.querySelector('d2l-loading-spinner');
		if (!loadingSpinner) { return; }

		const boundingRect = this.shadowRoot.querySelector('.backdrop-container').getBoundingClientRect();

		// Calculate the centerpoint of the visible portion of the element
		const upperVisibleBound = Math.max(0, boundingRect.top);
		const lowerVisibleBound = Math.min(window.innerHeight, boundingRect.bottom);
		const visibleHeight = lowerVisibleBound - upperVisibleBound;
		const centeringOffset = (visibleHeight / 4);

		// Calculate if an offset is required to move to the top of the viewport before centering
		const topOffset = Math.max(0, -boundingRect.top); // measures the distance below the top of the viewport, which is negative if the element starts above the viewport

		// Adjust for the size of the spinner
		const spinnerSizeOffset = LOADING_SPINNER_SIZE / 2;

		this._loadingSpinnerTop = centeringOffset + topOffset - spinnerSizeOffset;

		// Adjust for the size of the dirty dialog
		const dirtyOverlay = this.shadowRoot.querySelector('d2l-backdrop-dirty-overlay');
		if (dirtyOverlay) {
			await this.shadowRoot.querySelector('d2l-empty-state-action-button')?.getUpdateComplete();
			const dirtyDialogSizeOffset = dirtyOverlay.getBoundingClientRect().height / 2;

			this._dirtyOverlayTop = centeringOffset + topOffset - dirtyDialogSizeOffset;
		}
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
			const currentOpacity = getComputedStyle(this.shadowRoot.querySelector('.backdrop-dirty-container')).opacity;
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

		const targetedChildren = getComposedChildren(
			parent,
			(elem) => elem.id === this.for,
			false
		);

		if (targetedChildren.length === 0) { throw new Error(`Backdrop cannot find sibling identified by 'for' property with value ${this.for}`);}

		return targetedChildren[0];
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
