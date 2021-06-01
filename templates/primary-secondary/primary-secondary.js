import '../../components/colors/colors.js';
import '../../components/icons/icon-custom.js';
import '../../components/icons/icon.js';
import '../../components/offscreen/offscreen.js';
import { css, html, LitElement } from 'lit-element/lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { FocusVisiblePolyfillMixin } from '../../mixins/focus-visible-polyfill-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const desktopMinSize = 320;

const desktopStepDelta = 80; // try to make each keyboard step move 80px
const desktopMinSteps = 2; // min number of keyboard presses to get from min size to max size
const desktopMaxSteps = 8; // min number of keyboard presses to get from min size to max size

const keyCodes = Object.freeze({
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40
});

function isMobile() {
	return matchMedia('only screen and (max-width: 767px)').matches;
}

const isWindows = window.navigator.userAgent.indexOf('Windows') > -1;

function clamp(val, min, max) {
	return Math.max(min, Math.min(val, max));
}

function computeSizeKey(key) {
	return `d2l-primary-secondary-${key}`;
}

class Resizer {

	constructor() {
		this.contentRect = null;
		this.contentBounds = null;
		this.isMobile = false;
		this.panelSize = 0;
		this.isRtl = false;
	}

	clampHeight(height) {
		return clamp(height, this.contentBounds.minHeight, this.contentBounds.maxHeight);
	}

	clampWidth(width) {
		return clamp(width, this.contentBounds.minWidth, this.contentBounds.maxWidth);
	}

	dispatchResize(size, animateResize) {
		if (this._onResizeCallback) {
			this._onResizeCallback({ size, animateResize: !!animateResize });
		}
	}

	dispatchResizeEnd() {
		if (this._onResizeEndCallback) {
			this._onResizeEndCallback();
		}
	}

	dispatchResizeStart() {
		if (this._onResizeStartCallback) {
			this._onResizeStartCallback();
		}
	}

	onResize(callback) {
		this._onResizeCallback = callback;
	}

	onResizeEnd(callback) {
		this._onResizeEndCallback = callback;
	}

	onResizeStart(callback) {
		this._onResizeStartCallback = callback;
	}
}

class DesktopKeyboardResizer extends Resizer {

	constructor() {
		super();
		this._onKeyDown = this._onKeyDown.bind(this);
	}

	connect(target) {
		target.addEventListener('keydown', this._onKeyDown);
		this._target = target;
	}

	disconnect() {
		if (this._target) {
			this._target.removeEventListener('keydown', this._onKeyDown);
		}
	}

	_onKeyDown(e) {
		if (this.isMobile) {
			return;
		}
		const leftKeyCode = this.isRtl ? keyCodes.RIGHT : keyCodes.LEFT;
		const rightKeyCode = this.isRtl ? keyCodes.LEFT : keyCodes.RIGHT;
		if (e.keyCode !== leftKeyCode && e.keyCode !== rightKeyCode) {
			return;
		}
		e.preventDefault();
		let secondaryWidth;
		if (this.panelSize === 0) {
			if (e.keyCode === leftKeyCode) {
				secondaryWidth = this.contentBounds.minWidth;
			} else {
				secondaryWidth = 0;
			}
		} else {
			const steps = clamp(Math.round((this.contentBounds.maxWidth - this.contentBounds.minWidth) / desktopStepDelta), desktopMinSteps, desktopMaxSteps);
			const delta = (this.contentBounds.maxWidth - this.contentBounds.minWidth) / steps;

			const direction = e.keyCode === leftKeyCode ? 1 : -1;
			const desiredWidth = this.panelSize + delta * direction;
			const desiredSteppedWidth = this.contentBounds.minWidth + delta * Math.round((desiredWidth - this.contentBounds.minWidth) / delta);

			const actualSecondaryWidth = this.clampWidth(desiredSteppedWidth);
			if (desiredSteppedWidth < actualSecondaryWidth) {
				secondaryWidth = 0;
			} else {
				secondaryWidth = actualSecondaryWidth;
			}
		}
		this.dispatchResize(secondaryWidth, true);
	}
}

class DesktopMouseResizer extends Resizer {

	constructor() {
		super();
		this._onTouchStart = this._onTouchStart.bind(this);
		this._onMouseDown = this._onMouseDown.bind(this);
		this._onTouchMove = this._onTouchMove.bind(this);
		this._onMouseMove = this._onMouseMove.bind(this);
		this._onResizeEnd = this._onResizeEnd.bind(this);
		this._target = null;
	}

	connect(target) {
		target.addEventListener('touchstart', this._onTouchStart);
		target.addEventListener('touchmove', this._onTouchMove);
		target.addEventListener('touchend', this._onResizeEnd);
		target.addEventListener('mousedown', this._onMouseDown);
		window.addEventListener('mousemove', this._onMouseMove);
		window.addEventListener('mouseup', this._onResizeEnd);
		this._target = target;
	}

	disconnect() {
		if (this._target) {
			this._target.removeEventListener('touchstart', this._onTouchStart);
			this._target.removeEventListener('touchmove', this._onTouchMove);
			this._target.removeEventListener('touchend', this._onResizeEnd);
			this._target.removeEventListener('mousedown', this._onMouseDown);
		}
		window.removeEventListener('mousemove', this._onMouseMove);
		window.removeEventListener('mouseup', this._onResizeEnd);
		this._target = null;
	}

	_computeContentX(clientX) {
		const x = clientX - this.contentRect.left;
		return this.isRtl ? x : this.contentRect.width - x;
	}

	_onMouseDown(e) {
		if (!this.isMobile) {
			e.preventDefault();
			this._resizeStart(e.clientX);
		}
	}

	_onMouseMove(e) {
		if (!this._isResizing) {
			return;
		}
		this._resize(e.clientX);
	}

	_onResizeEnd() {
		if (this._isResizing) {
			this._isResizing = false;
			this.dispatchResizeEnd();
		}
	}

	_onTouchMove(e) {
		if (!this._isResizing) {
			return;
		}
		const touch = e.touches[0];
		this._resize(touch.clientX);
	}

	_onTouchStart(e) {
		if (!this.isMobile) {
			e.preventDefault();
			const touch = e.touches[0];
			this._resizeStart(touch.clientX);
		}
	}

	_resize(clientX) {
		let actualSecondaryWidth;
		const x = this._computeContentX(clientX);
		const collapseThreshold = this.contentBounds.minWidth / 2;
		const desiredSecondaryWidth = x + this._offset;
		if (desiredSecondaryWidth < collapseThreshold) {
			actualSecondaryWidth = 0;
		} else {
			actualSecondaryWidth = this.clampWidth(desiredSecondaryWidth);
		}
		const animateResize = desiredSecondaryWidth < actualSecondaryWidth || actualSecondaryWidth === 0;
		this.dispatchResize(actualSecondaryWidth, animateResize);
	}

	_resizeStart(clientX) {
		this.dispatchResizeStart();
		const x = this._computeContentX(clientX);
		this._offset = this.panelSize - x;
		this._isResizing = true;
		this._target.focus();
	}

}

class MobileKeyboardResizer extends Resizer {

	constructor() {
		super();
		this._steps = 3;
		this._onKeyDown = this._onKeyDown.bind(this);
	}

	connect(target) {
		target.addEventListener('keydown', this._onKeyDown);
		this._target = target;
	}

	disconnect() {
		if (this._target) {
			this._target.removeEventListener('keydown', this._onKeyDown);
		}
	}

	_onKeyDown(e) {
		if (!this.isMobile) {
			return;
		}
		if (e.keyCode !== keyCodes.UP && e.keyCode !== keyCodes.DOWN) {
			return;
		}
		let secondaryHeight;
		if (this.panelSize === 0) {
			if (e.keyCode === keyCodes.UP) {
				secondaryHeight = this.contentBounds.minHeight;
			} else {
				secondaryHeight = 0;
			}
		} else {
			const delta = (this.contentBounds.maxHeight - this.contentBounds.minHeight) / (this._steps - 1);
			const direction = e.keyCode === keyCodes.UP ? 1 : -1;
			const desiredHeight = this.panelSize + delta * direction;
			const desiredSteppedHeight = this.contentBounds.minHeight + delta * Math.round((desiredHeight - this.contentBounds.minHeight) / delta);

			const actualSecondaryHeight = this.clampHeight(desiredSteppedHeight);
			if (desiredSteppedHeight < actualSecondaryHeight) {
				secondaryHeight = 0;
			} else {
				secondaryHeight = actualSecondaryHeight;
			}
		}
		this.dispatchResize(secondaryHeight, true);
	}
}

class MobileMouseResizer extends Resizer {

	constructor() {
		super();
		this._onMouseDown = this._onMouseDown.bind(this);
		this._onMouseMove = this._onMouseMove.bind(this);
		this._onMouseUp = this._onMouseUp.bind(this);
		this._target = null;
	}

	connect(target) {
		target.addEventListener('mousedown', this._onMouseDown);
		window.addEventListener('mousemove', this._onMouseMove);
		window.addEventListener('mouseup', this._onMouseUp);
		this._target = target;
	}

	disconnect() {
		if (this._target) {
			this._target.removeEventListener('mousedown', this._onMouseDown);
		}
		window.removeEventListener('mousemove', this._onMouseMove);
		window.removeEventListener('mouseup', this._onMouseUp);
		this._target = null;
	}

	_onMouseDown(e) {
		if (this.isMobile) {
			this.dispatchResizeStart();
			e.preventDefault();
			const y = e.clientY - this.contentRect.top;
			this._offset = y - (this.contentRect.height - this.panelSize);
			this._isResizing = true;
			this._target.focus();
		}
	}

	_onMouseMove(e) {
		if (!this._isResizing) {
			return;
		}
		const y = e.clientY - this.contentRect.top;

		let actualSecondaryHeight;
		const collapseThreshold = this.contentBounds.minHeight / 2;
		const desiredSecondaryHeight = this.contentRect.height - y + this._offset;
		if (desiredSecondaryHeight < collapseThreshold) {
			actualSecondaryHeight = 0;
		} else {
			actualSecondaryHeight = this.clampHeight(desiredSecondaryHeight);
		}
		const animateResize = desiredSecondaryHeight < actualSecondaryHeight || actualSecondaryHeight === 0;
		this.dispatchResize(actualSecondaryHeight, animateResize);
	}

	_onMouseUp() {
		if (this._isResizing) {
			this._isResizing = false;
			this.dispatchResizeEnd();
		}
	}

}

class MobileTouchResizer extends Resizer {
	constructor() {
		super();
		this._onResizeStart = this._onResizeStart.bind(this);
		this._onTouchMove = this._onTouchMove.bind(this);
		this._onResizeEnd = this._onResizeEnd.bind(this);
		this._target = null;
	}

	connect(target) {
		target.addEventListener('touchstart', this._onResizeStart);
		target.addEventListener('touchmove', this._onTouchMove);
		target.addEventListener('touchend', this._onResizeEnd);
		this._target = target;
	}

	disconnect() {
		if (this._target) {
			this._target.removeEventListener('touchstart', this._onResizeStart);
			this._target.removeEventListener('touchmove', this._onTouchMove);
			this._target.removeEventListener('touchend', this._onResizeEnd);
		}
		this._target = null;
	}

	_computeTouchDirection() {
		const oldest = this._touches[0];
		const newest = this._touches[this._touches.length - 1];
		if (oldest === newest) {
			return 0;
		}
		return newest - oldest;
	}

	_onResizeEnd() {
		if (this._isResizing) {
			if (this.panelSize > this.contentBounds.minHeight && this.panelSize < this.contentBounds.maxHeight) {
				let secondaryHeight;
				const touchDirection = this._computeTouchDirection();
				if (touchDirection >= 0) {
					secondaryHeight = this.contentBounds.minHeight;
				} else {
					secondaryHeight = this.contentBounds.maxHeight;
				}
				this.dispatchResize(secondaryHeight, true);
			}
			this._isResizing = false;
			this.dispatchResizeEnd();
		}
	}

	_onResizeStart(e) {
		if (this.isMobile) {
			this.dispatchResizeStart();
			const touch = e.touches[0];
			this._prevTouch = touch.screenY;
			this._isResizing = true;
			this._touches = [];
			this._trackTouch(touch);
		}
	}

	_onTouchMove(e) {
		if (!this._isResizing) {
			return;
		}
		const touch = e.touches[0];
		const curTouch = touch.screenY;
		const delta = curTouch - this._prevTouch;
		const curScroll = this._target.scrollTop;
		this._trackTouch(touch);

		let isScrollable;
		let secondaryHeight = this.panelSize;
		if (delta > 0) {
			if (curScroll === 0) {
				secondaryHeight = this.clampHeight(this.panelSize - delta);
			}
			isScrollable = curScroll > 0;
		} else if (delta < 0) {
			secondaryHeight = this.clampHeight(this.panelSize - delta);
			isScrollable = secondaryHeight === this.contentBounds.maxHeight;
		}
		if (!isScrollable && e.cancelable) {
			e.preventDefault();
		}
		this._prevTouch = curTouch;

		this.dispatchResize(secondaryHeight, false);
	}

	_trackTouch(touch) {
		if (this._touches.length === 5) {
			this._touches.shift();
		}
		this._touches.push(touch.screenY);
	}

}

/**
 * A two panel (primary and secondary) page template with header and optional footer
 * @slot header - Page header content
 * @slot footer - Page footer content
 * @slot primary - Main page content
 * @slot secondary - Supplementary page content
 * @fires d2l-template-primary-secondary-resize-start - Dispatched when a user begins moving the divider.
 * @fires d2l-template-primary-secondary-resize-end - Dispatched when a user finishes moving the divider.
 */
class TemplatePrimarySecondary extends FocusVisiblePolyfillMixin(RtlMixin(LocalizeCoreElement(LitElement))) {

	static get properties() {
		return {
			/**
			 * Controls whether the primary and secondary panels have shaded backgrounds
			 * @type {'primary'|'secondary'|'none'}
			 */
			backgroundShading: { type: String, attribute: 'background-shading' },
			/**
			 * Controls how the primary panel's contents overflow
			 * @type {'default'|'hidden'}
			 */
			primaryOverflow: { attribute: 'primary-overflow', reflect: true, type: String },
			/**
			 * Whether the panels are user resizable. This only applies to desktop users,
			 * mobile users will always be able to resize.
			 */
			resizable: { type: Boolean, reflect: true },
			/**
			 * The key used to persist the divider's position to local storage. This key
			 * should not be shared between pages so that users can save different divider
			 * positions on different pages. If no key is provided, the template will fall
			 * back its default size.
			 */
			storageKey: { type: String, attribute: 'storage-key' },
			/**
			 * Whether content fills the screen or not
			 * @type {'fullscreen'|'normal'}
			 */
			widthType: { type: String, attribute: 'width-type', reflect: true },
			_animateResize: { type: Boolean, attribute: false },
			_hasFooter: { type: Boolean, attribute: false },
			_isCollapsed: { type: Boolean, attribute: false },
			_isExpanded: { type: Boolean, attribute: false },
			_isMobile: { type: Boolean, attribute: false },
			_size: { type: Number, attribute: false }
		};
	}

	static get styles() {
		return css`
			:host {
				bottom: 0;
				left: 0;
				overflow: hidden;
				position: absolute;
				right: 0;
				top: 0;
			}
			:host([hidden]) {
				display: none;
			}
			:host([width-type="normal"]) .d2l-template-primary-secondary-content,
			:host([width-type="normal"]) .d2l-template-primary-secondary-footer {
				margin: 0 auto;
				max-width: 1230px;
				width: 100%;
			}
			.d2l-template-primary-secondary-container {
				display: flex;
				flex-direction: column;
				height: 100%;
				width: 100%;
			}
			.d2l-template-primary-secondary-content {
				display: flex;
				height: 100%;
				overflow: hidden;
			}

			main {
				flex: 2 0 0;
				-webkit-overflow-scrolling: touch;
				overflow-x: hidden;
				transition: none;
			}
			:host([resizable]) main {
				flex: 1 0 0;
			}
			:host([primary-overflow="hidden"]) main {
				overflow: hidden;
			}
			.d2l-template-primary-secondary-secondary-container {
				flex: 1 0 0;
				min-width: ${desktopMinSize}px;
				overflow: hidden;
			}
			:host([resizable]) .d2l-template-primary-secondary-secondary-container {
				flex: none;
				min-width: 0;
			}
			[data-animate-resize] .d2l-template-primary-secondary-secondary-container {
				transition: width 400ms cubic-bezier(0, 0.7, 0.5, 1), height 400ms cubic-bezier(0, 0.7, 0.5, 1);
			}
			.d2l-template-primary-secondary-divider-shadow {
				display: none;
			}
			aside {
				height: 100%;
				min-width: ${desktopMinSize}px;
				-webkit-overflow-scrolling: touch;
				overflow-x: hidden;
				overflow-y: scroll;
			}

			/* prevent margin colapse on slotted children */
			aside::before,
			aside::after {
				content: ' ';
				display: table;
			}
			[data-background-shading="primary"] > main,
			[data-background-shading="secondary"] > .d2l-template-primary-secondary-secondary-container {
				background-color: var(--d2l-color-gypsum);
			}
			:host([resizable]) [data-is-collapsed] aside {
				display: none;
			}
			.d2l-template-primary-secondary-divider {
				background-color: var(--d2l-color-mica);
				flex: none;
				outline: none;
				position: relative;
				width: 1px;
				z-index: 1;
			}
			.d2l-template-primary-secondary-divider-handle {
				display: none;
				position: absolute;
				top: calc(50%);
				width: 100%;
			}
			:host([resizable]) .d2l-template-primary-secondary-divider {
				background-color: var(--d2l-color-gypsum);
				cursor: ew-resize;
				width: 0.45rem;
			}
			:host([resizable]) [data-is-collapsed] .d2l-template-primary-secondary-divider,
			:host([resizable][dir="rtl"]) [data-is-expanded] .d2l-template-primary-secondary-divider {
				cursor: w-resize;
			}
			:host([resizable]) [data-is-expanded] .d2l-template-primary-secondary-divider,
			:host([resizable][dir="rtl"]) [data-is-collapsed] .d2l-template-primary-secondary-divider {
				cursor: e-resize;
			}
			:host([resizable]) .d2l-template-primary-secondary-divider-handle {
				align-items: center;
				display: flex;
				justify-content: center;
			}
			:host([resizable]) [data-background-shading="secondary"] .d2l-template-primary-secondary-divider,
			:host([resizable][dir="rtl"]) [data-background-shading="primary"] .d2l-template-primary-secondary-divider {
				box-shadow: 1px 0 0 0 rgba(0, 0, 0, 0.15);
			}
			:host([resizable]) [data-background-shading="primary"] .d2l-template-primary-secondary-divider,
			:host([resizable][dir="rtl"]) [data-background-shading="secondary"] .d2l-template-primary-secondary-divider {
				box-shadow: -1px 0 0 0 rgba(0, 0, 0, 0.15);
			}
			.d2l-template-primary-secondary-divider-handle-desktop {
				align-items: center;
				display: flex;
				justify-content: center;
				position: absolute;
			}
			.d2l-template-primary-secondary-divider-handle-left,
			.d2l-template-primary-secondary-divider-handle-right {
				color: var(--d2l-color-celestine);
				display: none;
				position: absolute;
			}
			.d2l-template-primary-secondary-divider-handle-left {
				left: -1rem;
			}
			.d2l-template-primary-secondary-divider-handle-right {
				right: -1rem;
			}
			.d2l-template-primary-secondary-divider-handle-line {
				display: flex;
				height: 0.9rem;
				justify-content: space-between;
				width: 0.25rem;
			}
			.d2l-template-primary-secondary-divider-handle-line::before,
			.d2l-template-primary-secondary-divider-handle-line::after {
				background-color: var(--d2l-color-galena);
				border-radius: 0.05rem;
				content: '';
				display: inline-block;
				width: 0.1rem;
			}
			.d2l-template-primary-secondary-divider.focus-visible .d2l-template-primary-secondary-divider-handle-right,
			.d2l-template-primary-secondary-divider.focus-visible .d2l-template-primary-secondary-divider-handle-left {
				display: block;
			}
			:host(:not([dir="rtl"])) [data-is-expanded] .d2l-template-primary-secondary-divider-handle-left {
				display: none;
			}
			:host([dir="rtl"]) [data-is-expanded] .d2l-template-primary-secondary-divider-handle-right {
				display: none;
			}
			d2l-icon {
				display: none;
			}

			footer {
				background-color: white;
				box-shadow: 0 -2px 4px rgba(73, 76, 78, 0.2); /* ferrite */
				padding: 0.75rem 1rem;
			}
			header, footer {
				z-index: 2; /* ensures the footer box-shadow is over main areas with background colours set */
			}

			:host([resizable]) .d2l-template-primary-secondary-divider:focus,
			:host([resizable]) .d2l-template-primary-secondary-divider:hover,
			:host([resizable][dir="rtl"]) .d2l-template-primary-secondary-divider:focus,
			:host([resizable][dir="rtl"]) .d2l-template-primary-secondary-divider:hover {
				background-color: var(--d2l-color-mica);
				box-shadow: none;
			}
			:host([resizable]) .d2l-template-primary-secondary-divider.focus-visible,
			:host([resizable][dir="rtl"]) .d2l-template-primary-secondary-divider.focus-visible {
				background-color: var(--d2l-color-celestine);
			}
			.d2l-template-primary-secondary-divider:focus .d2l-template-primary-secondary-divider-handle-line::before,
			.d2l-template-primary-secondary-divider:focus .d2l-template-primary-secondary-divider-handle-line::after,
			.d2l-template-primary-secondary-divider:hover .d2l-template-primary-secondary-divider-handle-line::before,
			.d2l-template-primary-secondary-divider:hover .d2l-template-primary-secondary-divider-handle-line::after {
				background-color: var(--d2l-color-ferrite);
			}
			.d2l-template-primary-secondary-divider.focus-visible .d2l-template-primary-secondary-divider-handle-line::before,
			.d2l-template-primary-secondary-divider.focus-visible .d2l-template-primary-secondary-divider-handle-line::after {
				background-color: white;
			}

			.d2l-template-primary-secondary-divider,
			.d2l-template-primary-secondary-divider-handle-mobile,
			.d2l-template-primary-secondary-divider-handle-line::before,
			.d2l-template-primary-secondary-divider-handle-line::after {
				transition: background-color 100ms, box-shadow 100ms;
			}
			.d2l-template-primary-secondary-divider:hover,
			.d2l-template-primary-secondary-divider:hover .d2l-template-primary-secondary-divider-handle-mobile,
			.d2l-template-primary-secondary-divider:hover .d2l-template-primary-secondary-divider-handle-line::before,
			.d2l-template-primary-secondary-divider:hover .d2l-template-primary-secondary-divider-handle-line::after {
				transition-delay: 100ms;
			}

			.d2l-template-scroll::-webkit-scrollbar {
				width: 8px;
			}

			.d2l-template-scroll::-webkit-scrollbar-track {
				background: rgba(255, 255, 255, 0.4);
			}

			.d2l-template-scroll::-webkit-scrollbar-thumb {
				background: var(--d2l-color-galena);
				border-radius: 4px;
			}

			.d2l-template-scroll::-webkit-scrollbar-thumb:hover {
				background: var(--d2l-color-tungsten);
			}

			/* For Firefox */
			.d2l-template-scroll {
				scrollbar-color: var(--d2l-color-galena) rgba(255, 255, 255, 0.4);
				scrollbar-width: thin;
			}

			@media (prefers-reduced-motion: reduce) {
				.d2l-template-primary-secondary-divider,
				.d2l-template-primary-secondary-divider-handle-line::before,
				.d2l-template-primary-secondary-divider-handle-line::after,
				.d2l-template-primary-secondary-divider-handle-mobile {
					transition: none;
				}
			}
			@media only screen and (max-width: 767px) {

				.d2l-template-primary-secondary-content {
					flex-direction: column;
				}

				main {
					flex: 1 0 0;
				}
				.d2l-template-primary-secondary-secondary-container {
					flex: none;
				}
				aside,
				.d2l-template-primary-secondary-secondary-container {
					min-width: auto;
				}
				[data-is-collapsed] aside {
					display: none;
				}

				.d2l-template-primary-secondary-divider-handle-desktop {
					display: none;
				}
				/* Attribute selector is only used to increase specificity */
				:host([resizable]) .d2l-template-primary-secondary-divider,
				:host(:not([resizable])) .d2l-template-primary-secondary-divider {
					background-color: var(--d2l-color-celestine);
					cursor: ns-resize;
					height: 0.1rem;
					width: 100%;
				}
				:host([resizable]) [data-is-collapsed] .d2l-template-primary-secondary-divider,
				:host(:not([resizable])) [data-is-collapsed] .d2l-template-primary-secondary-divider {
					cursor: n-resize;
				}
				:host([resizable]) [data-is-expanded] .d2l-template-primary-secondary-divider,
				:host(:not([resizable])) [data-is-expanded] .d2l-template-primary-secondary-divider {
					cursor: s-resize;
				}

				/* Attribute selector is only used to increase specificity */
				:host([resizable]) .d2l-template-primary-secondary-divider:hover,
				:host(:not([resizable])) .d2l-template-primary-secondary-divider:hover,
				:host([resizable]) .d2l-template-primary-secondary-divider:focus,
				:host(:not([resizable])) .d2l-template-primary-secondary-divider:focus {
					background-color: var(--d2l-color-celestine-minus-1);
				}
				.d2l-template-primary-secondary-divider-handle {
					border-radius: 0;
					bottom: 0.1rem;
					display: block;
					left: auto;
					overflow: hidden;
					right: calc(17px + 0.2rem);
					top: auto;
				}
				:host([dir="rtl"]) .d2l-template-primary-secondary-divider-handle {
					left: calc(17px + 0.2rem);
					right: auto;
				}
				.d2l-template-primary-secondary-divider-handle-mobile {
					align-items: center;
					background-color: var(--d2l-color-celestine);
					border-radius: 0.25rem 0.25rem 0 0;
					bottom: 0;
					display: flex;
					justify-content: center;
					position: absolute;
					right: 0;
				}
				.d2l-template-primary-secondary-divider:hover .d2l-template-primary-secondary-divider-handle-mobile,
				.d2l-template-primary-secondary-divider:focus .d2l-template-primary-secondary-divider-handle-mobile {
					background-color: var(--d2l-color-celestine-minus-1);
				}
				.d2l-template-primary-secondary-divider-handle,
				.d2l-template-primary-secondary-divider-handle-mobile {
					height: 1rem;
					width: 2.2rem;
				}
				.d2l-template-primary-secondary-divider.focus-visible .d2l-template-primary-secondary-divider-handle {
					box-shadow: none;
					height: 1.2rem;
					right: 17px;
					width: 2.6rem;
				}
				:host([dir="rtl"]) .d2l-template-primary-secondary-divider.focus-visible .d2l-template-primary-secondary-divider-handle {
					left: 17px;
					right: auto;
				}
				d2l-icon {
					color: white;
					display: block;
				}
				.d2l-template-primary-secondary-divider.focus-visible .d2l-template-primary-secondary-divider-handle-mobile {
					box-shadow: 0 0 0 0.1rem white, 0 0 0 0.2rem var(--d2l-color-celestine);
					right: 0.2rem;
				}

				.d2l-template-primary-secondary-divider-shadow {
					box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.25);
					display: block;
					height: 100%;
					position: absolute;
					width: 100%;
				}
			}
		`;
	}

	constructor() {
		super();

		this._onContentResize = this._onContentResize.bind(this);
		this._onPanelResize = this._onPanelResize.bind(this);
		this._onPanelResizeStart = this._onPanelResizeStart.bind(this);
		this._onPanelResizeEnd = this._onPanelResizeEnd.bind(this);

		this._desktopKeyboardResizer = new DesktopKeyboardResizer();
		this._desktopMouseResizer = new DesktopMouseResizer();
		this._mobileKeyboardResizer = new MobileKeyboardResizer();
		this._mobileMouseResizer = new MobileMouseResizer();
		this._mobileTouchResizer = new MobileTouchResizer();

		this._resizers = [
			this._desktopKeyboardResizer,
			this._desktopMouseResizer,
			this._mobileKeyboardResizer,
			this._mobileMouseResizer,
			this._mobileTouchResizer
		];
		for (const resizer of this._resizers) {
			resizer.onResize(this._onPanelResize);
			resizer.onResizeStart(this._onPanelResizeStart);
			resizer.onResizeEnd(this._onPanelResizeEnd);
		}

		this.backgroundShading = 'none';
		this.resizable = false;
		this.widthType = 'fullscreen';

		this._animateResize = false;
		this._isCollapsed = false;
		this._isExpanded = false;
		this._isMobile = isMobile();

		this._keyboardDescId = getUniqueId();
		this._hasConnectedResizers = false;
	}

	disconnectedCallback() {
		for (const resizer of this._resizers) {
			resizer.disconnect();
		}
		this._hasConnectedResizers = false;
	}

	firstUpdated(changedProperties) {

		super.firstUpdated(changedProperties);

		const isRtl = this.getAttribute('dir') === 'rtl';
		for (const resizer of this._resizers) {
			resizer.isRtl = isRtl;
		}
		const contentArea = this.shadowRoot.querySelector('.d2l-template-primary-secondary-content');
		this._resizeObserver = new ResizeObserver(this._onContentResize);
		this._resizeObserver.observe(contentArea);
	}

	render() {
		let tabindex;
		const secondaryPanelStyles = {};
		if (this._isResizable()) {
			secondaryPanelStyles[this._isMobile ? 'height' : 'width'] = `${this._size}px`;
			tabindex = 0;
		}
		const separatorVal = this._size && Math.round(this._size);
		const separatorMax = this._contentBounds && Math.round(this._isMobile ? this._contentBounds.maxHeight : this._contentBounds.maxWidth);
		const scrollClasses = {
			'd2l-template-scroll': isWindows
		};
		const keyboardHelpText = this._isMobile ? this.localize('templates.primary-secondary.keyboardVertical') : this.localize('templates.primary-secondary.keyboardHorizontal');
		return html`
			<div class="d2l-template-primary-secondary-container">
				<header><slot name="header"></slot></header>
				<div class="d2l-template-primary-secondary-content" data-background-shading="${this.backgroundShading}" ?data-animate-resize=${this._animateResize} ?data-is-collapsed=${this._isCollapsed} ?data-is-expanded=${this._isExpanded}>
					<main class="${classMap(scrollClasses)}"><slot name="primary"></slot></main>
					<d2l-offscreen id="${this._keyboardDescId}">${keyboardHelpText}</d2l-offscreen>
					<div tabindex="${ifDefined(tabindex)}" class="d2l-template-primary-secondary-divider" role=separator aria-label="${this.localize('templates.primary-secondary.adjustableSplitView')}" aria-describedby="${this._keyboardDescId}" aria-orientation=${this._isMobile ? 'horizontal' : 'vertical'} aria-valuenow="${ifDefined(separatorVal)}" aria-valuemax="${ifDefined(separatorMax)}">
						<div class="d2l-template-primary-secondary-divider-handle" @click=${this._onHandleTap} @mousedown=${this._onHandleTapStart}>
							<div class="d2l-template-primary-secondary-divider-handle-desktop">
								<d2l-icon-custom size="tier1" class="d2l-template-primary-secondary-divider-handle-left">
									<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
										<path transform="rotate(90 9.004714965820312,9.000227928161623)" d="m13.708,6.29a1.006,1.006 0 0 0 -0.708,-0.29l-7.995,0a1,1 0 0 0 -0.705,1.71l4,4a1.013,1.013 0 0 0 1.42,0l4,-4a1.01,1.01 0 0 0 -0.013,-1.42l0.001,0z" fill="#494c4e"/>
									</svg>
								</d2l-icon-custom>
								<div class="d2l-template-primary-secondary-divider-handle-line"></div>
								<d2l-icon-custom size="tier1" class="d2l-template-primary-secondary-divider-handle-right">
									<svg width="18" height="18" xmlns="http://www.w3.org/2000/svg">
										<path transform="rotate(-90 9.004714965820314,9.000227928161621)" d="m13.708,6.29a1.006,1.006 0 0 0 -0.708,-0.29l-7.995,0a1,1 0 0 0 -0.705,1.71l4,4a1.013,1.013 0 0 0 1.42,0l4,-4a1.01,1.01 0 0 0 -0.013,-1.42l0.001,0z" fill="#494c4e"/>
									</svg>
								</d2l-icon-custom>
							</div>
							<div class="d2l-template-primary-secondary-divider-handle-mobile">
								${this._size === 0 ? html`<d2l-icon icon="tier1:chevron-up"></d2l-icon>` : html`<d2l-icon icon="tier1:chevron-down"></d2l-icon>`}
							</div>
						</div>
					</div>
					<div style=${styleMap(secondaryPanelStyles)} class="d2l-template-primary-secondary-secondary-container" @transitionend=${this._onTransitionEnd}>
						<div class="d2l-template-primary-secondary-divider-shadow">
						</div>
						<aside class="${classMap(scrollClasses)}">
							<slot name="secondary"></slot>
						</aside>
					</div>
				</div>
				<footer ?hidden="${!this._hasFooter}">
					<div class="d2l-template-primary-secondary-footer"><slot name="footer" @slotchange="${this._handleFooterSlotChange}"></div></slot>
				</footer>
			</div>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('_size')) {
			if (this.storageKey) {
				const key = computeSizeKey(this.storageKey);
				try {
					localStorage.setItem(key, this._size);
				} catch (ex) {
					// throws if storage is full or in private mode in mobile Safari
				}
			}
		}
		if (!this._secondary) {
			this._secondary = this.shadowRoot.querySelector('aside');
			this._divider = this.shadowRoot.querySelector('.d2l-template-primary-secondary-divider');
		}
		if (this._divider.isConnected && !this._hasConnectedResizers) {
			this._desktopKeyboardResizer.connect(this._divider);
			this._desktopMouseResizer.connect(this._divider);
			this._mobileKeyboardResizer.connect(this._divider);
			this._mobileMouseResizer.connect(this._divider);
			this._mobileTouchResizer.connect(this._secondary);
			this._hasConnectedResizers = true;
		}
	}

	get _size() {
		return this.__size;
	}

	set _size(val) {
		const oldSize = this.__size;
		this.__size = val;
		for (const resizer of this._resizers) {
			resizer.panelSize = val;
		}
		this.requestUpdate('_size', oldSize);
	}

	_computeContentBounds(contentRect) {
		const divider = this.shadowRoot.querySelector('.d2l-template-primary-secondary-divider');
		const desktopDividerSize = divider.offsetWidth;
		const mobileDividerSize = divider.offsetHeight;
		return {
			minWidth: desktopMinSize,
			maxWidth: contentRect.width - desktopMinSize - desktopDividerSize,
			minHeight: (contentRect.height - mobileDividerSize) * (1 / 3),
			maxHeight: (contentRect.height - mobileDividerSize) * (2 / 3)
		};
	}

	_handleFooterSlotChange(e) {
		const nodes = e.target.assignedNodes();
		this._hasFooter = (nodes.length !== 0);
	}

	_isResizable() {
		return this.resizable || this._isMobile;
	}

	_onContentResize(entries) {
		const entry = entries[0];
		const contentRect = entry.target.getBoundingClientRect();
		this._contentBounds = this._computeContentBounds(contentRect);
		this._isMobile = isMobile();

		if (this._size === undefined) {
			// initialize size on first resize
			let size = NaN;
			if (this.storageKey) {
				const key = computeSizeKey(this.storageKey);
				try {
					size = parseFloat(localStorage.getItem(key));
				} catch (ex) {
					// may throw SecurityError if localStorage isn't allowed to be accessed
				}
			}
			if (isFinite(size)) {
				this._size = size;
				this._isCollapsed = size === 0;
			} else {
				if (this._isMobile) {
					this._size = this._contentBounds.minHeight;
				} else {
					const divider = this.shadowRoot.querySelector('.d2l-template-primary-secondary-divider');
					const desktopDividerSize = contentRect.width - divider.offsetWidth;
					this._size = Math.max(desktopMinSize, desktopDividerSize * (1 / 3));
				}
			}
		}
		if (this._size !== 0) {
			if (this._isMobile) {
				this._size = clamp(this._size, this._contentBounds.minHeight, this._contentBounds.maxHeight);
				this._isExpanded = this._size === this._contentBounds.maxHeight;
			} else {
				this._size = clamp(this._size, this._contentBounds.minWidth, this._contentBounds.maxWidth);
				this._isExpanded = this._size === this._contentBounds.maxWidth;
			}
		}
		for (const resizer of this._resizers) {
			resizer.contentRect = contentRect;
			resizer.contentBounds = this._contentBounds;
			resizer.isMobile = this._isMobile;
		}
	}

	_onHandleTap() {
		if (!this._isMobile || !this._isHandleTap) {
			return;
		}
		if (this._size === 0) {
			this._size = this._restoreSize || this._contentBounds.minHeight;
			this._isCollapsed = false;
		} else {
			this._isCollapsed = reduceMotion;
			this._restoreSize = this._size;
			this._size = 0;
		}
		this._animateResize = !reduceMotion;
		this._isHandleTap = false;
	}

	_onHandleTapStart() {
		this._isHandleTap = true;
	}

	_onPanelResize(e) {
		if (this._isResizable()) {
			if (e.size > 0) {
				this._isCollapsed = false;
			} else if (reduceMotion) {
				this._isCollapsed = true;
			}
			if (this._isMobile) {
				this._isExpanded = e.size === this._contentBounds.maxHeight;
			} else {
				this._isExpanded = e.size === this._contentBounds.maxWidth;
			}
			this._animateResize = !reduceMotion && e.animateResize;
			this._isHandleTap = false;
			this._size = e.size;
		}
	}

	_onPanelResizeEnd() {
		this.dispatchEvent(new CustomEvent('d2l-template-primary-secondary-resize-end', { bubbles: true, composed: true }));
	}

	_onPanelResizeStart() {
		this.dispatchEvent(new CustomEvent('d2l-template-primary-secondary-resize-start', { bubbles: true, composed: true }));
	}

	_onTransitionEnd() {
		if (this._size === 0) {
			this._isCollapsed = true;
		}
		this._animateResize = false;
	}
}

customElements.define('d2l-template-primary-secondary', TemplatePrimarySecondary);
