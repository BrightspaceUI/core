import { css, html, LitElement } from 'lit';
import { cssEscape, elemIdListAdd, elemIdListRemove, isComposedAncestor } from '../../helpers/dom.js';
import { getComposedActiveElement, isFocusable } from '../../helpers/focus.js';
import { interactiveElements, interactiveRoles, isInteractive } from '../../helpers/interactive.js';
import { announce } from '../../helpers/announce.js';
import { bodySmallStyles } from '../typography/styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { PopoverMixin } from '../popover/popover-mixin.js';

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
				--d2l-popover-border-color: var(--d2l-tooltip-border-color);
				--d2l-popover-border-radius: 0.3rem;
				--d2l-popover-outline-color: var(--d2l-tooltip-outline-color);
				--d2l-popover-outline-width: 1px;
			}
			:host([state="error"]) {
				--d2l-tooltip-background-color: var(--d2l-color-cinnabar);
				--d2l-tooltip-border-color: var(--d2l-color-cinnabar);
			}
			.d2l-tooltip-content {
				box-sizing: border-box;
				color: white;
				max-width: 17.5rem;
				min-height: 1.85rem;
				min-width: 2.1rem;
				overflow: hidden;
				overflow-wrap: anywhere;
				padding-block: ${10 - contentBorderSize}px ${11 - contentBorderSize}px;
				padding-inline: ${contentHorizontalPadding - contentBorderSize}px;
				white-space: normal;
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
		this.#addListeners();
		window.addEventListener('resize', this.#handleTargetResizeBound);

		requestAnimationFrame(() => this.#updateTarget());
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (activeTooltip === this) activeTooltip = null;

		this.#removeListeners();
		window.removeEventListener('resize', this.#handleTargetResizeBound);

		delayTimeoutId = null;

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
				maxWidth: '350',
				minWidth: '48',
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

	updatePosition() {
		return super.position();
	}

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

	// for testing only!
	_getTarget() {
		return this.#target;
	}

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
		this.addEventListener('d2l-popover-close', this.hide);

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

		this.#targetMutationObserver = new MutationObserver(this.#handleTargetMutationBound);
		this.#targetMutationObserver.observe(this.#target, { attributes: true, attributeFilter: ['id'] });
		this.#targetMutationObserver.observe(this.#target.parentNode, { childList: true });
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
			this.#updateTarget();
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
		this.removeEventListener('d2l-popover-close', this.hide);

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

			this.setAttribute('aria-hidden', 'false');
			await this.updateComplete;

			// wait for popover before dispatching (ex. otherwise visual-diff won't capture complete target area)
			await super.open(this.#target, false);

			if (dispatch) {
				this.dispatchEvent(new CustomEvent('d2l-tooltip-show', { bubbles: true, composed: true }));
			}

			if (this.announced && !isInteractiveTarget(this.#target)) announce(this.innerText);
		} else {
			if (activeTooltip === this) activeTooltip = null;

			this.setAttribute('aria-hidden', 'true');

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
