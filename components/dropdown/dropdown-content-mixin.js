import '../backdrop/backdrop.js';
import '../button/button.js';
import '../focus-trap/focus-trap.js';
import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { findComposedAncestor, getBoundingAncestor, isComposedAncestor, isVisible } from '../../helpers/dom.js';
import { getComposedActiveElement, getFirstFocusableDescendant, getPreviousFocusableAncestor } from '../../helpers/focus.js';
import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import ResizeObserver from 'resize-observer-polyfill/dist/ResizeObserver.es.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';
import { tryGetIfrauBackdropService } from '../../helpers/ifrauBackdropService.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const minBackdropHeightMobile = 42;
const minBackdropWidthMobile = 30;
const outerMarginTopBottom = 18;
const defaultVerticalOffset = 16;

export const DropdownContentMixin = superclass => class extends LocalizeCoreElement(RtlMixin(superclass)) {

	static get properties() {
		return {
			/**
			 * Optionally align dropdown to either start or end. If not set, the dropdown will attempt be centred.
			 * @type {'start'|'end'}
			 */
			align: {
				type: String,
				reflect: true
			},
			/**
			 * Optionally provide boundaries to where the dropdown will appear. Valid properties are "above", "below", "left", and "right".
			 * @type {object}
			 */
			boundary: {
				type: Object,
			},
			/**
			 * Override default max-width (undefined). Specify a number that would be the px value.
			 * @type {number}
			 */
			maxWidth: {
				type: Number,
				reflect: true,
				attribute: 'max-width'
			},
			/**
			 * Override default min-width (undefined). Specify a number that would be the px value.
			 * @type {number}
			 */
			minWidth: {
				type: Number,
				reflect: true,
				attribute: 'min-width'
			},
			/**
			 * Override max-height. Note that the default behaviour is to be as tall as necessary within the viewport, so this property is usually not needed.
			 * @type {number}
			 */
			maxHeight: {
				type: Number,
				attribute: 'max-height'
			},
			/**
			 * Override the breakpoint at which mobile styling is used. Defaults to 616px.
			 * @type {number}
			 */
			mobileBreakpointOverride: {
				type: Number,
				attribute: 'mobile-breakpoint'
			},
			/**
			 * Override default height used for required space when `no-auto-fit` is true. Specify a number that would be the px value. Note that the default behaviour is to be as tall as necessary within the viewport, so this property is usually not needed.
			 * @type {number}
			 */
			minHeight: {
				type: Number,
				reflect: true,
				attribute: 'min-height'
			},
			/**
			 * Opt-out of showing a close button in the footer of tray-style mobile dropdowns.
			 * @type {boolean}
			 */
			noMobileCloseButton: {
				type: Boolean,
				reflect: true,
				attribute: 'no-mobile-close-button'
			},
			/**
			 * Mobile dropdown style.
			 * @type {'left'|'right'|'bottom'}
			 */
			mobileTray: {
				type: String,
				reflect: true,
				attribute: 'mobile-tray'
			},
			/**
			 * Opt out of automatically closing on focus or click outside of the dropdown content
			 * @type {boolean}
			 */
			noAutoClose: {
				type: Boolean,
				reflect: true,
				attribute: 'no-auto-close'
			},
			/**
			 * Opt out of auto-sizing
			 * @type {boolean}
			 */
			noAutoFit: {
				type: Boolean,
				reflect: true,
				attribute: 'no-auto-fit'
			},
			/**
			 * Opt out of focus being automatically moved to the first focusable element in the dropdown when opened
			 * @type {boolean}
			 */
			noAutoFocus: {
				type: Boolean,
				reflect: true,
				attribute: 'no-auto-focus'
			},
			/**
			 * Render with no padding
			 * @type {boolean}
			 */
			noPadding: {
				type: Boolean,
				reflect: true,
				attribute: 'no-padding'
			},
			/**
			 * Render the footer with no padding (if it has content)
			 * @type {boolean}
			 */
			noPaddingFooter: {
				type: Boolean,
				reflect: true,
				attribute: 'no-padding-footer'
			},
			/**
			 * Render the header with no padding (if it has content)
			 * @type {boolean}
			 */
			noPaddingHeader: {
				type: Boolean,
				reflect: true,
				attribute: 'no-padding-header'
			},
			/**
			 * Render without a pointer
			 * @type {boolean}
			 */
			noPointer: {
				type: Boolean,
				reflect: true,
				attribute: 'no-pointer'
			},
			/**
			 * Whether the dropdown is open or not
			 * @type {boolean}
			 */
			opened: {
				type: Boolean,
				reflect: true
			},
			/**
			 * Private.
			 * @ignore
			 */
			openedAbove: {
				type: Boolean,
				reflect: true,
				attribute: 'opened-above'
			},
			/**
 			* Optionally render a d2l-focus-trap around the dropdown content
			 * @type {boolean}
 			*/
			trapFocus: {
				type: Boolean,
				reflect: true,
				attribute: 'trap-focus'
			},
			/**
			 * Provide custom offset, positive or negative
			 * @type {string}
			 */
			verticalOffset: {
				type: String,
				attribute: 'vertical-offset'
			},
			_bottomOverflow: {
				type: Boolean
			},
			_closing: {
				type: Boolean
			},
			_contentOverflow: {
				type: Boolean
			},
			_dropdownContent: {
				type: Boolean,
				attribute: 'dropdown-content',
				reflect: true
			},
			_useMobileStyling: {
				type: Boolean,
				attribute: 'data-mobile',
				reflect: true
			},
			_hasHeader: {
				type: Boolean
			},
			_hasFooter: {
				type: Boolean
			},
			_contentHeight: {
				type: Number
			},
			_position: {
				type: Number
			},
			_showBackdrop: {
				type: Boolean
			},
			_topOverflow: {
				type: Boolean
			},
			_width: {
				type: Number
			}
		};
	}

	constructor() {
		super();

		this.noAutoClose = false;
		this.noAutoFit = false;
		this.noAutoFocus = false;
		this.noMobileCloseButton = false;
		this.noPadding = false;
		this.noPaddingFooter = false;
		this.noPaddingHeader = false;
		this.noPointer = false;
		this.mobileBreakpointOverride = 616;
		this.trapFocus = false;
		this._useMobileStyling = false;

		this.__opened = false;
		this.__content = null;
		this.__previousFocusableAncestor = null;
		this.__applyFocus = true;
		this.__dismissibleId = null;

		this._dropdownContent = true;
		this._bottomOverflow = false;
		this._topOverflow = false;
		this._closing = false;
		this._contentOverflow = false;
		this._hasHeader = false;
		this._hasFooter = false;
		this._showBackdrop = false;
		this._verticalOffset = defaultVerticalOffset;

		this.__onResize = this.__onResize.bind(this);
		this.__onAutoCloseFocus = this.__onAutoCloseFocus.bind(this);
		this.__onAutoCloseClick = this.__onAutoCloseClick.bind(this);
		this.__toggleScrollStyles = this.__toggleScrollStyles.bind(this);
		this._handleMobileResize = this._handleMobileResize.bind(this);
		this.__disconnectResizeObserver = this.__disconnectResizeObserver.bind(this);
	}

	get opened() {
		return this.__opened;
	}

	set opened(val) {
		const oldVal = this.__opened;
		if (oldVal !== val) {
			this.__opened = val;
			this.requestUpdate('opened', oldVal);
			this.__openedChanged(val);
		}
	}

	connectedCallback() {
		super.connectedCallback();

		window.addEventListener('resize', this.__onResize);
		this.addEventListener('blur', this.__onAutoCloseFocus, true);
		this.addEventListener('touchstart', this.__onTouchStart);
		document.body.addEventListener('focus', this.__onAutoCloseFocus, true);
		document.body.addEventListener('click', this.__onAutoCloseClick, true);
		this.mediaQueryList = window.matchMedia(`(max-width: ${this.mobileBreakpointOverride - 1}px)`);
		this._useMobileStyling = this.mediaQueryList.matches;
		if (this.mediaQueryList.addEventListener) this.mediaQueryList.addEventListener('change', this._handleMobileResize);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		if (this.mediaQueryList.removeEventListener) this.mediaQueryList.removeEventListener('change', this._handleMobileResize);
		this.removeEventListener('blur', this.__onAutoCloseFocus);
		this.removeEventListener('touchstart', this.__onTouchStart);
		window.removeEventListener('resize', this.__onResize);
		if (document.body) {
			// DE41322: document.body can be null in some scenarios
			document.body.removeEventListener('focus', this.__onAutoCloseFocus, true);
			document.body.removeEventListener('click', this.__onAutoCloseClick, true);
		}
		clearDismissible(this.__dismissibleId);
		this.__dismissibleId = null;

		if (this.__resizeObserver) this.__resizeObserver.disconnect();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.__content = this.getContentContainer();
		this.addEventListener('d2l-dropdown-close', this.__onClose);
		this.addEventListener('d2l-dropdown-position', this.__toggleScrollStyles);
		const contentObserver = new ResizeObserver(this.__onContentResize.bind(this));
		contentObserver.observe(this.__content);
	}

	updated(changedProperties) {
		changedProperties.forEach((_, propName) => {
			if (propName === 'verticalOffset') {
				let newVerticalOffset = parseInt(this.verticalOffset);
				if (isNaN(newVerticalOffset)) {
					newVerticalOffset = defaultVerticalOffset;
				}
				this.style.setProperty('--d2l-dropdown-verticaloffset', `${newVerticalOffset}px`);
				this._verticalOffset = newVerticalOffset;
			}
		});
	}

	close() {
		const hide = () => {
			this._closing = false;
			this._showBackdrop = false;
			this.opened = false;
		};

		if (!reduceMotion && this._useMobileStyling && this.mobileTray && isVisible(this)) {
			if (this.shadowRoot) this.shadowRoot.querySelector('.d2l-dropdown-content-width')
				.addEventListener('animationend', hide, { once: true });
			this._closing = true;
			this._showBackdrop = false;
		} else {
			hide();
		}
	}

	/**
	 * forceRender is no longer necessary, this is left as a stub so that
	 * places calling it will not break. It will be removed once the Polymer
	 * dropdown is swapped over to use this and all instances of
	 * forceRender are removed.
	 */
	forceRender() {}

	getContentContainer() {
		return this.shadowRoot && this.shadowRoot.querySelector('.d2l-dropdown-content-container');
	}

	/**
	 * Private.
	 */
	height() {
		return this.__content && this.__content.offsetHeight;
	}

	async open(applyFocus) {
		this.__applyFocus = applyFocus !== undefined ? applyFocus : true;
		this.opened = true;
		await this.updateComplete;
		this._showBackdrop = this._useMobileStyling && this.mobileTray;
	}

	/**
	 * Waits for the next resize when elem has a height > 0px,
	 * then calls the __position function.
	*/
	requestRepositionNextResize(elem) {
		if (!elem) return;
		if (this.__resizeObserver) this.__resizeObserver.disconnect();
		this.__resizeObserver = new ResizeObserver(this.__disconnectResizeObserver);
		this.__resizeObserver.observe(elem);
	}

	async resize() {
		if (!this.opened) {
			return;
		}
		this._showBackdrop = this._useMobileStyling && this.mobileTray;
		await this.__position();
	}

	/**
	 * Private.
	 */
	scrollTo(scrollTop) {
		const content = this.__content;
		if (content) {
			if (typeof scrollTop === 'number') {
				content.scrollTop = scrollTop;
			}
			return content.scrollTop;
		}
	}

	toggleOpen(applyFocus) {
		if (this.opened) {
			this.close();
		} else {
			this.open(!this.noAutoFocus && applyFocus);
		}
	}

	__disconnectResizeObserver(entries) {
		for (let i = 0; i < entries.length; i++) {
			const entry = entries[i];
			if (this.__resizeObserver && entry.contentRect.height !== 0) {
				this.__resizeObserver.disconnect();
				// wrap in rAF for Firefox
				requestAnimationFrame(() => {
					if (this.opened) this.__position();
				});
				break;
			}
		}
	}

	__getContentBottom() {
		return this.shadowRoot && this.shadowRoot.querySelector('.d2l-dropdown-content-bottom');
	}

	__getContentTop() {
		return this.shadowRoot && this.shadowRoot.querySelector('.d2l-dropdown-content-top');
	}

	__getOpener() {
		const opener = findComposedAncestor(this, (elem) => {
			if (elem.dropdownOpener) {
				return true;
			}
		});
		return opener;
	}

	__getPositionContainer() {
		return this.shadowRoot && this.shadowRoot.querySelector('.d2l-dropdown-content-position');
	}

	__getWidthContainer() {
		return this.shadowRoot && this.shadowRoot.querySelector('.d2l-dropdown-content-width');
	}

	__handleFooterSlotChange(e) {
		this._hasFooter = e.target.assignedNodes().length !== 0;
	}

	__handleHeaderSlotChange(e) {
		this._hasHeader = e.target.assignedNodes().length !== 0;
	}

	__onAutoCloseClick(e) {
		if (!this.opened || this.noAutoClose) {
			return;
		}
		const rootTarget = e.composedPath()[0];
		const clickInside = isComposedAncestor(this.getContentContainer(), rootTarget) ||
			isComposedAncestor(this.__getContentTop(), rootTarget) ||
			isComposedAncestor(this.__getContentBottom(), rootTarget);
		if (clickInside) {
			return;
		}
		const opener = this.__getOpener();
		if (isComposedAncestor(opener.getOpenerElement(), rootTarget)) {
			return;
		}

		this.close();
	}

	__onAutoCloseFocus() {

		/* timeout needed to work around lack of support for relatedTarget */
		setTimeout(() => {
			if (!this.opened
				|| this.noAutoClose
				|| !document.activeElement
				|| document.activeElement === this.__previousFocusableAncestor
				|| document.activeElement === document.body) {
				return;
			}

			const activeElement = getComposedActiveElement();

			if (isComposedAncestor(this, activeElement)
				|| isComposedAncestor(this.__getOpener(), activeElement)) {
				return;
			}
			this.close();
		}, 0);
	}

	__onClose(e) {

		if (e.target !== this || !document.activeElement) {
			return;
		}

		const activeElement = getComposedActiveElement();

		if (!isComposedAncestor(this, activeElement)) {
			return;
		}

		const opener = this.__getOpener();
		opener.getOpenerElement().focus();

	}

	__onContentResize(entries) {
		if (!entries || entries.length === 0) return;
		this.__toggleOverflowY(false);
	}

	__onResize() {
		this.resize();
	}

	__onTouchStart(e) {
		// elements external to the dropdown content such as primary-secondary template should not be reacting
		// to touchstart events originating inside the dropdown content
		e.stopPropagation();
	}

	async __openedChanged(newValue) {

		// DE44538: wait for dropdown content to fully render,
		// otherwise this.getContentContainer() can return null.
		await this.updateComplete;

		this.__previousFocusableAncestor =
			newValue === true
				? getPreviousFocusableAncestor(this, false, false)
				: null;

		const doOpen = async() => {

			const content = this.getContentContainer();

			if (!this.noAutoFit) {
				content.scrollTop = 0;
			}

			await this.__position();
			this._showBackdrop = this._useMobileStyling && this.mobileTray;
			if (!this.noAutoFocus && this.__applyFocus) {
				const focusable = getFirstFocusableDescendant(this);
				if (focusable) {
					// Removing the rAF call can allow infinite focus looping to happen in content using a focus trap
					requestAnimationFrame(() => focusable.focus());
				} else {
					content.setAttribute('tabindex', '-1');
					content.focus();
				}
			}

			setTimeout(() =>
				this.dispatchEvent(new CustomEvent('d2l-dropdown-open', { bubbles: true, composed: true })), 0
			);

			this.__dismissibleId = setDismissible(() => {
				this.close();
			});
		};

		const ifrauBackdropService = await tryGetIfrauBackdropService();

		if (newValue) {

			if (ifrauBackdropService && this.mobileTray && this._useMobileStyling) {
				this._ifrauContextInfo = await ifrauBackdropService.showBackdrop();
			}

			await doOpen();

		} else {

			if (this.__dismissibleId) {
				clearDismissible(this.__dismissibleId);
				this.__dismissibleId = null;
			}
			if (ifrauBackdropService && this.mobileTray && this._useMobileStyling) {
				ifrauBackdropService.hideBackdrop();
				this._ifrauContextInfo = null;
			}
			this._showBackdrop = false;
			await this.updateComplete;

			/** Dispatched when the dropdown is closed */
			this.dispatchEvent(new CustomEvent('d2l-dropdown-close', { bubbles: true, composed: true }));

		}
	}

	async __position(ignoreVertical, contentRect) {

		const opener = this.__getOpener();
		if (!opener) {
			return;
		}
		const target = opener.getOpenerElement();
		if (!target) {
			return;
		}

		const content = this.getContentContainer();
		const header = this.__getContentTop();
		const footer = this.__getContentBottom();

		if (!this.noAutoFit) {
			this._contentHeight = null;
		}

		/* don't let dropdown content horizontally overflow viewport */
		this._width = null;

		const openerPosition = window.getComputedStyle(opener, null).getPropertyValue('position');
		const boundingContainer = getBoundingAncestor(target.parentNode);
		const boundingContainerRect = boundingContainer.getBoundingClientRect();
		const scrollHeight = boundingContainer.scrollHeight;

		await this.updateComplete;

		// position check in case consuming app (LMS) has overriden position to make content absolute wrt document
		const bounded = (openerPosition === 'relative' && boundingContainer !== document.documentElement);

		const adjustPosition = async() => {

			const targetRect = target.getBoundingClientRect();
			contentRect = contentRect ? contentRect : content.getBoundingClientRect();
			const headerFooterHeight = header.getBoundingClientRect().height + footer.getBoundingClientRect().height;

			const height = this.minHeight ? this.minHeight : Math.min(this.maxHeight ? this.maxHeight : Number.MAX_VALUE, contentRect.height + headerFooterHeight);
			const spaceRequired = {
				height: height + 10,
				width: contentRect.width
			};
			let spaceAround;
			let spaceAroundScroll;
			if (bounded) {
				spaceAround = this._constrainSpaceAround({
					// allow for target offset + outer margin
					above: targetRect.top - boundingContainerRect.top - this._verticalOffset - outerMarginTopBottom,
					// allow for target offset + outer margin
					below: boundingContainerRect.bottom - targetRect.bottom - this._verticalOffset - outerMarginTopBottom,
					// allow for outer margin
					left: targetRect.left - boundingContainerRect.left - 20,
					// allow for outer margin
					right: boundingContainerRect.right - targetRect.right - 20
				}, spaceRequired, targetRect);
				spaceAroundScroll = this._constrainSpaceAround({
					above: targetRect.top - boundingContainerRect.top + boundingContainer.scrollTop,
					below: scrollHeight - targetRect.bottom + boundingContainerRect.top - boundingContainer.scrollTop
				}, spaceRequired, targetRect);
			} else {
				spaceAround = this._constrainSpaceAround({
					// allow for target offset + outer margin
					above: targetRect.top - this._verticalOffset - outerMarginTopBottom,
					// allow for target offset + outer margin
					below: window.innerHeight - targetRect.bottom - this._verticalOffset - outerMarginTopBottom,
					// allow for outer margin
					left: targetRect.left - 20,
					// allow for outer margin
					right: document.documentElement.clientWidth - targetRect.right - 15
				}, spaceRequired, targetRect);
				spaceAroundScroll = this._constrainSpaceAround({
					above: targetRect.top + document.documentElement.scrollTop,
					below: scrollHeight - targetRect.bottom - document.documentElement.scrollTop
				}, spaceRequired, targetRect);
			}

			if (!ignoreVertical) {
				this.openedAbove = this._getOpenedAbove(spaceAround, spaceAroundScroll, spaceRequired);
			}

			const centerDelta = contentRect.width - targetRect.width;
			const position = this._getPosition(spaceAround, centerDelta);
			if (position !== null) {
				this._position = position;
			}

			//Calculate height available to the dropdown contents for overflow because that is the only area capable of scrolling
			const availableHeight = this.openedAbove ? spaceAround.above : spaceAround.below;
			if (!this.noAutoFit && availableHeight && availableHeight > 0) {
				//Only apply maximum if it's less than space available and the header/footer alone won't exceed it (content must be visible)
				this._contentHeight = this.maxHeight !== null
					&& availableHeight > this.maxHeight
					&& headerFooterHeight < this.maxHeight
					? this.maxHeight - headerFooterHeight - 2
					: availableHeight - headerFooterHeight;
				this.__toggleOverflowY(contentRect.height + headerFooterHeight > availableHeight);

				// ensure the content height has updated when the __toggleScrollStyles event handler runs
				await this.updateComplete;
			}

			/** Dispatched when the dropdown position finishes adjusting */
			this.dispatchEvent(new CustomEvent('d2l-dropdown-position', { bubbles: true, composed: true }));
		};

		const scrollWidth = Math.max(header.scrollWidth, content.scrollWidth, footer.scrollWidth);
		const availableWidth = (bounded ? boundingContainerRect.width - 60 : window.innerWidth - 40);
		this._width = (availableWidth > scrollWidth ? scrollWidth : availableWidth) ;

		await this.updateComplete;

		await adjustPosition();
	}

	__toggleOverflowY(isOverflowing) {
		if (!this.__content) {
			return;
		}
		if (!this._contentHeight) {
			return;
		}
		this._contentOverflow = isOverflowing || this.__content.scrollHeight > this._contentHeight;
	}

	__toggleScrollStyles() {
		/* scrollHeight incorrect in IE by 4px second time opened */
		this._bottomOverflow = this.__content.scrollHeight - (this.__content.scrollTop + this.__content.clientHeight) >= 5;
		this._topOverflow = this.__content.scrollTop !== 0;
	}

	_constrainSpaceAround(spaceAround, spaceRequired, targetRect) {
		const constrained = { ...spaceAround };
		if (this.boundary) {
			constrained.above = this.boundary.above >= 0 ? Math.min(spaceAround.above, this.boundary.above) : spaceAround.above;
			constrained.below = this.boundary.below >= 0 ? Math.min(spaceAround.below, this.boundary.below) : spaceAround.below;
			constrained.left = this.boundary.left >= 0 ? Math.min(spaceAround.left, this.boundary.left) : spaceAround.left;
			constrained.right = this.boundary.right >= 0 ? Math.min(spaceAround.right, this.boundary.right) : spaceAround.right;
		}
		const isRTL = this.getAttribute('dir') === 'rtl';
		if ((this.align === 'start' && !isRTL) || (this.align === 'end' && isRTL)) {
			constrained.left = Math.max(0, spaceRequired.width - (targetRect.width + spaceAround.right));
		} else if ((this.align === 'start' && isRTL) || (this.align === 'end' && !isRTL)) {
			constrained.right = Math.max(0, spaceRequired.width - (targetRect.width + spaceAround.left));
		}
		return constrained;
	}

	_getBottomTrayStyling() {

		let maxHeightOverride;
		let availableHeight = Math.min(window.innerHeight, window.screen.height);
		if (this._ifrauContextInfo) availableHeight = this._ifrauContextInfo.availableHeight;
		// default maximum height for bottom tray (42px margin)
		const mobileTrayMaxHeightDefault = availableHeight - minBackdropHeightMobile;
		if (this.maxHeight) {
			// if maxWidth provided is smaller, use the maxWidth
			maxHeightOverride = Math.min(mobileTrayMaxHeightDefault, this.maxHeight);
		} else {
			maxHeightOverride = mobileTrayMaxHeightDefault;
		}
		maxHeightOverride = `${maxHeightOverride}px`;

		let bottomOverride;
		if (this._ifrauContextInfo) {
			// Bottom override is measured as
			// the distance from the bottom of the screen
			const screenHeight =
				window.innerHeight
				- this._ifrauContextInfo.availableHeight
				+ Math.min(this._ifrauContextInfo.top, 0);
			bottomOverride = `${screenHeight}px`;
		}

		const widthOverride = '100vw';

		const widthStyle = {
			minWidth: widthOverride,
			width: widthOverride,
			maxHeight: maxHeightOverride,
			bottom: bottomOverride
		};

		const contentWidthStyle = {
			/* set width of content in addition to width container so header and footer borders are full width */
			width: widthOverride
		};

		const headerStyle = {
			...contentWidthStyle,
			minHeight: this._hasHeader ? 'auto' : '5px'
		};

		const footerStyle = {
			...contentWidthStyle,
			minHeight: this._hasFooter || !this.noMobileCloseButton ? 'auto' : '5px'
		};

		const contentStyle = {
			...contentWidthStyle,
			maxHeight: maxHeightOverride,
			overflowY: this._contentOverflow ? 'auto' : 'hidden'
		};

		const closeButtonStyles = {
			display: !this.noMobileCloseButton ? 'inline-block' : 'none',
			width: this._getTrayFooterWidth(),
			padding: this._hasFooter && !this.noPaddingFooter ? '12px 0 0 0' : '12px',
			margin: this._getTrayFooterMargin()
		};

		return {
			'width' : widthStyle,
			'header' : headerStyle,
			'footer' : footerStyle,
			'content' : contentStyle,
			'close' : closeButtonStyles
		};
	}

	_getDropdownStyling() {
		const widthStyle = {
			maxWidth: this.maxWidth ? `${this.maxWidth}px` : '',
			minWidth: this.minWidth ? `${this.minWidth}px` : '',
			/* add 2 to content width since scrollWidth does not include border */
			width: this._width ? `${this._width + 20}px` : ''
		};

		const contentWidthStyle = {
			minWidth: this.minWidth ? `${this.minWidth}px` : '',
			/* set width of content in addition to width container so header and footer borders are full width */
			width: this._width ? `${this._width + 18}px` : '',
		};

		const contentStyle = {
			...contentWidthStyle,
			maxHeight: this._contentHeight ? `${this._contentHeight}px` : '',
			overflowY: this._contentOverflow ? 'auto' : 'hidden'
		};

		const closeButtonStyle = {
			display: 'none',
		};

		return {
			'width' : widthStyle,
			'content' : contentStyle,
			'close' : closeButtonStyle,
			'header' : contentWidthStyle,
			'footer' : contentWidthStyle
		};
	}

	_getLeftRightTrayStyling() {

		let maxWidthOverride = this.maxWidth;
		let availableWidth = Math.min(window.innerWidth, window.screen.width);
		if (this._ifrauContextInfo) availableWidth = this._ifrauContextInfo.availableWidth;
		// default maximum width for tray (30px margin)
		const mobileTrayMaxWidthDefault = Math.min(availableWidth - minBackdropWidthMobile, 420);
		if (maxWidthOverride) {
			// if maxWidth provided is smaller, use the maxWidth
			maxWidthOverride = Math.min(mobileTrayMaxWidthDefault, maxWidthOverride);
		} else {
			maxWidthOverride = mobileTrayMaxWidthDefault;
		}

		let minWidthOverride = this.minWidth;
		// minimum size - 285px
		const mobileTrayMinWidthDefault = 285;
		if (minWidthOverride) {
			// if minWidth provided is smaller, use the minumum width for tray
			minWidthOverride = Math.max(mobileTrayMinWidthDefault, minWidthOverride);
		} else {
			minWidthOverride = mobileTrayMinWidthDefault;
		}

		// if no width property set, automatically size to maximum width
		let widthOverride = this._width ? this._width : maxWidthOverride;
		// ensure width is between minWidth and maxWidth
		if (widthOverride && maxWidthOverride && widthOverride > (maxWidthOverride - 20)) widthOverride = maxWidthOverride - 20;
		if (widthOverride && minWidthOverride && widthOverride < (minWidthOverride - 20)) widthOverride = minWidthOverride - 20;

		maxWidthOverride = `${maxWidthOverride}px`;
		minWidthOverride = `${minWidthOverride}px`;
		const  contentWidth = `${widthOverride + 18}px`;
		/* add 2 to content width since scrollWidth does not include border */
		const containerWidth = `${widthOverride + 20}px`;

		let maxHeightOverride = '';
		if (this._ifrauContextInfo) maxHeightOverride = `${this._ifrauContextInfo.availableHeight}px`;

		let topOverride;
		if (this._ifrauContextInfo) {
			// if inside iframe, use ifrauContext top as top of screen
			topOverride = `${this._ifrauContextInfo.top < 0 ? -this._ifrauContextInfo.top : 0}px`;
		} else if (window.innerHeight > window.screen.height) {
			// non-responsive page, manually override top to scroll distance
			topOverride = window.pageYOffset;
		}

		let rightOverride;
		let leftOverride;
		if (this.mobileTray === 'right') {
			// On non-responsive pages, the innerWidth may be wider than the screen,
			// override right to stick to right of viewport
			rightOverride = `${Math.max(window.innerWidth - window.screen.width, 0)}px`;
		}
		if (this.mobileTray === 'left') {
			// On non-responsive pages, the innerWidth may be wider than the screen,
			// override left to stick to left of viewport
			leftOverride = `${Math.max(window.innerWidth - window.screen.width, 0)}px`;
		}

		const widthStyle = {
			maxWidth: maxWidthOverride,
			minWidth: minWidthOverride,
			width: containerWidth,
			maxHeight: maxHeightOverride,
			top: topOverride,
			right: rightOverride,
			left: leftOverride,
		};

		const contentWidthStyle = {
			minWidth: minWidthOverride,
			/* set width of content in addition to width container so header and footer borders are full width */
			width: contentWidth,
		};

		const headerStyle = {
			...contentWidthStyle,
			minHeight: this._hasHeader ? 'auto' : '5px'
		};

		const footerStyle = {
			...contentWidthStyle,
			minHeight: this._hasFooter || !this.noMobileCloseButton ? 'auto' : '5px'
		};

		const contentStyle = {
			...contentWidthStyle,
			maxHeight: maxHeightOverride,
			overflowY: this._contentOverflow ? 'auto' : 'hidden'
		};

		const closeButtonStyles = {
			display: !this.noMobileCloseButton ? 'inline-block' : 'none',
			width: this._getTrayFooterWidth(),
			padding: this._hasFooter && !this.noPaddingFooter ? '12px 0 0 0' : '12px',
			margin: this._getTrayFooterMargin()
		};

		return {
			'width' : widthStyle,
			'header' : headerStyle,
			'footer' : footerStyle,
			'content' : contentStyle,
			'close' : closeButtonStyles
		};
	}

	_getOpenedAbove(spaceAround, spaceAroundScroll, spaceRequired) {
		if (spaceAround.below >= spaceRequired.height) {
			return false;
		}
		if (spaceAround.above >= spaceRequired.height) {
			return true;
		}
		if (!this.noAutoFit) {
			// if auto-fit is enabled, scroll will be enabled for the
			// inner content so it will always fit in the available space
			// so pick the largest space it can be displayed in
			return spaceAround.above > spaceAround.below;
		}
		if (spaceAroundScroll.below >= spaceRequired.height) {
			return false;
		}
		if (spaceAroundScroll.above >= spaceRequired.height) {
			return true;
		}
		// if auto-fit is disabled and it doesn't fit in the scrollable space
		// above or below, always open down because it can add scrollable space
		return false;
	}

	_getPosition(spaceAround, centerDelta) {

		const contentXAdjustment = centerDelta / 2;
		if (centerDelta <= 0) {
			return contentXAdjustment * -1;
		}
		if (spaceAround.left > contentXAdjustment && spaceAround.right > contentXAdjustment) {
			// center with target
			return contentXAdjustment * -1;
		}
		const isRTL = this.getAttribute('dir') === 'rtl';
		if (!isRTL) {
			if (spaceAround.left < contentXAdjustment) {
				// slide content right (not enough space to center)
				return spaceAround.left * -1;
			} else if (spaceAround.right < contentXAdjustment) {
				// slide content left (not enough space to center)
				return (centerDelta * -1) + spaceAround.right;
			}
		} else {
			if (spaceAround.left < contentXAdjustment) {
				// slide content right (not enough space to center)
				return (centerDelta * -1) + spaceAround.left;
			} else if (spaceAround.right < contentXAdjustment) {
				// slide content left (not enough space to center)
				return spaceAround.right * -1;
			}
		}
		return null;
	}

	_getTrayFooterMargin() {
		let footerMargin;
		if (this._hasFooter) {
			footerMargin = '0';
		} else if (this.getAttribute('dir') === 'rtl') {
			footerMargin = '-20px -20px -20px 0px';
		} else {
			footerMargin = '-20px 0 -20px -20px';
		}
		return footerMargin;
	}

	_getTrayFooterWidth() {
		let footerWidth;
		if (this.noPaddingFooter) {
			footerWidth = 'calc(100% - 24px)';
		} else if (this._hasFooter) {
			footerWidth = '100%';
		} else {
			footerWidth = 'calc(100% + 16px)';
		}
		return footerWidth;
	}

	_handleFocusTrapEnter() {
		if (this.__applyFocus && !this.noAutoFocus) {
			const content = this.__getWidthContainer();
			const focusable = getFirstFocusableDescendant(content);
			if (focusable) {
				// Removing the rAF call can allow infinite focus looping to happen in content using a focus trap
				requestAnimationFrame(() => focusable.focus());
			} else {
				content.setAttribute('tabindex', '-1');
				content.focus();
			}
		}
		/** Dispatched when user focus enters the dropdown content (trap-focus option only) */
		this.dispatchEvent(new CustomEvent('d2l-dropdown-focus-enter', { detail:{ applyFocus: this.__applyFocus } }));
	}

	async _handleMobileResize() {
		this._useMobileStyling =  this.mediaQueryList.matches;
		if (this.opened) this._showBackdrop = this._useMobileStyling && this.mobileTray;
		if (this.opened) await this.__position();
	}

	_renderContent() {
		const positionStyle = {};
		const isRTL = this.getAttribute('dir') === 'rtl';
		if (this._position) {
			if (!isRTL) {
				positionStyle.left = `${this._position}px`;
			} else {
				positionStyle.right = `${this._position}px`;
			}
		}

		const mobileTrayRightLeft = this._useMobileStyling && (this.mobileTray === 'right' || this.mobileTray === 'left');
		const mobileTrayBottom = this._useMobileStyling && (this.mobileTray === 'bottom');

		let stylesMap;
		if (mobileTrayBottom) {
			stylesMap = this._getBottomTrayStyling();
		} else if (mobileTrayRightLeft) {
			stylesMap = this._getLeftRightTrayStyling();
		} else {
			stylesMap = this._getDropdownStyling();
		}
		const widthStyle = stylesMap['width'];
		const headerStyle = stylesMap['header'];
		const footerStyle = stylesMap['footer'];
		const contentStyle = stylesMap['content'];
		const closeButtonStyles = stylesMap['close'];

		const topClasses = {
			'd2l-dropdown-content-top': true,
			'd2l-dropdown-content-top-scroll': this._topOverflow,
			'd2l-dropdown-content-header': this._hasHeader
		};
		const bottomClasses = {
			'd2l-dropdown-content-bottom': true,
			'd2l-dropdown-content-bottom-scroll': this._bottomOverflow,
			'd2l-dropdown-content-footer': this._hasFooter || (this._useMobileStyling && this.mobileTray && !this.noMobileCloseButton)
		};

		let dropdownContentSlots = html`
			<div
			id="d2l-dropdown-wrapper"
			class="d2l-dropdown-content-width"
			style=${styleMap(widthStyle)}
			?data-closing="${this._closing}">
				<div class=${classMap(topClasses)} style=${styleMap(headerStyle)}>
					<slot name="header" @slotchange="${this.__handleHeaderSlotChange}"></slot>
				</div>
				<div
				class="d2l-dropdown-content-container"
				style=${styleMap(contentStyle)}
				@scroll=${this.__toggleScrollStyles}>
					<slot class="d2l-dropdown-content-slot"></slot>
				</div>
				<div class=${classMap(bottomClasses)} style=${styleMap(footerStyle)}>
					<slot name="footer" @slotchange="${this.__handleFooterSlotChange}"></slot>
					<d2l-button
						class="dropdown-close-btn"
						style=${styleMap(closeButtonStyles)}
						@click=${this.close}>
						${this.localize('components.dropdown.close')}
					</d2l-button>
				</div>
			</div>
		`;

		if (this.trapFocus) {
			dropdownContentSlots = html`
			<d2l-focus-trap
			@d2l-focus-trap-enter="${this._handleFocusTrapEnter}"
			?trap="${this.opened}">
			${dropdownContentSlots}
			</d2l-focus-trap>`;
		}

		const dropdown =  html`
			<div class="d2l-dropdown-content-position" style=${styleMap(positionStyle)}>
					 ${dropdownContentSlots}
			</div>
		`;

		return (this.mobileTray) ? html`
			${dropdown}
			<d2l-backdrop
				for-target="d2l-dropdown-wrapper"
				?shown="${this._showBackdrop}" >
			</d2l-backdrop>`
			: html`${dropdown}`;
	}

};
