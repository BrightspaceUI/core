import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { css, html, LitElement } from 'lit';
import { cssEscape, elemIdListAdd, elemIdListRemove, getBoundingAncestor, getOffsetParent, isComposedAncestor } from '../../helpers/dom.js';
import { getComposedActiveElement, isFocusable } from '../../helpers/focus.js';
import { interactiveElements, interactiveRoles, isInteractive } from '../../helpers/interactive.js';
import { announce } from '../../helpers/announce.js';
import { bodySmallStyles } from '../typography/styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { getFlag } from '../../helpers/flags.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { PopoverMixin } from '../popover/popover-mixin.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

const usePopoverMixin = getFlag('GAUD-7355-tooltip-popover', false);
const useMutationObserver = getFlag('GAUD-8203-tooltip-mutation-observer', true);

const contentBorderSize = 1;
const contentHorizontalPadding = 15;

const tooltipInteractiveElements = {
	...interactiveElements,
	'h1': true,
	'h2': true,
	'h3': true,
	'h4': true,
	'h5': true,
	'h6': true
};

const tooltipInteractiveRoles = {
	...interactiveRoles,
	'heading': true,
	'img': true
};

const isInteractiveTarget = (elem) => {
	if (elem.nodeType !== Node.ELEMENT_NODE) return false;
	if (!isFocusable(elem, true, false, true)) return false;

	return isInteractive(elem, tooltipInteractiveElements, tooltipInteractiveRoles);
};

// once a user closes a tooltip, ignore delay if they hover adjacent target within this timeout
let delayTimeoutId;
const resetDelayTimeout = () => {
	if (delayTimeoutId) clearTimeout(delayTimeoutId);
	delayTimeoutId = setTimeout(() => delayTimeoutId = null, 1000);
};
// ignore delay if user hovers adjacent target when a tooltip is already open
const getDelay = delay => {
	if (delayTimeoutId) return 0;
	else return delay;
};

let logAccessibilityWarning = true;

// only one tooltip is to be shown at once - track the active tooltip so it can be hidden if necessary
let activeTooltip = null;

if (usePopoverMixin) {

	/**
	 * A component used to display additional information when users focus or hover on a point of interest.
	 * @slot - Default content placed inside of the tooltip
	 * @fires d2l-tooltip-show - Dispatched when the tooltip is opened
	 * @fires d2l-tooltip-hide - Dispatched when the tooltip is closed
	 */
	class Tooltip extends PopoverMixin(LitElement) {

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
				offset: { type: Number },
				/**
				 * ADVANCED: Force the tooltip to open in a certain direction. If no position is provided, the tooltip will open in the first position that has enough space for it in the order: bottom, top, right, left.
				 * @type {'top'|'bottom'|'left'|'right'}
				 */
				positionLocation: { type: String, attribute: 'position' },
				/**
				 * @ignore
				 */
				showing: { type: Boolean, reflect: true },
				/**
				 * ADVANCED: Only show the tooltip if we detect the target element is truncated
				 * @type {boolean}
				 */
				showTruncatedOnly: { type: Boolean, attribute: 'show-truncated-only' },
				/**
				 * The style of the tooltip based on the type of information it displays
				 * @type {'info'|'error'}
				 */
				state: { type: String, reflect: true }
			};
		}

		static get styles() {
			return [super.styles, bodySmallStyles, css`
				:host {
					--d2l-tooltip-background-color: var(--d2l-color-ferrite); /* Deprecated, use state attribute instead */
					--d2l-tooltip-border-color: var(--d2l-color-ferrite); /* Deprecated, use state attribute instead */
					--d2l-tooltip-outline-color: rgba(255, 255, 255, 0.32);
					--d2l-popover-background-color: var(--d2l-tooltip-background-color);
					--d2l-popover-border-color: var(--d2l-tooltip-outline-color);
					--d2l-popover-border-radius: 0.3rem;
				}
				:host([state="error"]) {
					--d2l-tooltip-background-color: var(--d2l-color-cinnabar);
					--d2l-tooltip-border-color: var(--d2l-color-cinnabar);
				}
				.d2l-tooltip-content {
					box-sizing: border-box;
					color: white;
					max-width: 17.5rem;
					min-height: 1.95rem;
					min-width: 2.1rem;
					overflow: hidden;
					overflow-wrap: anywhere;
					padding-block: ${10 - contentBorderSize}px ${11 - contentBorderSize}px;
					padding-inline: ${contentHorizontalPadding - contentBorderSize}px;
				}
				::slotted(ul),
				::slotted(ol) {
					padding-inline-start: 1rem;
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
			this.announced = false;
			this.closeOnClick = false;
			this.delay = 300;
			this.disableFocusLock = false;
			this.forceShow = false;
			this.forType = 'descriptor';
			this.offset = 10;
			this.showTruncatedOnly = false;
			this.state = 'info';

			this.#handleTargetBlurBound = this.#handleTargetBlur.bind(this);
			this.#handleTargetClickBound = this.#handleTargetClick.bind(this);
			this.#handleTargetFocusBound = this.#handleTargetFocus.bind(this);
			this.#handleTargetMouseEnterBound = this.#handleTargetMouseEnter.bind(this);
			this.#handleTargetMouseLeaveBound = this.#handleTargetMouseLeave.bind(this);
			this.#handleTargetMutationBound = this.#handleTargetMutation.bind(this);
			this.#handleTargetResizeBound = this.#handleTargetResize.bind(this);
			this.#handleTargetTouchEndBound = this.#handleTargetTouchEnd.bind(this);
			this.#handleTargetTouchStartBound = this.#handleTargetTouchStart.bind(this);
		}

		/** @ignore */
		get showing() {
			return this.#showing;
		}
		set showing(val) {
			const oldVal = this.#showing;
			if (oldVal !== val) {
				this.#showing = val;
				this.requestUpdate('showing', oldVal);
				this.#showingChanged(val, oldVal !== undefined); // don't dispatch hide event when initializing
			}
		}

		connectedCallback() {
			super.connectedCallback();
			this.showing = false;
			window.addEventListener('resize', this.#handleTargetResizeBound);

			requestAnimationFrame(() => this.#updateTarget());
		}

		disconnectedCallback() {
			super.disconnectedCallback();
			if (activeTooltip === this) activeTooltip = null;

			this.#removeListeners();
			window.removeEventListener('resize', this.#handleTargetResizeBound);

			clearDismissible(this.#dismissibleId);
			delayTimeoutId = null;
			this.#dismissibleId = null;

			if (this.#target) {
				elemIdListRemove(this.#target, 'aria-labelledby', this.id);
				elemIdListRemove(this.#target, 'aria-describedby', this.id);
			}
		}

		firstUpdated(changedProperties) {
			super.firstUpdated(changedProperties);
			this.addEventListener('mouseenter', this.#handleTooltipMouseEnter);
			this.addEventListener('mouseleave', this.#handleTooltipMouseLeave);
		}

		render() {
			const content = html`
				<div class="d2l-tooltip-content d2l-body-small" role="text">
					<slot></slot>
				</div>
			`;

			return this.renderPopover(content);
		}

		willUpdate(changedProperties) {
			super.willUpdate(changedProperties);

			if (changedProperties.has('align') || changedProperties.has('forceShow') || changedProperties.has('offset') || changedProperties.has('positionLocation')) {
				super.configure({
					noAutoClose: this.forceShow,
					offset: (this.offset !== undefined ? Number.parseInt(this.offset) : undefined),
					position: { location: this.#adaptPositionLocation(this.positionLocation), span: this.#adaptPositionSpan(this.align) },
				});
			}

			changedProperties.forEach((_, prop) => {
				if (prop === 'for') this.#updateTarget();
				else if (prop === 'forceShow') this.#updateShowing();
			});
		}

		hide() {
			this.#isHovering = false;
			this.#isFocusing = false;
			this.#updateShowing();
		}

		show() {
			this.showing = true;
		}

		#dismissibleId = null;
		#handleTargetBlurBound;
		#handleTargetClickBound;
		#handleTargetFocusBound;
		#handleTargetMouseEnterBound;
		#handleTargetMouseLeaveBound;
		#handleTargetMutationBound;
		#handleTargetResizeBound;
		#handleTargetTouchEndBound;
		#handleTargetTouchStartBound;
		#hoverTimeout;
		#isFocusing = false;
		#isHovering = false;
		#isHoveringTooltip = false;
		#isTruncating = false;
		#longPressTimeout;
		#mouseLeaveTimeout;
		#mouseLeftTooltip = false;
		#resizeRunSinceTruncationCheck = false;
		#showing;
		#target;
		#targetSizeObserver;
		#targetMutationObserver;

		#adaptPositionLocation(val) {
			switch (val) {
				case 'bottom': return 'block-end';
				case 'left': return 'inline-start';
				case 'right': return 'inline-end';
				case 'top': return 'block-start';
				default: return 'block-end';
			}
		}

		#adaptPositionSpan(val) {
			switch (val) {
				case 'start': return 'end';
				case 'end': return 'start';
				default: return 'all';
			}
		}

		#addListeners() {
			if (!this.#target) return;

			this.#target.addEventListener('mouseenter', this.#handleTargetMouseEnterBound);
			this.#target.addEventListener('mouseleave', this.#handleTargetMouseLeaveBound);
			this.#target.addEventListener('focus', this.#handleTargetFocusBound);
			this.#target.addEventListener('blur', this.#handleTargetBlurBound);
			this.#target.addEventListener('click', this.#handleTargetClickBound);
			this.#target.addEventListener('touchstart', this.#handleTargetTouchStartBound, { passive: true });
			this.#target.addEventListener('touchcancel', this.#handleTargetTouchEndBound);
			this.#target.addEventListener('touchend', this.#handleTargetTouchEndBound);

			this.#targetSizeObserver = new ResizeObserver(this.#handleTargetResizeBound);
			this.#targetSizeObserver.observe(this.#target);

			if (useMutationObserver) {
				this.#targetMutationObserver = new MutationObserver(this.#handleTargetMutationBound);
				this.#targetMutationObserver.observe(this.#target, { attributes: true, attributeFilter: ['id'] });
				this.#targetMutationObserver.observe(this.#target.parentNode, { childList: true });
			}
		}

		#findTarget() {
			const ownerRoot = this.getRootNode();

			let target;
			if (this.for) {
				const targetSelector = `#${cssEscape(this.for)}`;
				target = ownerRoot.querySelector(targetSelector);
				target = (target || ownerRoot?.host?.querySelector(targetSelector)) ?? null;
			} else {
				const parentNode = this.parentNode;
				target = parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? ownerRoot.host : parentNode;

				// reduce console pollution since Safari + VO prevents inadequate SR experience for tooltips during form validation when using 'for'
				if (!(target.tagName === 'D2L-INPUT-TEXT' && target?.invalid)) {
					console.warn('<d2l-tooltip>: missing required attribute "for"');
				}
			}
			return target;
		}

		#handleTargetBlur() {
			this.#isFocusing = false;
			this.#updateShowing();
		}

		#handleTargetClick() {
			if (this.closeOnClick) this.hide();
		}

		async #handleTargetFocus() {
			if (this.showTruncatedOnly) {
				await this.#updateTruncating();
				if (!this.#isTruncating) return;
			}

			if (this.disableFocusLock) {
				this.showing = true;
			} else {
				this.#isFocusing = true;
				this.#updateShowing();
			}
		}

		#handleTargetMouseEnter() {
			// came from tooltip so keep showing
			if (this.#mouseLeftTooltip) {
				this.#isHovering = true;
				return;
			}

			this.#hoverTimeout = setTimeout(async() => {
				if (this.showTruncatedOnly) {
					await this.#updateTruncating();
					if (!this.#isTruncating) return;
				}

				this.#isHovering = true;
				this.#updateShowing();
			}, getDelay(this.delay));
		}

		#handleTargetMouseLeave() {
			clearTimeout(this.#hoverTimeout);
			this.#isHovering = false;
			if (this.showing) resetDelayTimeout();
			setTimeout(() => this.#updateShowing(), 100); // delay to allow for mouseenter to fire if hovering on tooltip
		}

		#handleTargetMutation([m]) {
			if (!this.#target.isConnected || (m.target === this.#target && m.attributeName === 'id')) {
				this.#targetMutationObserver.disconnect();
				this._updateTarget();
			}
		}

		#handleTargetResize() {
			this.#resizeRunSinceTruncationCheck = true;
			if (!this.showing) return;
			super.position();
		}

		#handleTargetTouchEnd() {
			clearTimeout(this.#longPressTimeout);
		}

		#handleTargetTouchStart() {
			this.#longPressTimeout = setTimeout(() => {
				this.#target.focus();
			}, 500);
		}

		#handleTooltipMouseEnter() {
			if (!this.showing) return;
			this.#isHoveringTooltip = true;
			this.#updateShowing();
		}

		#handleTooltipMouseLeave() {
			clearTimeout(this.#mouseLeaveTimeout);

			this.#isHoveringTooltip = false;
			this.#mouseLeftTooltip = true;
			resetDelayTimeout();

			this.#mouseLeaveTimeout = setTimeout(() => {
				this.#mouseLeftTooltip = false;
				this.#updateShowing();
			}, 100); // delay to allow for mouseenter to fire if hovering on target
		}

		#removeListeners() {
			if (!this.#target) return;

			this.#target.removeEventListener('mouseenter', this.#handleTargetMouseEnterBound);
			this.#target.removeEventListener('mouseleave', this.#handleTargetMouseLeaveBound);
			this.#target.removeEventListener('focus', this.#handleTargetFocusBound);
			this.#target.removeEventListener('blur', this.#handleTargetBlurBound);
			this.#target.removeEventListener('click', this.#handleTargetClickBound);
			this.#target.removeEventListener('touchstart', this.#handleTargetTouchStartBound);
			this.#target.removeEventListener('touchcancel', this.#handleTargetTouchEndBound);
			this.#target.removeEventListener('touchend', this.#handleTargetTouchEndBound);

			if (this.#targetSizeObserver) {
				this.#targetSizeObserver.disconnect();
				this.#targetSizeObserver = null;
			}

			if (this.#targetMutationObserver) {
				this.#targetMutationObserver.disconnect();
				this.#targetMutationObserver = null;
			}
		}

		async #showingChanged(newValue, dispatch) {
			clearTimeout(this.#hoverTimeout);
			clearTimeout(this.#longPressTimeout);

			if (newValue) {
				if (!this.forceShow) {
					if (activeTooltip) activeTooltip.hide();
					activeTooltip = this;
				}

				this.#dismissibleId = setDismissible(() => this.hide());
				this.setAttribute('aria-hidden', 'false');
				await this.updateComplete;

				super.open(this.#target, false);

				if (dispatch) {
					this.dispatchEvent(new CustomEvent('d2l-tooltip-show', { bubbles: true, composed: true }));
				}

				if (this.announced && !isInteractiveTarget(this.#target)) announce(this.innerText);
			} else {
				if (activeTooltip === this) activeTooltip = null;

				this.setAttribute('aria-hidden', 'true');
				if (this.#dismissibleId) {
					clearDismissible(this.#dismissibleId);
					this.#dismissibleId = null;
				}

				super.close();

				if (dispatch) {
					this.dispatchEvent(new CustomEvent('d2l-tooltip-hide', { bubbles: true, composed: true }));
				}
			}
		}

		#updateShowing() {
			this.showing = this.#isFocusing || this.#isHovering || this.forceShow || this.#isHoveringTooltip;
		}

		#updateTarget() {

			if (!this.isConnected) return;

			const newTarget = this.#findTarget();
			if (this.#target === newTarget) return;

			this.#removeListeners();
			this.#target = newTarget;

			if (this.#target) {
				const targetDisabled = this.#target.hasAttribute('disabled') || this.#target.getAttribute('aria-disabled') === 'true';

				const isTargetInteractive = isInteractiveTarget(this.#target);
				this.id = this.id || getUniqueId();
				this.setAttribute('role', 'tooltip');

				if (this.forType === 'label') {
					elemIdListAdd(this.#target, 'aria-labelledby', this.id);
				} else if (!this.announced || isTargetInteractive) {
					elemIdListAdd(this.#target, 'aria-describedby', this.id);
				}

				if (logAccessibilityWarning && !isTargetInteractive && !this.announced) {
					console.warn(
						'd2l-tooltip may be being used in a non-accessible manner; it should be attached to interactive elements like \'a\', \'button\',' +
						'\'input\'', '\'select\', \'textarea\' or static / custom elements if a role has been set and the element is focusable.',
						this.#target
					);
					logAccessibilityWarning = false;
				}

				if (this.showing) {
					if (!super._opened) super.open(this.#target, false);
					else super.position();
				} else if (!targetDisabled && isComposedAncestor(this.#target, getComposedActiveElement())) {
					this.#handleTargetFocusBound();
				}
			}
			this.#addListeners();
		}

		/**
		 * This solution appends a clone of the target to the target in order to retain target styles.
		 * A possible consequence of this is unexpected behaviours for web components that have slots.
		 * If this becomes an issue, it would also likely be possible to append the clone to document.body
		 * and get the expected styles through getComputedStyle.
		 */
		async #updateTruncating() {
			// if no resize has happened since truncation was previously calculated the result will not have changed
			if (!this.#resizeRunSinceTruncationCheck || !this.showTruncatedOnly) return;

			const target = this.#target;
			const cloneContainer = document.createElement('div');
			cloneContainer.style.position = 'absolute';
			cloneContainer.style.overflow = 'hidden';
			cloneContainer.style.whiteSpace = 'nowrap';
			cloneContainer.style.width = '1px';
			cloneContainer.style.insetInlineStart = '-10000px';

			const clone = target.cloneNode(true);
			clone.removeAttribute('id');
			clone.style.maxWidth = 'none';
			clone.style.display = 'inline-block';

			cloneContainer.appendChild(clone);
			target.appendChild(cloneContainer);
			await this.updateComplete;

			// if the clone is a web component it needs to update to fill in any slots
			const customElem = customElements.get(clone.localName);
			if (customElem !== undefined) {
				clone.requestUpdate();
				await clone.updateComplete;
			}

			this.#isTruncating = (clone.scrollWidth - target.offsetWidth) > 2; // Safari adds 1px to scrollWidth necessitating a subtraction comparison.
			this.#resizeRunSinceTruncationCheck = false;
			target.removeChild(cloneContainer);
		}

	}
	customElements.define('d2l-tooltip', Tooltip);

} else {

	// Cleanup: GAUD-7355-tooltip-popover - remove this entire block and unused imports

	const pointerLength = 16;
	const pointerOverhang = 7; /* how far the pointer extends outside the content */

	/* rotated 45 degrees */
	const pointerRotatedLength = Math.SQRT2 * pointerLength;
	const pointerRotatedOverhang = ((pointerRotatedLength - pointerLength) / 2) + pointerOverhang;

	const pointerGap = 0; /* spacing between pointer and target */
	const defaultViewportMargin = 18;
	const contentBorderRadius = 6;
	const outlineSize = 1;

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
					min-height: 1.95rem;
					min-width: 2.1rem;
					outline: ${outlineSize}px solid var(--d2l-tooltip-outline-color);
					overflow: hidden;
					overflow-wrap: anywhere;
					padding-block: ${10 - contentBorderSize}px ${11 - contentBorderSize}px;
					padding-inline: ${contentHorizontalPadding - contentBorderSize}px;
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

				:host([_open-dir="bottom"][showing]) .d2l-tooltip-container {
					-webkit-animation: d2l-tooltip-bottom-animation 200ms ease;
					animation: d2l-tooltip-bottom-animation 200ms ease;
				}

				:host([_open-dir="top"][showing]) .d2l-tooltip-container {
					-webkit-animation: d2l-tooltip-top-animation 200ms ease;
					animation: d2l-tooltip-top-animation 200ms ease;
				}

				:host([_open-dir="left"][showing]) .d2l-tooltip-container {
					-webkit-animation: d2l-tooltip-left-animation 200ms ease;
					animation: d2l-tooltip-left-animation 200ms ease;
				}

				:host([_open-dir="right"][showing]) .d2l-tooltip-container {
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
					:host([_open-dir="bottom"][showing]) .d2l-tooltip-container,
					:host([_open-dir="top"][showing]) .d2l-tooltip-container,
					:host([_open-dir="left"][showing]) .d2l-tooltip-container,
					:host([_open-dir="right"][showing]) .d2l-tooltip-container {
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
			this._onTargetMutation = this._onTargetMutation.bind(this);
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

			this.#isHoveringTooltip = false;
			this.#mouseLeftTooltip = false;
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
				if (this.isConnected) {
					this._updateTarget();
				}
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

		async getUpdateComplete() {
			const fontsPromise = document.fonts ? document.fonts.ready : Promise.resolve();
			await super.getUpdateComplete();
			/* wait for the fonts to load because browsers have a font block period
			where they will render an invisible fallback font face that may result in
			improper width calculations before the real font is loaded */
			await fontsPromise;
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
						<div class="${classMap(contentClasses)}" @mouseenter="${this.#onTooltipMouseEnter}" @mouseleave="${this.#onTooltipMouseLeave}">
							<div role="text">
								<slot></slot>
							</div>
						</div>
					</div>
					<div class="d2l-tooltip-pointer d2l-tooltip-pointer-outline">
						<div></div>
					</div>
					<div class="d2l-tooltip-pointer" @mouseenter="${this.#onTooltipMouseEnter}" @mouseleave="${this.#onTooltipMouseLeave}">
						<div></div>
					</div>
				</div>`
			;
		}

		willUpdate(changedProperties) {
			super.willUpdate(changedProperties);

			if (changedProperties.has('for')) {
				this._updateTarget();
			}
			if (changedProperties.has('forceShow')) {
				this._updateShowing();
			}
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
			if (content === null) return;

			const spaces = this._computeAvailableSpaces(targetRect, spaceAround);
			const space = await this._fitContentToSpace(content, spaces);

			const contentRect = content.getBoundingClientRect();
			// + 1 because scrollWidth does not give sub-pixel measurements and half a pixel may cause text to unexpectedly wrap
			this._maxWidth = Math.min(content.scrollWidth + 2 * contentBorderSize, 350) + 1;
			this._openDir = space.dir;

			// Compute the x and y position of the tooltip relative to its target
			let offsetTop, offsetLeft;
			if (offsetParent && offsetParent.tagName !== 'BODY') {
				const offsetRect = offsetParent.getBoundingClientRect();
				offsetTop = offsetRect.top + offsetParent.clientTop - offsetParent.scrollTop;
				offsetLeft = offsetRect.left + offsetParent.clientLeft - offsetParent.scrollLeft;
			} else {
				offsetTop = -document.documentElement.scrollTop;
				offsetLeft = -document.documentElement.scrollLeft;
			}
			const top = targetRect.top - offsetTop;
			const left = targetRect.left - offsetLeft;

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

		#isHoveringTooltip;
		#mouseLeftTooltip;

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

			if (useMutationObserver) {
				this._targetMutationObserver = new MutationObserver(this._onTargetMutation);
				this._targetMutationObserver.observe(this._target, { attributes: true, attributeFilter: ['id'] });
				this._targetMutationObserver.observe(this._target.parentNode, { childList: true });
			}
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
				const offsetRect = offsetParent.getBoundingClientRect();
				if (!isNaN(this.boundary.left)) {
					spaceAround.left = Math.min(targetRect.left - offsetRect.left - this.boundary.left, spaceAround.left);
				}
				if (!isNaN(this.boundary.right)) {
					spaceAround.right = Math.min(offsetRect.right - targetRect.right - this.boundary.right, spaceAround.right);
				}
				if (!isNaN(this.boundary.top)) {
					spaceAround.above = Math.min(targetRect.top - offsetRect.top - this.boundary.top, spaceAround.above);
				}
				if (!isNaN(this.boundary.bottom)) {
					spaceAround.below = Math.min(offsetRect.bottom - targetRect.bottom - this.boundary.bottom, spaceAround.below);
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
				target = (target || ownerRoot?.host?.querySelector(targetSelector)) ?? null;
			} else {
				const parentNode = this.parentNode;
				target = parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? ownerRoot.host : parentNode;

				// reduce console pollution since Safari + VO prevents inadequate SR experience for tooltips during form validation when using 'for'
				if (!(target.tagName === 'D2L-INPUT-TEXT' && target?.invalid)) {
					console.warn('<d2l-tooltip>: missing required attribute "for"');
				}
			}
			return target;
		}

		async _fitByBestFit(content, spaces) {
			for (let i = 0; i < spaces.length; ++i) {
				const space = spaces[i];
				this._maxWidth = space.width;
				await this.updateComplete;

				if (content.scrollWidth + 2 * contentBorderSize <= Math.ceil(space.width) && content.scrollHeight + 2 * contentBorderSize <= Math.ceil(space.height)) {
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

			return isInteractive(ele, tooltipInteractiveElements, tooltipInteractiveRoles);
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
			// came from tooltip so keep showing
			if (this.#mouseLeftTooltip) {
				this._isHovering = true;
				return;
			}

			this._hoverTimeout = setTimeout(async() => {
				if (this.showTruncatedOnly) {
					await this._updateTruncating();
					if (!this._truncating) return;
				}

				this._isHovering = true;
				this._updateShowing();
			}, getDelay(this.delay));
		}

		_onTargetMouseLeave() {
			clearTimeout(this._hoverTimeout);
			this._isHovering = false;
			if (this.showing) resetDelayTimeout();
			setTimeout(() => this._updateShowing(), 100); // delay to allow for mouseenter to fire if hovering on tooltip
		}

		_onTargetMutation([m]) {
			if (!this._target?.isConnected || (m.target === this._target && m.attributeName === 'id')) {
				this._targetMutationObserver?.disconnect();
				this._updateTarget();
			}
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

			if (this._targetMutationObserver) {
				this._targetMutationObserver.disconnect();
				this._targetMutationObserver = null;
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

				if (this.announced && !isInteractiveTarget(this._target)) announce(this.innerText);
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
			this.showing = this._isFocusing || this._isHovering || this.forceShow || this.#isHoveringTooltip;
		}

		_updateTarget() {
			const newTarget = this._findTarget();
			if (this._target === newTarget) {
				return;
			}

			this._removeListeners();
			this._target = newTarget;

			if (this._target) {
				const targetDisabled = this._target.hasAttribute('disabled') || this._target.getAttribute('aria-disabled') === 'true';

				const isTargetInteractive = isInteractiveTarget(this._target);
				this.id = this.id || getUniqueId();
				this.setAttribute('role', 'tooltip');
				if (this.forType === 'label') {
					elemIdListAdd(this._target, 'aria-labelledby', this.id);
				} else if (!this.announced || isTargetInteractive) {
					elemIdListAdd(this._target, 'aria-describedby', this.id);
				}
				if (logAccessibilityWarning && !isTargetInteractive && !this.announced) {
					console.warn(
						'd2l-tooltip may be being used in a non-accessible manner; it should be attached to interactive elements like \'a\', \'button\',' +
						'\'input\'', '\'select\', \'textarea\' or static / custom elements if a role has been set and the element is focusable.',
						this._target
					);
					logAccessibilityWarning = false;
				}
				if (this.showing) {
					this.updatePosition();
				} else if (!targetDisabled && isComposedAncestor(this._target, getComposedActiveElement())) {
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

			// if the clone is a web component it needs to update to fill in any slots
			const customElm = customElements.get(clone.localName);
			if (customElm !== undefined) {
				clone.requestUpdate();
				await clone.updateComplete;
			}

			this._truncating = (clone.scrollWidth - target.offsetWidth) > 2; // Safari adds 1px to scrollWidth necessitating a subtraction comparison.
			this._resizeRunSinceTruncationCheck = false;
			target.removeChild(cloneContainer);
		}

		#onTooltipMouseEnter() {
			if (!this.showing) return;
			this.#isHoveringTooltip = true;
			this._updateShowing();
		}

		#onTooltipMouseLeave() {
			clearTimeout(this._mouseLeaveTimeout);

			this.#isHoveringTooltip = false;
			this.#mouseLeftTooltip = true;
			resetDelayTimeout();

			this._mouseLeaveTimeout = setTimeout(() => {
				this.#mouseLeftTooltip = false;
				this._updateShowing();
			}, 100); // delay to allow for mouseenter to fire if hovering on target
		}
	}
	customElements.define('d2l-tooltip', Tooltip);

}
