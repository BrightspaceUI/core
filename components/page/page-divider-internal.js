import '../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { formatPercent } from '@brightspace-ui/intl';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

export const DIVIDER_WIDTH = 4;
export const KEYBOARD_STEP = 20; // TO DO: Confirm
export const KEYBOARD_STEP_LARGE = 80; // TO DO: Confirm

const clampedSize = (size, min, max) => Math.max(min, Math.min(size, max));

/**
 * Internal divider used by d2l-page to resize its side-nav and supporting panels.
 */
class PageDivider extends FocusMixin(PropertyRequiredMixin(LitElement)) {

	static properties = {
		/**
		 * Current size of the panel/drawer the divider controls
		 * @type {number}
		 */
		currentSize: { type: Number, attribute: 'current-size' },
		/**
		 * REQUIRED: label for the divider
		 * @type {string}
		 */
		label: { type: String, required: true },
		/**
		 * Maximum size of the panel/drawer the divider controls
		 * @type {number}
		 */
		maxSize: { type: Number, attribute: 'max-size' },
		/**
		 * Minimum size of the panel/drawer the divider controls
		 * @type {number}
		 */
		minSize: { type: Number, attribute: 'min-size' },
		/**
		 * Inline position of the panel the divider controls
		 * @type {'start'|'end'}
		 */
		panelPosition: { type: String, attribute: 'panel-position' },
		/**
		 * Whether the divider is controlling a left/right panel or a bottom drawer
		 * @type {'panel'|'drawer'}
		 */
		panelType: { type: String, attribute: 'panel-type' }
	};

	static styles = css`
		:host {
			flex: none;
		}
		.divider {
			background-color: var(--d2l-color-gypsum);
			cursor: ew-resize;
			height: 100%;
			position: relative;
			width: ${DIVIDER_WIDTH}px;
		}
		.divider:hover {
			background-color: var(--d2l-color-mica);
		}
		.divider:focus-within {
			background-color: var(--d2l-color-celestine);
		}

		.slider {
            outline: none;
            position: absolute;
            top: 55px;
        }

		:host([panel-type="drawer"]) .divider {
			background-color: var(--d2l-color-celestine);
			cursor: ns-resize;
			height: ${DIVIDER_WIDTH}px;
			width: 100%;
		}

		:host([panel-type="drawer"]) .slider {
            right: 18px;
            top: auto;
        }

		/* TO DO: Lots more divider styling to come */

	`;

	static focusElementSelector = '.slider';

	constructor() {
		super();

		this.currentSize = 0;
		this.label = '';
		this.maxSize = 0;
		this.minSize = 0;
		this.panelPosition = 'start';
		this.panelType = 'panel';
	}

	render() {
		let ariaValues = {};
		if (this.maxSize > 0) {
			ariaValues = { max: this.maxSize, min: 0, now: this.currentSize, text: formatPercent(this.currentSize / this.maxSize, { maximumFractionDigits: 0 }) };
		}

		return html`
		    <div class="divider" @pointerdown="${this.#handlePointerDown}">
				<div
					class="slider"
					role="slider"
					tabindex="0"
					aria-label="${this.label}"
					aria-orientation="${this.panelType === 'panel' ? 'horizontal' : 'vertical'}"
					aria-valuemax="${ifDefined(ariaValues.max)}"
					aria-valuemin="${ifDefined(ariaValues.min)}"
					aria-valuenow="${ifDefined(ariaValues.now)}"
					aria-valuetext="${ifDefined(ariaValues.text)}"
					@keydown="${this.#handleKeyDown}">
				</div>
			</div>
		`;
	}

	#handleKeyDown(e) {
		if (!['Enter', ' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) return;
		e.preventDefault();

		if (e.key === 'Enter' || e.key === ' ') {
			/** @ignore */
			this.dispatchEvent(new CustomEvent('d2l-page-divider-toggle'));
			return;
		}

		if (e.key === 'Home' || e.key === 'End') {
			this.#sendResizeEvent(e.key === 'Home' ? this.minSize : this.maxSize);
			return;
		}

		if (e.key === 'PageUp' || e.key === 'PageDown') {
			this.#sendResizeEvent(this.currentSize + (e.key === 'PageUp' ? 1 : -1) * KEYBOARD_STEP_LARGE);
			return;
		}

		let positiveStepKey;
		if (this.panelType === 'panel') {
			if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
			const isRtl = (document.documentElement.getAttribute('dir') === 'rtl');
			positiveStepKey = (this.panelPosition === 'start') !== isRtl ? 'ArrowRight' : 'ArrowLeft';
		} else if (this.panelType === 'drawer') {
			if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
			positiveStepKey = 'ArrowUp';
		}

		const step = (e.key === positiveStepKey ? 1 : -1) * KEYBOARD_STEP;
		const requestedSize = this.currentSize + step;
		this.#sendResizeEvent(requestedSize);
	}

	#handlePointerDown(e) {
		e.preventDefault();
		this.focus();
	}

	#sendResizeEvent(requestedSize) {
		const clampedRequestedSize = clampedSize(requestedSize, this.minSize, this.maxSize);
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-page-divider-resize', { detail: {
			requestedSize: clampedRequestedSize
		} }));
	}

}

customElements.define('d2l-page-divider-internal', PageDivider);
