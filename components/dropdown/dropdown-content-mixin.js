import '../backdrop/backdrop.js';
import '../button/button.js';
import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { findComposedAncestor, getBoundingAncestor, isComposedAncestor, isVisible } from '../../helpers/dom.js';
import { getComposedActiveElement, getFirstFocusableDescendant, getPreviousFocusableAncestor } from '../../helpers/focus.js';
import { classMap } from 'lit-html/directives/class-map';
import { html } from 'lit-element/lit-element.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

const mediaQueryList = window.matchMedia('(max-width: 615px)');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

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
			 */
			boundary: {
				type: Object,
			},
			/**
			 * Override default max-width (undefined). Specify a number that would be the px value.
			 */
			maxWidth: {
				type: Number,
				reflect: true,
				attribute: 'max-width'
			},
			/**
			 * Override default min-width (undefined). Specify a number that would be the px value.
			 */
			minWidth: {
				type: Number,
				reflect: true,
				attribute: 'min-width'
			},
			/**
			 * Override max-height. Note that the default behaviour is to be as tall as necessary within the viewport, so this property is usually not needed.
			 */
			maxHeight: {
				type: Number,
				attribute: 'max-height'
			},
			/**
			 * Override default height used for required space when `no-auto-fit` is true. Specify a number that would be the px value. Note that the default behaviour is to be as tall as necessary within the viewport, so this property is usually not needed.
			 */
			minHeight: {
				type: Number,
				reflect: true,
				attribute: 'min-height'
			},
			/**
			 * Opt-out of showing a close button in the footer of tray-style mobile dropdowns.
			 */
			noMobileCloseButton: {
				type: Boolean,
				reflect: true,
				attribute: 'no-mobile-close-button'
			},
			/**
			 * Override default mobile dropdown style. Specify one of 'left' or 'right'.
			 */
			mobileTray: {
				type: String,
				reflect: true,
				attribute: 'mobile-tray'
			},
			/**
			 * Opt out of automatically closing on focus or click outside of the dropdown content
			 */
			noAutoClose: {
				type: Boolean,
				reflect: true,
				attribute: 'no-auto-close'
			},
			/**
			 * Opt out of auto-sizing
			 */
			noAutoFit: {
				type: Boolean,
				reflect: true,
				attribute: 'no-auto-fit'
			},
			/**
			 * Opt out of focus being automatically moved to the first focusable element in the dropdown when opened
			 */
			noAutoFocus: {
				type: Boolean,
				reflect: true,
				attribute: 'no-auto-focus'
			},
			/**
			 * Render with no padding
			 */
			noPadding: {
				type: Boolean,
				reflect: true,
				attribute: 'no-padding'
			},
			/**
			 * Render the footer with no padding (if it has content)
			 */
			noPaddingFooter: {
				type: Boolean,
				reflect: true,
				attribute: 'no-padding-footer'
			},
			/**
			 * Render the header with no padding (if it has content)
			 */
			noPaddingHeader: {
				type: Boolean,
				reflect: true,
				attribute: 'no-padding-header'
			},
			/**
			 * Render without a pointer
			 */
			noPointer: {
				type: Boolean,
				reflect: true,
				attribute: 'no-pointer'
			},
			/**
			 * @ignore
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
			 * Provide custom offset, positive or negative
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

		this.__onResize = this.__onResize.bind(this);
		this.__onAutoCloseFocus = this.__onAutoCloseFocus.bind(this);
		this.__onAutoCloseClick = this.__onAutoCloseClick.bind(this);
		this.__toggleScrollStyles = this.__toggleScrollStyles.bind(this);
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
		document.body.addEventListener('focus', this.__onAutoCloseFocus, true);
		document.body.addEventListener('click', this.__onAutoCloseClick, true);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('blur', this.__onAutoCloseFocus);
		window.removeEventListener('resize', this.__onResize);
		if (document.body) {
			// DE41322: document.body can be null in some scenarios
			document.body.removeEventListener('focus', this.__onAutoCloseFocus, true);
			document.body.removeEventListener('click', this.__onAutoCloseClick, true);
		}
		clearDismissible(this.__dismissibleId);
		this.__dismissibleId = null;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.__content = this.__getContentContainer();
		this.addEventListener('d2l-dropdown-close', this.__onClose);
		this.addEventListener('d2l-dropdown-position', this.__toggleScrollStyles);
	}

	updated(changedProperties) {
		changedProperties.forEach((_, propName) => {
			if (propName === 'verticalOffset') {
				let newVerticalOffset = parseInt(this.verticalOffset);
				if (isNaN(newVerticalOffset)) {
					newVerticalOffset = 20;
				}
				// for IE11
				if (window.ShadyCSS) window.ShadyCSS.styleSubtree(this, { '--d2l-dropdown-verticaloffset': `${newVerticalOffset}px` });
				else this.style.setProperty('--d2l-dropdown-verticaloffset', `${newVerticalOffset}px`);
			}
		});
	}

	close() {
		const hide = () => {
			this._closing = false;
			this._showBackdrop = false;
			this.opened = false;
		};

		if (!reduceMotion && mediaQueryList.matches && this.mobileTray && isVisible(this)) {
			this.shadowRoot.querySelector('.d2l-dropdown-content-width')
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
		this._showBackdrop = mediaQueryList.matches && this.mobileTray;
	}

	async resize() {
		if (!this.opened) {
			return;
		}
		this._showBackdrop = mediaQueryList.matches && this.mobileTray;
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
			this.open(applyFocus);
		}
	}

	__getContentBottom() {
		return this.shadowRoot.querySelector('.d2l-dropdown-content-bottom');
	}

	__getContentContainer() {
		return this.shadowRoot.querySelector('.d2l-dropdown-content-container');
	}

	__getContentTop() {
		return this.shadowRoot.querySelector('.d2l-dropdown-content-top');
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
		return this.shadowRoot.querySelector('.d2l-dropdown-content-position');
	}

	__getWidthContainer() {
		return this.shadowRoot.querySelector('.d2l-dropdown-content-width');
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
		const clickInside = isComposedAncestor(this.__getContentContainer(), rootTarget) ||
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

	__onResize() {
		this.resize();
	}

	async __openedChanged(newValue) {

		this.__previousFocusableAncestor =
			newValue === true
				? getPreviousFocusableAncestor(this, false, false)
				: null;

		const doOpen = async() => {

			const content = this.__getContentContainer();

			if (!this.noAutoFit) {
				content.scrollTop = 0;
			}

			await this.__position();
			this._showBackdrop = mediaQueryList.matches && this.mobileTray;

			if (!this.noAutoFocus && this.__applyFocus) {
				const focusable = getFirstFocusableDescendant(this);
				if (focusable) {
					// bumping this to the next frame is required to prevent IE/Edge from crazily invoking click on the focused element
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

		if (newValue) {

			await doOpen();

		} else {

			if (this.__dismissibleId) {
				clearDismissible(this.__dismissibleId);
				this.__dismissibleId = null;
			}
			this._showBackdrop = false;
			await this.updateComplete;

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

		const content = this.__getContentContainer();
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
					above: targetRect.top - boundingContainerRect.top - 40,
					// allow for target offset + outer margin
					below: boundingContainerRect.bottom - targetRect.bottom - 40,
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
					above: targetRect.top - 50,
					// allow for target offset + outer margin
					below: window.innerHeight - targetRect.bottom - 80,
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
			if (position) {
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

	_renderContent() {

		const positionStyle = {};
		if (this._position) {
			const isRTL = this.getAttribute('dir') === 'rtl';
			if (!isRTL) {
				positionStyle.left = `${this._position}px`;
			} else {
				positionStyle.right = `${this._position}px`;
			}
		}

		const specialMobileStyle = mediaQueryList.matches && this.mobileTray;
		const mobileTrayRightLeft = mediaQueryList.matches && (this.mobileTray === 'right' || this.mobileTray === 'left');

		let maxWidthOverride = this.maxWidth;
		if (mobileTrayRightLeft) {
			// default maximum width for tray (30px margin)
			const mobileTrayMaxWidthDefault = Math.min(window.innerWidth - 30, 420);
			if (maxWidthOverride) {
				// if maxWidth provided is smaller, use the maxWidth
				maxWidthOverride = Math.min(mobileTrayMaxWidthDefault, maxWidthOverride);
			} else {
				maxWidthOverride = mobileTrayMaxWidthDefault;
			}
		}

		let minWidthOverride = this.minWidth;
		if (mobileTrayRightLeft) {
			// minimum size - 285px
			const mobileTrayMinWidthDefault = 285;
			if (minWidthOverride) {
				// if minWidth provided is smaller, use the minumum width for tray
				minWidthOverride = Math.max(mobileTrayMinWidthDefault, minWidthOverride);
			} else {
				minWidthOverride = mobileTrayMinWidthDefault;
			}
		}

		// set to max width
		let widthOverride;
		if (!specialMobileStyle) {
			widthOverride = this._width;
		} else {
			widthOverride = this._width ? this._width : maxWidthOverride;
			if (widthOverride && maxWidthOverride && widthOverride > (maxWidthOverride - 20)) widthOverride = maxWidthOverride - 20;
			if (widthOverride && minWidthOverride && widthOverride < (minWidthOverride - 20)) widthOverride = minWidthOverride - 20;
		}

		const widthStyle = {
			maxWidth: maxWidthOverride ? `${maxWidthOverride}px` : undefined,
			minWidth: minWidthOverride ? `${minWidthOverride}px` : undefined,
			/* add 2 to content width since scrollWidth does not include border */
			width: widthOverride ? `${widthOverride + 20}px` : ''
		};

		const contentWidthStyle = {
			minWidth: minWidthOverride ? `${minWidthOverride}px` : undefined,
			/* set width of content in addition to width container so IE will render scroll inside border */
			width: widthOverride ? `${widthOverride + 18}px` : '',
		};

		const contentStyle = {
			...contentWidthStyle,
			maxHeight: this._contentHeight && !specialMobileStyle ? `${this._contentHeight}px` : 'none',
			overflowY: this._contentOverflow ? 'auto' : 'hidden'
		};

		const closeButtonStyles = {
			display: specialMobileStyle && !this.noMobileCloseButton ? 'inline-block' : 'none',
			width: 'calc(100% - 24px)',
			padding: '12px'
		};

		const topClasses = {
			'd2l-dropdown-content-top': true,
			'd2l-dropdown-content-top-scroll': this._topOverflow,
			'd2l-dropdown-content-header': this._hasHeader
		};
		const bottomClasses = {
			'd2l-dropdown-content-bottom': true,
			'd2l-dropdown-content-bottom-scroll': this._bottomOverflow,
			'd2l-dropdown-content-footer': this._hasFooter
		};

		const dropdown =  html`
			<div class="d2l-dropdown-content-position" style=${styleMap(positionStyle)}>
				<div  id="d2l-dropdown-wrapper" class="d2l-dropdown-content-width" style=${styleMap(widthStyle)} ?data-closing="${this._closing}">
					<div class=${classMap(topClasses)} style=${styleMap(contentWidthStyle)}>
						<slot name="header" @slotchange="${this.__handleHeaderSlotChange}"></slot>
					</div>
					<div class="d2l-dropdown-content-container" style=${styleMap(contentStyle)} @scroll=${this.__toggleScrollStyles}>
						<slot class="d2l-dropdown-content-slot"></slot>
					</div>
					<div class=${classMap(bottomClasses)} style=${styleMap(contentWidthStyle)}>
						<slot name="footer" @slotchange="${this.__handleFooterSlotChange}"></slot>
						<d2l-button
							style=${styleMap(closeButtonStyles)}
							@click=${this.close}>
							${this.localize('components.dropdown.close')}
						</d2l-button>
					</div>
				</div>
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
