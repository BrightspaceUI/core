import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { findComposedAncestor, isComposedAncestor } from '../../helpers/dom.js';
import { getComposedActiveElement, getFirstFocusableDescendant, getPreviousFocusableAncestor } from '../../helpers/focus.js';
import { classMap } from 'lit-html/directives/class-map';
import { html } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';
import { styleMap } from 'lit-html/directives/style-map.js';

export const DropdownContentMixin = superclass => class extends RtlMixin(superclass) {

	static get properties() {
		return {
			minWidth: {
				type: Number,
				reflect: true,
				attribute: 'min-width'
			},
			maxWidth: {
				type: Number,
				reflect: true,
				attribute: 'max-width'
			},
			noAutoClose: {
				type: Boolean,
				reflect: true,
				attribute: 'no-auto-close'
			},
			noAutoFit: {
				type: Boolean,
				reflect: true,
				attribute: 'no-auto-fit'
			},
			noAutoFocus: {
				type: Boolean,
				reflect: true,
				attribute: 'no-auto-focus'
			},
			noPadding: {
				type: Boolean,
				reflect: true,
				attribute: 'no-padding'
			},
			noPointer: {
				type: Boolean,
				reflect: true,
				attribute: 'no-pointer'
			},
			align: {
				type: String,
				reflect: true
			},
			boundary: {
				type: Object,
			},
			opened: {
				type: Boolean,
				reflect: true
			},
			/**
			 * Private.
			 */
			openedAbove: {
				type: Boolean,
				reflect: true,
				attribute: 'opened-above'
			},
			/**
			 * Whether to render the content immediately. By default, the content rendering
			 * is deferred.
			 */
			renderContent: {
				type: Boolean,
				attribute: 'render-content'
			},
			verticalOffset: {
				type: String,
				attribute: 'vertical-offset'
			},
			_width: {
				type: Number
			},
			_maxHeight: {
				type: Number
			},
			_position: {
				type: Number
			},
			_bottomOverflow: {
				type: Boolean
			},
			_topOverflow: {
				type: Boolean
			},
			_contentOverflow: {
				type: Boolean
			}
		};
	}

	constructor() {
		super();

		this.__opened = false;
		this.__content = null;
		this.__previousFocusableAncestor = null;
		this.__applyFocus = true;
		this.__dismissibleId = null;

		this._bottomOverflow = false;
		this._topOverflow = false;
		this._contentOverflow = false;

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
		this.__opened = val;
		this.requestUpdate('opened', oldVal);
		this.__openedChanged(val);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.__content = this.__getContentContainer();
		this.addEventListener('d2l-dropdown-close', this.__onClose);
		this.addEventListener('d2l-dropdown-position', this.__toggleScrollStyles);
	}

	connectedCallback() {
		super.connectedCallback();

		window.addEventListener('resize', this.__onResize);
		document.body.addEventListener('focus', this.__onAutoCloseFocus, true);
		document.body.addEventListener('click', this.__onAutoCloseClick, true);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('resize', this.__onResize);
		document.body.removeEventListener('focus', this.__onAutoCloseFocus, true);
		document.body.removeEventListener('click', this.__onAutoCloseClick, true);
		clearDismissible(this.__dismissibleId);
		this.__dismissibleId = null;
	}

	updated(changedProperties) {
		changedProperties.forEach((_, propName) => {
			if (propName === 'verticalOffset') {
				// for IE11
				if (window.ShadyCSS) window.ShadyCSS.styleSubtree(this, { '--d2l-dropdown-verticaloffset': `${this.verticalOffset}px` });
				else this.style.setProperty('--d2l-dropdown-verticaloffset', `${this.verticalOffset}px`);
			}
		});
	}

	close() {
		this.opened = false;
	}

	open(applyFocus) {
		this.__applyFocus = applyFocus !== undefined ? applyFocus : true;
		this.opened = true;
	}

	/**
	 * Synchronously stamps and attaches the content into the DOM. By default, rendering of the
	 * content into the DOM is deferred as a performance optimization, so if access to the content
	 * DOM is required (for example by calling `document.querySelector`) before opening the dropdown,
	 * `forceRender` may be used.
	 */
	async forceRender() {
		if (!this.renderContent) {
			this.renderContent = true;
		}
		await this.updateComplete;
	}

	toggleOpen(applyFocus) {
		if (this.opened) {
			this.close();
		} else {
			this.open(applyFocus);
		}
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

	/**
	 * Private.
	 */
	height() {
		return this.__content && this.__content.offsetHeight;
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

		const widthStyle = {
			maxWidth: this.maxWidth ? `${this.maxWidth}px` : undefined,
			minWidth: this.minWidth ? `${this.minWidth}px` : undefined,
			/* add 2 to content width since scrollWidth does not include border */
			width: this._width ? `${this._width + 20}px` : undefined
		};

		const containerStyle = {
			minWidth: this.minWidth ? `${this.minWidth}px` : undefined,
			/* set width of content in addition to width container so IE will render scroll inside border */
			width: this._width ? `${this._width + 18}px` : undefined,
			maxHeight: this._maxHeight ? `${this._maxHeight}px` : 'none',
			overflowY: this._contentOverflow ? 'auto' : 'hidden'
		};

		const topClasses = { 'd2l-dropdown-content-top': true, 'd2l-dropdown-content-top-scroll': this._topOverflow };
		const bottomClasses = { 'd2l-dropdown-content-bottom': true, 'd2l-dropdown-content-bottom-scroll': this._bottomOverflow };

		return html`
			<div class="d2l-dropdown-content-position" style=${styleMap(positionStyle)}>
				<div class="d2l-dropdown-content-width" style=${styleMap(widthStyle)}>
					<div class=${classMap(topClasses)}></div>
					<div class="d2l-dropdown-content-container" style=${styleMap(containerStyle)} @scroll=${this.__toggleScrollStyles}>
						${this.renderContent ? html`<slot></slot>` : null}
					</div>
					<div class=${classMap(bottomClasses)}></div>
				</div>
			</div>
		`;
	}

	__getContentContainer() {
		return this.shadowRoot.querySelector('.d2l-dropdown-content-container');
	}

	__getPositionContainer() {
		return this.shadowRoot.querySelector('.d2l-dropdown-content-position');
	}

	__getWidthContainer() {
		return this.shadowRoot.querySelector('.d2l-dropdown-content-width');
	}

	__getOpener() {
		const opener = findComposedAncestor(this, (elem) => {
			if (elem.dropdownOpener) {
				return true;
			}
		});
		return opener;
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

			this.opened = false;
		}, 0);
	}

	__onAutoCloseClick(e) {
		if (!this.opened || this.noAutoClose) {
			return;
		}
		const rootTarget = e.composedPath()[0];
		const content = this.__getContentContainer();
		if (isComposedAncestor(content, rootTarget)) {
			return;
		}
		const opener = this.__getOpener();
		if (isComposedAncestor(opener.getOpenerElement(), rootTarget)) {
			return;
		}

		this.opened = false;
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
		if (!this.opened) {
			return;
		}
		this.__position();
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

			this.dispatchEvent(new CustomEvent('d2l-dropdown-open', { bubbles: true, composed: true }));

			this.__dismissibleId = setDismissible(() => {
				this.close();
			});
		};

		if (newValue) {
			if (!this.renderContent) {
				this.renderContent = true;
			}

			doOpen();

		} else {

			if (this.__dismissibleId) {
				clearDismissible(this.__dismissibleId);
				this.__dismissibleId = null;
			}

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

		if (!this.noAutoFit) {
			this._maxHeight = null;
		}
		/* don't let dropdown content horizontally overflow viewport */
		this._width = null;
		await this.updateComplete;

		const adjustPosition = async() => {

			const targetRect = target.getBoundingClientRect();
			contentRect = contentRect ? contentRect : content.getBoundingClientRect();

			const spaceAround = this._constrainSpaceAround({
				above: targetRect.top - 50,
				below: window.innerHeight - targetRect.bottom - 80,
				left: targetRect.left - 20,
				right: document.documentElement.clientWidth - targetRect.right - 15
			});

			const spaceRequired = {
				height: contentRect.height + 20,
				width: contentRect.width
			};

			if (!ignoreVertical) {
				this.openedAbove = this._getOpenedAbove(spaceAround, spaceRequired);
			}

			const centerDelta = contentRect.width - targetRect.width;
			const position = this._getPosition(spaceAround, centerDelta);
			if (position) {
				this._position = position;
			}

			const maxHeight = Math.floor(this.openedAbove ? spaceAround.above : spaceAround.below);
			if (!this.noAutoFit && maxHeight && maxHeight > 0) {
				this._maxHeight = maxHeight;
				this.__toggleOverflowY(contentRect.height > maxHeight);

				// ensure the content height has updated when the __toggleScrollStyles event handler runs
				await this.updateComplete;
			}

			this.dispatchEvent(new CustomEvent('d2l-dropdown-position', { bubbles: true, composed: true }));
		};

		this._width = this._getWidth(content.scrollWidth);
		await this.updateComplete;

		adjustPosition();
	}

	_getWidth(scrollWidth) {
		let width = window.innerWidth - 40;
		if (width > scrollWidth) {
			width = scrollWidth;
		}
		return width;
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

	_getOpenedAbove(spaceAround, spaceRequired) {
		return (spaceAround.below < spaceRequired.height) && (
			(spaceAround.above > spaceRequired.height) ||
			(spaceAround.above > spaceAround.below)
		);
	}

	_constrainSpaceAround(spaceAround) {
		const constrained = {...spaceAround};
		if (this.boundary) {
			constrained.above = this.boundary.above >= 0 ? Math.min(spaceAround.above, this.boundary.above) : spaceAround.above;
			constrained.below = this.boundary.below >= 0 ? Math.min(spaceAround.below, this.boundary.below) : spaceAround.below;
			constrained.left = this.boundary.left >= 0 ? Math.min(spaceAround.left, this.boundary.left) : spaceAround.left;
			constrained.right = this.boundary.right >= 0 ? Math.min(spaceAround.right, this.boundary.right) : spaceAround.right;
		}
		const isRTL = this.getAttribute('dir') === 'rtl';
		if ((this.align === 'start' && !isRTL) || (this.align === 'end' && isRTL)) {
			constrained.left = 0;
		} else if ((this.align === 'start' && isRTL) || (this.align === 'end' && !isRTL)) {
			constrained.right = 0;
		}
		return constrained;
	}

	__toggleOverflowY(isOverflowing) {
		if (!this.__content) {
			return;
		}
		if (!this._maxHeight) {
			return;
		}
		this._contentOverflow = isOverflowing || this.__content.scrollHeight > this._maxHeight;
	}

	__toggleScrollStyles() {
		/* scrollHeight incorrect in IE by 4px second time opened */
		this._bottomOverflow = this.__content.scrollHeight - (this.__content.scrollTop + this.__content.clientHeight) >= 5;
		this._topOverflow = this.__content.scrollTop !== 0;
	}
};
