import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { css, html, LitElement } from 'lit';
import { cssEscape, elemIdListAdd, elemIdListRemove, getBoundingAncestor, getOffsetParent } from '../../helpers/dom.js';
import { announce } from '../../helpers/announce.js';
import { bodySmallStyles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { isFocusable } from '../../helpers/focus.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

let logAccessibilityWarning = true;

/* only one tooltip is to be shown at once - track the active tooltip so it can be hidden if necessary */
let activeTooltip = null;

const pointerLength = 16;
const pointerOverhang = 7; /* how far the pointer extends outside the content */

/* rotated 45 degrees */
const pointerRotatedLength = Math.SQRT2 * pointerLength;
const pointerRotatedOverhang = ((pointerRotatedLength - pointerLength) / 2) + pointerOverhang;

const pointerGap = 0; /* spacing between pointer and target */
const defaultViewportMargin = 18;
const contentBorderRadius = 6;
const contentBorderSize = 1;
const contentHorizontalPadding = 15;
const outlineSize = 1;

/* once a user shows a tooltip, ignore delay if they hover adjacent target within this timeout */
let delayTimeoutId;
const resetDelayTimeout = () => {
	if (delayTimeoutId) clearTimeout(delayTimeoutId);
	delayTimeoutId = setTimeout(() => delayTimeoutId = null, 1000);
};
const getDelay = delay => {
	if (delayTimeoutId) return 0;
	else return delay;
};

const interactiveElements = {
	// 'a' only if an href is present
	'button': true,
	'h1': true,
	'h2': true,
	'h3': true,
	'h4': true,
	'h5': true,
	'h6': true,
	'input': true,
	'select': true,
	'textarea': true
};

const interactiveRoles = {
	'button': true,
	'checkbox': true,
	'combobox': true,
	'heading': true,
	'img': true,
	'link': true,
	'listbox': true,
	'menuitem': true,
	'menuitemcheckbox': true,
	'menuitemradio': true,
	'option': true,
	'radio': true,
	'slider': true,
	'spinbutton': true,
	'switch': true,
	'tab:': true,
	'textbox': true,
	'treeitem': true
};

const computeTooltipShift = (centerDelta, spaceLeft, spaceRight) => {

	const contentXAdjustment = centerDelta / 2;
	if (centerDelta <= 0) {
		return contentXAdjustment * -1;
	}
	if (spaceLeft >= contentXAdjustment && spaceRight >= contentXAdjustment) {
		// center with target
		return contentXAdjustment * -1;
	}
	if (spaceLeft <= contentXAdjustment) {
		// shift content right (not enough space to center)
		return spaceLeft * -1;
	} else {
		// shift content left (not enough space to center)
		return (centerDelta * -1) + spaceRight;
	}
};

/**
 * A component used to display additional information when users focus or hover on a point of interest.
 * @slot - Default content placed inside of the tooltip
 * @fires d2l-tooltip-show - Dispatched when the tooltip is opened
 * @fires d2l-tooltip-hide - Dispatched when the tooltip is closed
 */
class Tooltip extends RtlMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Align the tooltip with either the start or end of its target. If not set, the tooltip will attempt be centered.
			 * @type {'start'|'end'}
			 */
			align: { type: String, reflect: true },
			/**
			 * ADVANCED: Announce the tooltip innerText when applicable (for use with custom elements)
			 * @type {boolean}
			 */
			announced: { type: Boolean },
			/**
			 * @ignore
			 */
			boundary: { type: Object },
			/**
			 * ADVANCED: Causes the tooltip to close when its target is clicked
			 * @type {boolean}
			 */
			closeOnClick: { type: Boolean, attribute: 'close-on-click' },
			/**
			 * Provide a delay in milliseconds to prevent the tooltip from opening immediately when hovered. This delay will only apply to hover, not focus.
			 * @type {number}
			 */
			delay: { type: Number },
			/**
			 * ADVANCED: Disables focus lock so the tooltip will automatically close when no longer hovered even if it still has focus
			 * @type {boolean}
			 */
			disableFocusLock: { type: Boolean, attribute: 'disable-focus-lock' },
			/**
			 * REQUIRED: The "id" of the tooltip's target element. Both elements must be within the same shadow root. If not provided, the tooltip's parent element will be used as its target.
			 * @type {string}
			 */
			for: { type: String },
			/**
			 * ADVANCED: Force the tooltip to stay open as long as it remains "true"
			 * @type {boolean}
			 */
			forceShow: { type: Boolean, attribute: 'force-show' },
			/**
			 * ADVANCED: Accessibility type for the tooltip to specify whether it is the primary label for the target or a secondary descriptor.
			 * @type {'label'|'descriptor'}
			 */
			forType: { type: String, attribute: 'for-type' },
			/**
			 * Adjust the size of the gap between the tooltip and its target (px)
			 * @type {number}
			 */
			offset: { type: Number }, /* tooltipOffset */
			/**
			 * ADVANCED: Only show the tooltip if we detect the target element is truncated
			 * @type {boolean}
			 */
			showTruncatedOnly: { type: Boolean, attribute: 'show-truncated-only' },
			/**
			 * ADVANCED: Force the tooltip to open in a certain direction. If no position is provided, the tooltip will open in the first position that has enough space for it in the order: bottom, top, right, left.
			 * @type {'top'|'bottom'|'left'|'right'}
			 */
			position: { type: String },
			/**
			 * @ignore
			 */
			showing: { type: Boolean, reflect: true },
			/**
			 * The style of the tooltip based on the type of information it displays
			 * @type {'info'|'error'}
			 */
			state: { type: String, reflect: true },
			_maxWidth: { type: Number },
			_openDir: { type: String, reflect: true, attribute: '_open-dir' },
			_tooltipShift: { type: Number },
			_viewportMargin: { type: Number }
		};
	}

	static get styles() {
		return [bodySmallStyles, css`
			:host {
				--d2l-tooltip-background-color: var(--d2l-color-ferrite); /* Deprecated, use state attribute instead */
				--d2l-tooltip-border-color: var(--d2l-color-ferrite); /* Deprecated, use state attribute instead */
				--d2l-tooltip-outline-color: rgba(255, 255, 255, 0.32);
				box-sizing: border-box;
				color: white;
				display: inline-block;
				height: 0;
				overflow: hidden;
				position: absolute;
				text-align: left;
				visibility: hidden;
				white-space: normal;
				width: 0;
				z-index: 1001; /* position on top of floating buttons */
			}

			:host([state="error"]) {
				--d2l-tooltip-background-color: var(--d2l-color-cinnabar);
				--d2l-tooltip-border-color: var(--d2l-color-cinnabar);
			}

			:host([dir="rtl"]) {
				text-align: right;
			}

			:host([force-show]),
			:host([showing]) {
				height: auto;
				overflow: visible;
				visibility: visible;
				width: auto;
			}

			.d2l-tooltip-pointer {
				border: 1px solid transparent; /* fixes a webket clipping defect */
				box-sizing: border-box;
				display: inline-block;
				height: ${pointerLength}px;
				position: absolute;
				width: ${pointerLength}px;
				z-index: 1;
			}

			:host([_open-dir="top"]) .d2l-tooltip-pointer,
			:host([_open-dir="bottom"]) .d2l-tooltip-pointer {
				left: calc(50% - ${pointerLength / 2}px);
			}

			:host([_open-dir="top"][align="start"]) .d2l-tooltip-pointer,
			:host([_open-dir="bottom"][align="start"]) .d2l-tooltip-pointer,
			:host([_open-dir="top"][align="end"][dir="rtl"]) .d2l-tooltip-pointer,
			:host([_open-dir="bottom"][align="end"][dir="rtl"]) .d2l-tooltip-pointer {
				left: ${contentHorizontalPadding + (pointerRotatedLength - pointerLength) / 2}px; /* needed for browsers that don't support min like Legacy-Edge */
				left: min(${contentHorizontalPadding + (pointerRotatedLength - pointerLength) / 2}px, calc(50% - ${pointerLength / 2}px));
				right: auto;
			}

			:host([_open-dir="top"][align="end"]) .d2l-tooltip-pointer,
			:host([_open-dir="bottom"][align="end"]) .d2l-tooltip-pointer,
			:host([_open-dir="top"][align="start"][dir="rtl"]) .d2l-tooltip-pointer,
			:host([_open-dir="bottom"][align="start"][dir="rtl"]) .d2l-tooltip-pointer {
				left: auto;
				right: ${contentHorizontalPadding + (pointerRotatedLength - pointerLength) / 2}px; /* needed for browsers that don't support min like Legacy-Edge */
				right: min(${contentHorizontalPadding + (pointerRotatedLength - pointerLength) / 2}px, calc(50% - ${pointerLength / 2}px));
			}

			:host([_open-dir="top"]) .d2l-tooltip-pointer {
				bottom: -${pointerOverhang}px;
				clip: rect(${pointerOverhang + contentBorderSize}px, 21px, 22px, -3px);
			}

			:host([_open-dir="bottom"]) .d2l-tooltip-pointer {
				clip: rect(-5px, 21px, ${pointerOverhang + contentBorderSize}px, -7px);
				top: -${pointerOverhang}px;
			}

			:host([_open-dir="left"]) .d2l-tooltip-pointer,
			:host([_open-dir="right"]) .d2l-tooltip-pointer {
				top: calc(50% - ${pointerLength / 2}px);
			}

			:host([_open-dir="left"]) .d2l-tooltip-pointer {
				clip: rect(-3px, 21px, 21px, ${pointerOverhang + contentBorderSize}px);
				right: -${pointerOverhang}px;
			}

			:host([_open-dir="right"]) .d2l-tooltip-pointer {
				clip: rect(-3px, ${pointerOverhang + contentBorderSize}px, 21px, -3px);
				left: -${pointerOverhang}px;
			}

			.d2l-tooltip-pointer > div {
				background-color: var(--d2l-tooltip-background-color);
				border: ${contentBorderSize}px solid var(--d2l-tooltip-border-color);
				border-radius: 0.1rem;
				box-sizing: border-box;
				height: ${pointerLength}px;
				left: -1px;
				position: absolute;
				top: -1px;
				-webkit-transform: rotate(45deg);
				transform: rotate(45deg);
				width: ${pointerLength}px;
			}

			:host([_open-dir="top"]) .d2l-tooltip-pointer-outline {
				clip: rect(${pointerOverhang + contentBorderSize + outlineSize * 2}px, 21px, 22px, -3px);
			}

			:host([_open-dir="bottom"]) .d2l-tooltip-pointer-outline {
				clip: rect(-4px, 21px, ${pointerOverhang + contentBorderSize - outlineSize * 2}px, -7px);
			}

			:host([_open-dir="left"]) .d2l-tooltip-pointer-outline {
				clip: rect(-3px, 21px, 21px, ${pointerOverhang + contentBorderSize + outlineSize * 2}px);
			}

			:host([_open-dir="right"]) .d2l-tooltip-pointer-outline {
				clip: rect(-3px, ${pointerOverhang + contentBorderSize - outlineSize * 2}px, 21px, -4px);
			}

			.d2l-tooltip-pointer-outline > div {
				outline: ${outlineSize}px solid var(--d2l-tooltip-outline-color);
			}

			.d2l-tooltip-position {
				display: inline-block;
				height: 0;
				position: absolute;
				width: 17.5rem;
			}

			:host([_open-dir="left"]) .d2l-tooltip-position {
				right: 100%;
			}
			:host([_open-dir="right"][dir="rtl"]) .d2l-tooltip-position {
				left: 100%;
			}

			.d2l-tooltip-content {
				background-color: var(--d2l-tooltip-background-color);
				border: ${contentBorderSize}px solid var(--d2l-tooltip-border-color);
				border-radius: ${contentBorderRadius}px;
				box-sizing: border-box;
				max-width: 17.5rem;
				min-height: 2.1rem;
				min-width: 2.1rem;
				outline: ${outlineSize}px solid var(--d2l-tooltip-outline-color);
				overflow: hidden;
				padding: ${11 - contentBorderSize}px ${contentHorizontalPadding - contentBorderSize}px;
				position: absolute;
			}

			/* increase specificty for Legacy-Edge so the d2l-body-small color doesn't override it */
			.d2l-tooltip-content.d2l-tooltip-content {
				color: inherit;
			}

			:host([_open-dir="top"]) .d2l-tooltip-content {
				bottom: 100%;
			}
			:host([_open-dir="left"]) .d2l-tooltip-content {
				right: 0;
			}
			:host([_open-dir="right"][dir="rtl"]) .d2l-tooltip-content {
				left: 0;
			}

			.d2l-tooltip-container {
				height: 100%;
				width: 100%;
			}

			:host([_open-dir="bottom"]) .d2l-tooltip-container {
				-webkit-animation: d2l-tooltip-bottom-animation 200ms ease;
				animation: d2l-tooltip-bottom-animation 200ms ease;
			}

			:host([_open-dir="top"]) .d2l-tooltip-container {
				-webkit-animation: d2l-tooltip-top-animation 200ms ease;
				animation: d2l-tooltip-top-animation 200ms ease;
			}

			:host([_open-dir="left"]) .d2l-tooltip-container {
				-webkit-animation: d2l-tooltip-left-animation 200ms ease;
				animation: d2l-tooltip-left-animation 200ms ease;
			}

			:host([_open-dir="right"]) .d2l-tooltip-container {
				-webkit-animation: d2l-tooltip-right-animation 200ms ease;
				animation: d2l-tooltip-right-animation 200ms ease;
			}

			::slotted(ul),
			::slotted(ol) {
				padding-left: 1rem;
			}

			:host([dir="rtl"]) ::slotted(ul),
			:host([dir="rtl"]) ::slotted(ol) {
				padding-left: 0;
				padding-right: 1rem;
			}

			@media (prefers-reduced-motion: reduce) {
				:host([_open-dir="bottom"]) .d2l-tooltip-container,
				:host([_open-dir="top"]) .d2l-tooltip-container,
				:host([_open-dir="left"]) .d2l-tooltip-container,
				:host([_open-dir="right"]) .d2l-tooltip-container {
					-webkit-animation: none;
					animation: none;
				}
			}

			@keyframes d2l-tooltip-top-animation {
				0% { opacity: 0; transform: translate(0, -10px); }
				100% { opacity: 1; transform: translate(0, 0); }
			}
			@keyframes d2l-tooltip-bottom-animation {
				0% { opacity: 0; transform: translate(0, 10px); }
				100% { opacity: 1; transform: translate(0, 0); }
			}
			@keyframes d2l-tooltip-left-animation {
				0% { opacity: 0; transform: translate(-10px, 0); }
				100% { opacity: 1; transform: translate(0, 0); }
			}
			@keyframes d2l-tooltip-right-animation {
				0% { opacity: 0; transform: translate(10px, 0); }
				100% { opacity: 1; transform: translate(0, 0); }
			}

			@media (max-width: 615px) {
				.d2l-tooltip-content {
					padding-bottom: ${12 - contentBorderSize}px;
					padding-top: ${12 - contentBorderSize}px;
				}
			}
		`];
	}

	constructor() {
		super();

		this._onTargetBlur = this._onTargetBlur.bind(this);
		this._onTargetFocus = this._onTargetFocus.bind(this);
		this._onTargetMouseEnter = this._onTargetMouseEnter.bind(this);
		this._onTargetMouseLeave = this._onTargetMouseLeave.bind(this);
		this._onTargetResize = this._onTargetResize.bind(this);
		this._onTargetClick = this._onTargetClick.bind(this);
		this._onTargetTouchStart = this._onTargetTouchStart.bind(this);
		this._onTargetTouchEnd = this._onTargetTouchEnd.bind(this);

		this.announced = false;
		this.closeOnClick = false;
		this.delay = 300;
		this.disableFocusLock = false;
		this.forceShow = false;
		this.forType = 'descriptor';
		this.offset = pointerRotatedOverhang + pointerGap;
		this.showTruncatedOnly = false;
		this.state = 'info';

		this._dismissibleId = null;
		this._isFocusing = false;
		this._isHovering = false;
		this._resizeRunSinceTruncationCheck = false;
		this._viewportMargin = defaultViewportMargin;
	}

	/** @ignore */
	get showing() {
		return this._showing;
	}
	set showing(val) {
		const oldVal = this._showing;
		if (oldVal !== val) {
			this._showing = val;
			this.requestUpdate('showing', oldVal);
			this._showingChanged(val, oldVal !== undefined); // don't dispatch hide event when initializing
		}
	}

	connectedCallback() {
		super.connectedCallback();
		this.showing = false;
		window.addEventListener('resize', this._onTargetResize);

		requestAnimationFrame(() => {
			this._updateTarget();
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (activeTooltip === this) activeTooltip = null;
		this._removeListeners();
		window.removeEventListener('resize', this._onTargetResize);
		clearDismissible(this._dismissibleId);
		delayTimeoutId = null;
		this._dismissibleId = null;
		if (this._target) {
			elemIdListRemove(this._target, 'aria-labelledby', this.id);
			elemIdListRemove(this._target, 'aria-describedby', this.id);
		}
	}

	render() {
		const tooltipPositionStyle = {
			maxWidth: this._maxWidth ? `${this._maxWidth}px` : null
		};
		if (this._tooltipShift !== undefined) {
			if (this._isAboveOrBelow()) {
				const isRtl = this.getAttribute('dir') === 'rtl';
				tooltipPositionStyle.left = !isRtl ? `${this._tooltipShift}px` : null;
				tooltipPositionStyle.right = !isRtl ? null : `${this._tooltipShift}px`;
			} else {
				tooltipPositionStyle.top = `${this._tooltipShift}px`;
			}
		}

		const contentClasses = {
			'd2l-tooltip-content': true,
			'd2l-body-small': true,
			'vdiff-target': this.showing
		};

		// Note: role="text" is a workaround for Safari. Otherwise, list-item content is not announced with VoiceOver
		return html`
			<div class="d2l-tooltip-container">
				<div class="d2l-tooltip-position" style=${styleMap(tooltipPositionStyle)}>
					<div class="${classMap(contentClasses)}">
						<div role="text">
							<slot></slot>
						</div>
					</div>
				</div>
				<div class="d2l-tooltip-pointer d2l-tooltip-pointer-outline">
					<div></div>
				</div>
				<div class="d2l-tooltip-pointer">
					<div></div>
				</div>
			</div>`
		;
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		changedProperties.forEach((_, prop) => {
			if (prop === 'for') {
				this._updateTarget();
			} else if (prop === 'forceShow') {
				this._updateShowing();
			}
		});
	}

	async getUpdateComplete() {
		const fontsPromise = document.fonts ? document.fonts.ready : Promise.resolve();
		await super.getUpdateComplete();
		/* wait for the fonts to load because browsers have a font block period
		where they will render an invisible fallback font face that may result in
		improper width calculations before the real font is loaded */
		await fontsPromise;
	}

	hide() {
		this._isHovering = false;
		this._isFocusing = false;
		this._updateShowing();
	}

	show() {
		this.showing = true;
	}

	async updatePosition() {

		if (!this._target) {
			return;
		}

		const offsetParent = getOffsetParent(this);
		const targetRect = this._target.getBoundingClientRect();
		const spaceAround = this._computeSpaceAround(offsetParent, targetRect);

		// Compute the size of the spaces above, below, left and right and find which space to fit the tooltip in
		const content = this._getContent();
		const spaces = this._computeAvailableSpaces(targetRect, spaceAround);
		const space = await this._fitContentToSpace(content, spaces);

		const contentRect = content.getBoundingClientRect();
		// + 1 because scrollWidth does not give sub-pixel measurements and half a pixel may cause text to unexpectedly wrap
		this._maxWidth = Math.min(content.scrollWidth + 2 * contentBorderSize, 350) + 1;
		this._openDir = space.dir;

		// Compute the x and y position of the tooltip relative to its target
		let parentTop;
		let parentLeft;
		if (offsetParent && offsetParent.tagName !== 'BODY') {
			const parentRect = offsetParent.getBoundingClientRect();
			parentTop = parentRect.top + offsetParent.clientTop;
			parentLeft = parentRect.left + offsetParent.clientLeft;
		} else {
			parentTop = -document.documentElement.scrollTop;
			parentLeft = -document.documentElement.scrollLeft;
		}
		const top = targetRect.top - parentTop;
		const left = targetRect.left - parentLeft;

		let positionRect;
		if (this._isAboveOrBelow()) {
			positionRect = {
				left,
				top: this._openDir === 'top' ? top - this.offset : top + targetRect.height + this.offset,
				width: targetRect.width,
				height: 0,
			};
		} else {
			positionRect = {
				left: this._openDir === 'left' ? left - this.offset : left + targetRect.width + this.offset,
				top,
				height: targetRect.height,
				width: 0,
			};
		}

		// Compute how much the tooltip is shifted relative to its pointer
		if (this._isAboveOrBelow() && (this.align === 'start' || this.align === 'end')) {
			const shift = Math.min((targetRect.width / 2) - (contentHorizontalPadding + pointerRotatedLength / 2), 0);
			if (this.align === 'start') {
				this._tooltipShift = shift;
			} else {
				this._tooltipShift = targetRect.width - this._maxWidth - shift;
			}
		} else {
			let spaceLeft, spaceRight, centerDelta, maxShift, minShift;
			if (this._isAboveOrBelow()) {
				const isRtl = this.getAttribute('dir') === 'rtl';
				spaceLeft = !isRtl ? spaceAround.left : spaceAround.right;
				spaceRight = !isRtl ? spaceAround.right : spaceAround.left;
				centerDelta = this._maxWidth - targetRect.width;
				maxShift = targetRect.width / 2;
				minShift = maxShift - this._maxWidth;
			} else {
				spaceLeft = spaceAround.above;
				spaceRight = spaceAround.below;
				centerDelta = contentRect.height - targetRect.height;
				maxShift = targetRect.height / 2;
				minShift = maxShift - contentRect.height;
			}
			const shift = computeTooltipShift(centerDelta, spaceLeft, spaceRight);
			const shiftMargin = (pointerRotatedLength / 2) + contentBorderRadius;
			this._tooltipShift = Math.min(Math.max(shift, minShift + shiftMargin), maxShift - shiftMargin);
		}
		this.style.left = `${positionRect.left}px`;
		this.style.top = `${positionRect.top}px`;
		this.style.width = `${positionRect.width}px`;
		this.style.height = `${positionRect.height}px`;
	}

	_addListeners() {
		if (!this._target) {
			return;
		}
		this._target.addEventListener('mouseenter', this._onTargetMouseEnter);
		this._target.addEventListener('mouseleave', this._onTargetMouseLeave);
		this._target.addEventListener('focus', this._onTargetFocus);
		this._target.addEventListener('blur', this._onTargetBlur);
		this._target.addEventListener('click', this._onTargetClick);
		this._target.addEventListener('touchstart', this._onTargetTouchStart, { passive: true });
		this._target.addEventListener('touchcancel', this._onTargetTouchEnd);
		this._target.addEventListener('touchend', this._onTargetTouchEnd);

		this._targetSizeObserver = new ResizeObserver(this._onTargetResize);
		this._targetSizeObserver.observe(this._target);
	}

	_computeAvailableSpaces(targetRect, spaceAround) {
		const verticalWidth = Math.max(spaceAround.left + targetRect.width + spaceAround.right, 0);
		const horizontalHeight = Math.max(spaceAround.above + targetRect.height + spaceAround.below, 0);
		const spaces = [
			{ dir: 'bottom', width: verticalWidth, height: Math.max(spaceAround.below - this.offset, 0) },
			{ dir: 'top', width: verticalWidth, height: Math.max(spaceAround.above - this.offset, 0) },
			{ dir: 'right', width: Math.max(spaceAround.right - this.offset, 0), height: horizontalHeight },
			{ dir: 'left', width: Math.max(spaceAround.left - this.offset, 0), height: horizontalHeight }
		];
		if (this.getAttribute('dir') === 'rtl') {
			const tmp = spaces[2];
			spaces[2] = spaces[3];
			spaces[3] = tmp;
		}
		return spaces;
	}

	_computeSpaceAround(offsetParent, targetRect) {

		const boundingContainer = getBoundingAncestor(this);
		const bounded = (boundingContainer !== document.documentElement);
		const boundingContainerRect = boundingContainer.getBoundingClientRect();

		const spaceAround = (bounded ? {
			above: targetRect.top - boundingContainerRect.top - this._viewportMargin,
			below: boundingContainerRect.bottom - targetRect.bottom - this._viewportMargin,
			left: targetRect.left - boundingContainerRect.left - this._viewportMargin,
			right: boundingContainerRect.right - targetRect.right - this._viewportMargin
		} : {
			above: targetRect.top - this._viewportMargin,
			below: window.innerHeight - targetRect.bottom - this._viewportMargin,
			left: targetRect.left - this._viewportMargin,
			right: document.documentElement.clientWidth - targetRect.right - this._viewportMargin
		});

		if (this.boundary && offsetParent) {
			const parentRect = offsetParent.getBoundingClientRect();
			if (!isNaN(this.boundary.left)) {
				spaceAround.left = Math.min(targetRect.left - parentRect.left - this.boundary.left, spaceAround.left);
			}
			if (!isNaN(this.boundary.right)) {
				spaceAround.right = Math.min(parentRect.right - targetRect.right - this.boundary.right, spaceAround.right);
			}
			if (!isNaN(this.boundary.top)) {
				spaceAround.above = Math.min(targetRect.top - parentRect.top - this.boundary.top, spaceAround.above);
			}
			if (!isNaN(this.boundary.bottom)) {
				spaceAround.below = Math.min(parentRect.bottom - targetRect.bottom - this.boundary.bottom, spaceAround.below);
			}
		}
		const isRTL = this.getAttribute('dir') === 'rtl';
		if ((this.align === 'start' && !isRTL) || (this.align === 'end' && isRTL)) {
			spaceAround.left = 0;
		} else if ((this.align === 'start' && isRTL) || (this.align === 'end' && !isRTL)) {
			spaceAround.right = 0;
		}
		return spaceAround;
	}

	_findTarget() {
		const ownerRoot = this.getRootNode();

		let target;
		if (this.for) {
			const targetSelector = `#${cssEscape(this.for)}`;
			target = ownerRoot.querySelector(targetSelector);
			target = target || (ownerRoot && ownerRoot.host && ownerRoot.host.querySelector(targetSelector));
		} else {
			const parentNode = this.parentNode;
			target = parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? ownerRoot.host : parentNode;
		}
		return target;
	}

	async _fitByBestFit(content, spaces) {
		for (let i = 0; i < spaces.length; ++i) {
			const space = spaces[i];
			this._maxWidth = space.width;
			await this.updateComplete;

			if (content.scrollWidth + 2 * contentBorderSize <= space.width && content.scrollHeight + 2 * contentBorderSize <= space.height) {
				return space;
			}
		}
		return undefined;
	}

	async _fitByLargestSpace(spaces) {
		let largest = spaces[0];
		for (let i = 1; i < spaces.length; ++i) {
			const space = spaces[i];
			if (space.width * space.height > largest.width * largest.height) {
				largest = space;
			}
		}
		this._maxWidth = largest.width;
		await this.updateComplete;
		return largest;
	}

	async _fitByManualPosition(spaces) {
		const space = spaces.filter(space => space.dir === this.position)[0];
		if (!space) {
			return undefined;
		}
		this._maxWidth = space.width;
		await this.updateComplete;
		return space;
	}

	async _fitContentToSpace(content, spaces) {
		// Legacy manual positioning based on the position attribute to allow for backwards compatibility
		let space = await this._fitByManualPosition(spaces);
		if (space) {
			return space;
		}
		space = await this._fitByBestFit(content, spaces);
		if (space) {
			return space;
		}
		return this._fitByLargestSpace(spaces);
	}

	_getContent() {
		return this.shadowRoot && this.shadowRoot.querySelector('.d2l-tooltip-content');
	}

	_isAboveOrBelow() {
		return this._openDir === 'bottom' || this._openDir === 'top';
	}

	_isInteractive(ele) {
		if (!isFocusable(ele, true, false, true)) {
			return false;
		}
		if (ele.nodeType !== Node.ELEMENT_NODE) {
			return false;
		}
		const nodeName = ele.nodeName.toLowerCase();
		const isInteractive = interactiveElements[nodeName];
		if (isInteractive) {
			return true;
		}
		const role = (ele.getAttribute('role') || '');
		return (nodeName === 'a' && ele.hasAttribute('href')) || interactiveRoles[role];
	}

	_onTargetBlur() {
		this._isFocusing = false;
		this._updateShowing();
	}

	_onTargetClick() {
		if (this.closeOnClick) {
			this.hide();
		}
	}

	async _onTargetFocus() {
		if (this.showTruncatedOnly) {
			await this._updateTruncating();
			if (!this._truncating) return;
		}

		if (this.disableFocusLock) {
			this.showing = true;
		} else {
			this._isFocusing = true;
			this._updateShowing();
		}
	}

	_onTargetMouseEnter() {
		this._hoverTimeout = setTimeout(async() => {
			if (this.showTruncatedOnly) {
				await this._updateTruncating();
				if (!this._truncating) return;
			}

			resetDelayTimeout();
			this._isHovering = true;
			this._updateShowing();
		}, getDelay(this.delay));
	}

	_onTargetMouseLeave() {
		clearTimeout(this._hoverTimeout);
		this._isHovering = false;
		this._updateShowing();
	}

	_onTargetResize() {
		this._resizeRunSinceTruncationCheck = true;
		if (!this.showing) {
			return;
		}
		this.updatePosition();
	}

	_onTargetTouchEnd() {
		clearTimeout(this._longPressTimeout);
	}

	_onTargetTouchStart() {
		this._longPressTimeout = setTimeout(() => {
			this._target.focus();
		}, 500);
	}

	_removeListeners() {
		if (!this._target) {
			return;
		}
		this._target.removeEventListener('mouseenter', this._onTargetMouseEnter);
		this._target.removeEventListener('mouseleave', this._onTargetMouseLeave);
		this._target.removeEventListener('focus', this._onTargetFocus);
		this._target.removeEventListener('blur', this._onTargetBlur);
		this._target.removeEventListener('click', this._onTargetClick);
		this._target.removeEventListener('touchstart', this._onTargetTouchStart);
		this._target.removeEventListener('touchcancel', this._onTargetTouchEnd);
		this._target.removeEventListener('touchend', this._onTargetTouchEnd);

		if (this._targetSizeObserver) {
			this._targetSizeObserver.disconnect();
			this._targetSizeObserver = null;
		}
	}

	async _showingChanged(newValue, dispatch) {
		clearTimeout(this._hoverTimeout);
		clearTimeout(this._longPressTimeout);
		if (newValue) {
			if (!this.forceShow) {
				if (activeTooltip) activeTooltip.hide();
				activeTooltip = this;
			}

			this._dismissibleId = setDismissible(() => this.hide());
			this.setAttribute('aria-hidden', 'false');
			await this.updateComplete;
			await this.updatePosition();
			if (dispatch) {
				this.dispatchEvent(new CustomEvent(
					'd2l-tooltip-show', { bubbles: true, composed: true }
				));
			}

			if (this.announced && !this._isInteractive(this._target)) announce(this.innerText);
		} else {
			if (activeTooltip === this) activeTooltip = null;

			this.setAttribute('aria-hidden', 'true');
			if (this._dismissibleId) {
				clearDismissible(this._dismissibleId);
				this._dismissibleId = null;
			}
			if (dispatch) {
				this.dispatchEvent(new CustomEvent(
					'd2l-tooltip-hide', { bubbles: true, composed: true }
				));
			}
		}
	}

	_updateShowing() {
		this.showing = this._isFocusing || this._isHovering || this.forceShow;
	}

	_updateTarget() {
		this._removeListeners();
		this._target = this._findTarget();
		if (this._target) {
			const isInteractive = this._isInteractive(this._target);
			this.id = this.id || getUniqueId();
			this.setAttribute('role', 'tooltip');
			if (this.forType === 'label') {
				elemIdListAdd(this._target, 'aria-labelledby', this.id);
			} else if (!this.announced || isInteractive) {
				elemIdListAdd(this._target, 'aria-describedby', this.id);
			}
			if (logAccessibilityWarning && !isInteractive && !this.announced) {
				console.warn(
					'd2l-tooltip may be being used in a non-accessible manner; it should be attached to interactive elements like \'a\', \'button\',' +
					'\'input\'', '\'select\', \'textarea\' or static / custom elements if a role has been set and the element is focusable.'
				);
				logAccessibilityWarning = false;
			}
			if (this.showing) {
				this.updatePosition();
			} else if (this.getRootNode().activeElement === this._target) {
				this._onTargetFocus();
			}
		}
		this._addListeners();
	}

	/**
	 * This solution appends a clone of the target to the target in order to retain target styles.
	 * A possible consequence of this is unexpected behaviours for web components that have slots.
	 * If this becomes an issue, it would also likely be possible to append the clone to document.body
	 * and get the expected styles through getComputedStyle.
	 */
	async _updateTruncating() {
		// if no resize has happened since truncation was previously calculated the result will not have changed
		if (!this._resizeRunSinceTruncationCheck || !this.showTruncatedOnly) return;

		const target = this._target;
		const cloneContainer = document.createElement('div');
		cloneContainer.style.position = 'absolute';
		cloneContainer.style.overflow = 'hidden';
		cloneContainer.style.whiteSpace = 'nowrap';
		cloneContainer.style.width = '1px';

		if (this.getAttribute('dir') === 'rtl') {
			cloneContainer.style.right = '-10000px';
		} else {
			cloneContainer.style.left = '-10000px';
		}

		const clone = target.cloneNode(true);
		clone.removeAttribute('id');
		clone.style.maxWidth = 'none';
		clone.style.display = 'inline-block';

		cloneContainer.appendChild(clone);
		target.appendChild(cloneContainer);
		await this.updateComplete;

		this._truncating = clone.scrollWidth > target.offsetWidth;
		this._resizeRunSinceTruncationCheck = false;
		target.removeChild(cloneContainer);
	}
}
customElements.define('d2l-tooltip', Tooltip);
