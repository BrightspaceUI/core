import '../colors/colors.js';
import '../icons/icon-custom.js';
import { css, html, LitElement, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { formatPercent } from '@brightspace-ui/intl';
import { ifDefined } from 'lit/directives/if-defined.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';

export const DIVIDER_WIDTH = 4;
export const DIVIDER_HANDLE_SIZE = 30;
export const KEYBOARD_STEP = 20; // TO DO: Confirm
export const KEYBOARD_STEP_LARGE = 80; // TO DO: Confirm

const DRAG_THRESHOLD = 3; // Number of pixels to move to count as a drag
const AUTO_EXPAND_WIDTH_FACTOR = 0.1;
const AUTO_COLLAPSE_WIDTH_FACTOR = 0.75;

const clampedSize = (size, min, max) => Math.max(min, Math.min(size, max));
const isRtl = () => document.documentElement.getAttribute('dir') === 'rtl';

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
		 * Size the panel/drawer occupies while collapsed (the drag starts from here)
		 * @type {number}
		 */
		collapsedSize: { type: Number, attribute: 'collapsed-size' },
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
			touch-action: none;
			width: ${DIVIDER_WIDTH}px;
		}
		.divider:hover {
			background-color: var(--d2l-color-corundum);
		}
		.divider:focus-within {
			background-color: var(--d2l-color-celestine);
		}
		:host([panel-position="start"]) .divider.collapsed,
		:host([panel-position="end"]) .divider.maxed {
			cursor: var(--d2l-cursor-resize-inline-end, e-resize);
		}
		:host([panel-position="start"]) .divider.maxed,
		:host([panel-position="end"]) .divider.collapsed {
			cursor: var(--d2l-cursor-resize-inline-start, w-resize);
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
			background-color: var(--d2l-color-gypsum);
			border-color: var(--d2l-color-celestine);
		}
		.slider:focus .divider-handle {
			background-color: var(--d2l-color-celestine-minus-1);
			border-color: var(--d2l-color-celestine-minus-1);
		}
		.slider:focus .divider-handle .handle-icon {
			color: white;
		}

		.divider-arrow {
			align-items: center;
			background-color: rgba(255, 255, 255, 0.5);
			cursor: pointer;
			display: none;
			height: 24px;
			inset-block-start: max(50%, 97px); /* Do not hide behind slider on short screens */
			justify-content: center;
			position: absolute;
			transform: translateY(-50%);
			width: 24px;
		}
		.divider-arrow d2l-icon-custom {
			color: var(--d2l-color-celestine);
		}
		.divider:focus-within .divider-arrow:not([hidden]) {
			display: flex;
		}
		.divider-arrow:hover {
			background-color: var(--d2l-color-gypsum);
		}
		.divider-arrow:hover d2l-icon-custom {
			color: var(--d2l-color-celestine-minus-1);
		}
		.divider-arrow.start {
			border-end-start-radius: 6px;
			border-start-start-radius: 6px;
			inset-inline-end: 100%;
		}
		.divider-arrow.end {
			border-end-end-radius: 6px;
			border-start-end-radius: 6px;
			inset-inline-start: 100%;
		}

		:host([panel-type="drawer"]) .divider {
			background-color: var(--d2l-color-celestine);
			cursor: ns-resize;
			height: ${DIVIDER_WIDTH}px;
			width: 100%;
		}
		:host([panel-type="drawer"]) .divider.collapsed {
			cursor: n-resize;
		}
		:host([panel-type="drawer"]) .divider.maxed {
			cursor: s-resize;
		}

		:host([panel-type="drawer"]) .slider {
			inset-inline-end: 18px;
			top: auto;
		}

		/* TO DO: Lots more drawer styling to come */

	`;

	static focusElementSelector = '.slider';

	constructor() {
		super();

		this.collapsed = false;
		this.collapsedSize = 0;
		this.currentSize = 0;
		this.label = '';
		this.maxSize = 0;
		this.minSize = 0;
		this.panelPosition = 'start';
		this.panelType = 'panel';
	}

	render() {
		const dividerClasses = {
			divider: true,
			collapsed: this.currentSize <= this.collapsedSize,
			maxed: this.currentSize === this.maxSize
		};
		const { showStartArrow, showEndArrow } = this.#getArrowVisibility();
		let ariaValues = {};
		if (this.maxSize > 0) {
			ariaValues = { max: this.maxSize, min: 0, now: this.currentSize, text: formatPercent(this.currentSize / this.maxSize, { maximumFractionDigits: 0 }) };
		}

		return html`
		    <div class="${classMap(dividerClasses)}" @click="${this.#handleClick}" @pointerdown="${this.#handlePointerDown}">
				${this.panelType === 'panel' ? html`
					<div class="divider-arrow start" data-position="start" ?hidden="${!showStartArrow}">
						<d2l-icon-custom size="tier1">${ICON_ARROW_COLLAPSE_LEFT}</d2l-icon-custom>
					</div>
					<div class="divider-arrow end" data-position="end" ?hidden="${!showEndArrow}">
						<d2l-icon-custom size="tier1">${ICON_ARROW_COLLAPSE_RIGHT}</d2l-icon-custom>
					</div>
				` : nothing}
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

	#clickedArrow;
	#clickedHandle = false;
	#draggedDivider = false;
	#dragStats;

	#handlePointerMove = (e) => {
		if (!this.#dragStats || e.pointerId !== this.#dragStats.pointerId) return;
		const delta = this.panelType === 'panel' ? (e.clientX - this.#dragStats.startX) : (e.clientY - this.#dragStats.startY);
		if (Math.abs(delta) >= DRAG_THRESHOLD) this.#dragStats.moved = true;
		if (!this.#dragStats.moved) return;

		let growthDirectionIsPositive;
		if (this.panelType === 'panel') {
			growthDirectionIsPositive = (this.panelPosition === 'start') !== isRtl();
		} else if (this.panelType === 'drawer') {
			growthDirectionIsPositive = false;
		}
		const signedDelta = (growthDirectionIsPositive ? 1 : -1) * delta;
		const requestedSize = this.#dragStats.startSize + signedDelta;

		this.#dragStats.lastSize = requestedSize;
		this.#sendResizeLiveEvent(requestedSize);
	};

	#handlePointerUp = (e) => {
		if (!this.#dragStats || e.pointerId !== this.#dragStats.pointerId) return;
		const target = e.currentTarget;
		target.removeEventListener('pointermove', this.#handlePointerMove);
		target.removeEventListener('pointerup', this.#handlePointerUp);
		target.removeEventListener('pointercancel', this.#handlePointerUp);

		if (this.collapsed && this.#dragStats.lastSize > this.minSize * AUTO_EXPAND_WIDTH_FACTOR) {
			this.#draggedDivider = true;
			this.#sendToggleEvent();
			this.#sendResizeEvent(this.#dragStats.lastSize);
		} else if (!this.collapsed && this.#dragStats.lastSize < this.minSize * AUTO_COLLAPSE_WIDTH_FACTOR) {
			this.#draggedDivider = true;
			this.#sendToggleEvent();
		} else if (this.#dragStats.moved) {
			this.#draggedDivider = true;
			this.#sendResizeEvent(this.#dragStats.lastSize);
		}
		this.#dragStats = null;
	};

	#getArrowVisibility() {
		if (this.panelType !== 'panel' || this.collapsed) return { showStartArrow: false, showEndArrow: false };
		const canShrink = this.currentSize > this.minSize;
		const canGrow = this.currentSize < this.maxSize;
		const showStartArrow = this.panelPosition === 'start' ? canShrink : canGrow;
		const showEndArrow = this.panelPosition === 'start' ? canGrow : canShrink;
		return { showStartArrow, showEndArrow };
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

	#handleClick(e) {
		// Do not toggle/resize until click event is received,
		// to avoid clicking on elements under the arrows in overlay mode or under the handle in drawer mode
		e.stopPropagation();
		if (this.#draggedDivider) return;

		if (this.collapsed || this.#clickedHandle) {
			this.#sendToggleEvent();
		} else if (this.#clickedArrow) {
			const endArrowClicked = this.#clickedArrow.dataset.position === 'end';
			const shouldGrow = endArrowClicked === (this.panelPosition === 'start');

			const step = (shouldGrow ? 1 : -1) * KEYBOARD_STEP;
			const requestedSize = this.currentSize + step;
			this.#sendResizeEvent(requestedSize);
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
			positiveStepKey = (this.panelPosition === 'start') !== isRtl() ? 'ArrowRight' : 'ArrowLeft';
		} else if (this.panelType === 'drawer') {
			if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
			positiveStepKey = 'ArrowUp';
		}

		const step = (e.key === positiveStepKey ? 1 : -1) * KEYBOARD_STEP;
		const requestedSize = this.currentSize + step;
		this.#sendResizeEvent(requestedSize);
	}

	#handlePointerDown(e) {
		this.#draggedDivider = false;

		if (e.button !== 0) return; // Don't collapse when right-clicking to debug
		e.preventDefault();
		e.stopPropagation();
		this.focus();

		const path = e.composedPath();
		this.#clickedHandle = path.some(el => el.classList?.contains('divider-handle'));
		this.#clickedArrow = path.find(el => el.classList?.contains('divider-arrow'));
		if (this.#clickedArrow) return; // Arrows don't support dragging

		const startSize = this.collapsed ? this.collapsedSize : this.currentSize;
		this.#dragStats = {
			pointerId: e.pointerId,
			startX: e.clientX,
			startY: e.clientY,
			startSize,
			lastSize: startSize,
			moved: false
		};

		const target = e.currentTarget;
		target.setPointerCapture(e.pointerId);
		target.addEventListener('pointermove', this.#handlePointerMove);
		target.addEventListener('pointerup', this.#handlePointerUp);
		target.addEventListener('pointercancel', this.#handlePointerUp);
	}

	#sendResizeEvent(requestedSize) {
		const clampedRequestedSize = clampedSize(requestedSize, this.minSize, this.maxSize);
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-page-divider-resize', { detail: {
			requestedSize: clampedRequestedSize
		} }));
	}

	#sendResizeLiveEvent(requestedSize) {
		const clampedRequestedSize = clampedSize(requestedSize, this.collapsedSize, this.maxSize);
		if (clampedRequestedSize === this.currentSize) return; // Don't bother sending events when dragging past min/max
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-page-divider-resize-live', { detail: {
			requestedSize: clampedRequestedSize
		} }));
	}

	#sendToggleEvent() {
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-page-divider-toggle'));
	}

}

customElements.define('d2l-page-divider-internal', PageDivider);
