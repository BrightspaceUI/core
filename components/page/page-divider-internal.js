import '../colors/colors.js';
import '../icons/icon-custom.js';
import { css, html, LitElement } from 'lit';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { formatPercent } from '@brightspace-ui/intl';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

export const DIVIDER_WIDTH = 4;
export const DIVIDER_HANDLE_SIZE = 30;
export const KEYBOARD_STEP = 20; // TO DO: Confirm
export const KEYBOARD_STEP_LARGE = 80; // TO DO: Confirm

const clampedSize = (size, min, max) => Math.max(min, Math.min(size, max));

const ICON_ARROW_COLLAPSE_LEFT = html`
	<svg width="18" height="18" mirror-in-rtl xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
		<path fill="#494c4e" d="M11.71 13.708c.186-.189.29-.443.29-.708V5.005a1 1 0 0 0-1.71-.705l-4 4a1.013 1.013 0 0 0 0 1.42l4 4a1.01 1.01 0 0 0 1.42-.013"/>
	</svg>
`;
const ICON_ARROW_EXPAND_RIGHT = html`
	<svg width="18" height="18" mirror-in-rtl xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
		<path fill="#494c4e" d="M6 12.96v-8c0-.4.2-.8.6-.9s.8-.1 1.1.2l4 4c.4.4.4 1 0 1.4l-4 4c-.3.3-.7.4-1.1.2-.4-.1-.6-.5-.6-.9m2-5.6v3.2l1.6-1.6z"/>
	</svg>
`;
const ICON_ARROW_COLLAPSE_RIGHT = html`
	<svg width="18" height="18" mirror-in-rtl xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
		<path fill="#494c4e" d="m7.712 13.698 4-4a1.01 1.01 0 0 0 0-1.418l-4-4a1 1 0 0 0-1.71.725v7.993a1 1 0 0 0 1.71.7"/>
	</svg>
`;
const ICON_ARROW_EXPAND_LEFT = html`
	<svg width="18" height="18" mirror-in-rtl xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
		<path fill="#494c4e" d="M12 5.04v8c0 .4-.2.8-.6.9s-.8.1-1.1-.2l-4-4c-.4-.4-.4-1 0-1.4l4-4c.3-.3.7-.4 1.1-.2.4.1.6.5.6.9m-2 5.6v-3.2l-1.6 1.6z"/>
	</svg>
`;
const ICON_ARROW_COLLAPSE_DOWN = html`
	<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
		<path fill="#494c4e" d="M13.708 6.29A1 1 0 0 0 13 6H5.005A1 1 0 0 0 4.3 7.71l4 4a1.013 1.013 0 0 0 1.42 0l4-4a1.01 1.01 0 0 0-.013-1.42"/>
	</svg>
`;

const ICON_ARROW_EXPAND_UP = html`
	<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
		<path fill="#494c4e" d="M12.96 12h-8c-.4 0-.8-.2-.9-.6s-.1-.8.2-1.1l4-4c.4-.4 1-.4 1.4 0l4 4c.3.3.4.7.2 1.1-.1.4-.5.6-.9.6m-5.6-2h3.2l-1.6-1.6z"/>
	</svg>
`;

/**
 * Internal divider used by d2l-page to resize its side-nav and supporting panels.
 */
class PageDivider extends FocusMixin(PropertyRequiredMixin(LitElement)) {

	static properties = {
		/**
		 * Whether the panel/drawer the divider controls is collapsed
		 * @type {boolean}
		 */
		collapsed: { type: Boolean, reflect: true },
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
			display: inline-block;
			flex: none;
		}
		.divider {
			background-color: var(--d2l-color-mica);
			cursor: ew-resize;
			height: 100%;
			position: relative;
			width: ${DIVIDER_WIDTH}px;
		}
		.divider:hover {
			background-color: var(--d2l-color-corundum);
		}
		.divider:focus-within {
			background-color: var(--d2l-color-celestine);
		}

		.slider {
			inset-inline-start: -${DIVIDER_HANDLE_SIZE / 2 - DIVIDER_WIDTH / 2}px;
			outline: none;
			position: absolute;
			top: 55px;
		}

		.divider-handle {
			align-items: center;
			background-color: white;
			border: 1px solid var(--d2l-color-mica);
			border-radius: 50%;
			box-sizing: border-box;
			cursor: pointer;
			display: flex;
			height: ${DIVIDER_HANDLE_SIZE}px;
			justify-content: center;
			width: ${DIVIDER_HANDLE_SIZE}px;
		}
		.divider-handle:hover {
			background-color: var(--d2l-color-sylvite);
			border-color: var(--d2l-color-celestine);
		}
		.slider:focus .divider-handle {
			background-color: var(--d2l-color-celestine);
			border-color: var(--d2l-color-celestine);
		}
		.slider:focus .divider-handle .handle-icon {
			color: white;
		}

		:host([panel-type="drawer"]) .divider {
			background-color: var(--d2l-color-celestine);
			cursor: ns-resize;
			height: ${DIVIDER_WIDTH}px;
			width: 100%;
		}

		:host([panel-type="drawer"]) .slider {
			inset-inline-end: 18px;
			top: auto;
		}

		/* TO DO: Lots more divider styling to come */

	`;

	static focusElementSelector = '.slider';

	constructor() {
		super();

		this.collapsed = false;
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
					<div class="divider-handle">
						<d2l-icon-custom class="handle-icon" size="tier1">
							${this.#getHandleIcon()}
						</d2l-icon-custom>
					</div>
				</div>
			</div>
		`;
	}

	#getHandleIcon() {
		if (this.panelType === 'panel') {
			if (this.panelPosition === 'start') {
				return this.collapsed ? ICON_ARROW_EXPAND_RIGHT : ICON_ARROW_COLLAPSE_LEFT;
			} else {
				return this.collapsed ? ICON_ARROW_EXPAND_LEFT : ICON_ARROW_COLLAPSE_RIGHT;
			}
		} else if (this.panelType === 'drawer') {
			return this.collapsed ? ICON_ARROW_EXPAND_UP : ICON_ARROW_COLLAPSE_DOWN;
		}
	}

	#handleKeyDown(e) {
		if (!['Enter', ' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) return;
		e.preventDefault();

		if (e.key === 'Enter' || e.key === ' ') {
			this.#sendToggleEvent();
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
		if (e.button !== 0) return; // Don't collapse when right-clicking to debug
		e.preventDefault();
		this.focus();

		const handle = this.shadowRoot.querySelector('.divider-handle');
		const clickedHandle = handle && handle.contains(e.target);

		// TO DO: Will move to PointerUp once we add dragging ability
		if (this.collapsed || clickedHandle) {
			this.#sendToggleEvent();
		}
	}

	#sendResizeEvent(requestedSize) {
		const clampedRequestedSize = clampedSize(requestedSize, this.minSize, this.maxSize);
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-page-divider-resize', { detail: {
			requestedSize: clampedRequestedSize
		} }));
	}

	#sendToggleEvent() {
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-page-divider-toggle'));
	}

}

customElements.define('d2l-page-divider-internal', PageDivider);
