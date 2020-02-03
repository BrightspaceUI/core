import { clearDismissible, setDismissible } from '../../helpers/dismissible.js';
import { findComposedAncestor, isComposedAncestor } from '../../helpers/dom.js';
import { getComposedActiveElement, getFirstFocusableDescendant, getPreviousFocusableAncestor } from '../../helpers/focus.js';
import { html } from 'lit-element/lit-element.js';
import { styleMap } from 'lit-html/directives/style-map.js';

export const DropdownContentMixin = superclass => class extends superclass {

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
			}
		};
	}

	constructor() {
		super();

		this.__opened = false;
		this.__content = null;
		this.__isRTL = false;
		this.__previousFocusableAncestor = null;
		this.__applyFocus = true;
		this.__dismissibleId = null;

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
		this.__content.addEventListener('scroll', this.__toggleScrollStyles);
	}

	connectedCallback() {
		super.connectedCallback();

		window.addEventListener('resize', this.__onResize);
		document.body.addEventListener('focus', this.__onAutoCloseFocus, true);
		document.body.addEventListener('click', this.__onAutoCloseClick, true);

		this.addEventListener('d2l-dropdown-close', this.__onClose);
		this.addEventListener('d2l-dropdown-position', this.__toggleScrollStyles);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('resize', this.__onResize);
		document.body.removeEventListener('focus', this.__onAutoCloseFocus, true);
		document.body.removeEventListener('click', this.__onAutoCloseClick, true);
		this.removeEventListener('d2l-dropdown-close', this.__onClose);
		this.removeEventListener('d2l-dropdown-position', this.__toggleScrollStyles);
		this.__content.removeEventListener('scroll', this.__toggleScrollStyles);
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

	_renderContentContainer(innerHtml) {
		const styles = {};
		if (this.minWidth) {
			styles.minWidth = `${this.minWidth}px`;
		}

		return html`
			<div class="d2l-dropdown-content-container" style=${styleMap(styles)}>
				${innerHtml()}
			</div>
		`;
	}

	_renderWidthContainer(innerHtml) {
		const styles = {};
		if (this.maxWidth) {
			styles.maxWidth = `${this.maxWidth}px`;
		}
		if (this.minWidth) {
			styles.minWidth = `${this.minWidth}px`;
		}

		return html`
			<div class="d2l-dropdown-content-width" style=${styleMap(styles)}>
				${innerHtml()}
			</div>
		`;
	}

	/**
	 * Closes/hides the dropdown.
	 */
	close() {
		this.opened = false;
	}

	/**
	 * Opens/shows the dropdown.
	 * @param {Boolean} applyFocus Whether focus should be automatically move to first focusable upon opening.
	 */
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

	/**
	 * Toggles the opened/closed state of the dropdown.  If closed, it will open, and vice versa.
	 * @param {Boolean} applyFocus Whether focus should be automatically moved to first focusable upon opening.
	 */
	toggleOpen(applyFocus) {
		if (this.opened) {
			this.close();
		} else {
			this.open(applyFocus);
		}
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
			if (elem.isDropdownOpener) {
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

		this.__isRTL = (getComputedStyle(this).direction === 'rtl');

		const doOpen = () => {

			const content = this.__getContentContainer();

			if (!this.noAutoFit) {
				content.scrollTop = 0;
			}

			this.__position(undefined, undefined);

			if (!this.noAutoFocus && this.__applyFocus) {
				const focusable = getFirstFocusableDescendant(this);
				if (focusable) {
					// bumping this to the next frame is required to prevent IE/Edge from crazily invoking click on the focused element
					requestAnimationFrame(() => {
						focusable.focus();
					});
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
				await this.forceRender();
			} else {
				await this.updateComplete;
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

	__position(ignoreVertical, contentRect) {

		const opener = this.__getOpener();
		if (!opener) {
			return;
		}
		const target = opener.getOpenerElement();
		if (!target) {
			return;
		}

		const content = this.__getContentContainer();
		const position = this.__getPositionContainer();
		const widthContainer = this.__getWidthContainer();

		if (!this.noAutoFit) {
			content.style.maxHeight = 'none';
		}

		const adjustPosition = () => {

			const targetRect = target.getBoundingClientRect();
			contentRect = contentRect ? contentRect : content.getBoundingClientRect();

			const spaceAround = {
				above: targetRect.top - 50,
				below: window.innerHeight - targetRect.bottom - 80,
				left: targetRect.left - 20,
				right: document.documentElement.clientWidth - targetRect.right - 15
			};

			if (this.boundary) {
				spaceAround.above = this.boundary.above >= 0 ? Math.min(spaceAround.above, this.boundary.above) : spaceAround.above;
				spaceAround.below = this.boundary.below >= 0 ? Math.min(spaceAround.below, this.boundary.below) : spaceAround.below;
				spaceAround.left = this.boundary.left >= 0 ? Math.min(spaceAround.left, this.boundary.left) : spaceAround.left;
				spaceAround.right = this.boundary.right >= 0 ? Math.min(spaceAround.right, this.boundary.right) : spaceAround.right;
			}

			const spaceRequired = {
				height: contentRect.height + 20,
				width: contentRect.width
			};

			let maxHeight;

			if (!ignoreVertical) {
				if (
					(spaceAround.below < spaceRequired.height)
			&& (
				(spaceAround.above > spaceRequired.height)
				|| (spaceAround.above > spaceAround.below)
			)
				) {
					this.openedAbove = true;
				} else {
					this.openedAbove = false;
				}
			}

			if (this.openedAbove) {
				maxHeight = Math.floor(spaceAround.above);
			} else {
				maxHeight = Math.floor(spaceAround.below);
			}

			if ((this.align === 'start' && !this.__isRTL) || (this.align === 'end' && this.__isRTL)) {
				spaceAround.left = 0;
			} else if ((this.align === 'start' && this.__isRTL) || (this.align === 'end' && !this.__isRTL)) {
				spaceAround.right = 0;
			}

			const centerDelta = contentRect.width - targetRect.width;
			const contentXAdjustment = centerDelta / 2;
			if (centerDelta > 0) {
				// content wider than target, so slide left/right as needed
				if (!this.__isRTL) {
					if (spaceAround.left > contentXAdjustment && spaceAround.right > contentXAdjustment) {
						// center with target
						position.style.left = `${contentXAdjustment * -1}px`;
					} else if (spaceAround.left < contentXAdjustment) {
						// slide content right (not enough space to center)
						position.style.left = `${(spaceAround.left) * -1}px`;
					} else if (spaceAround.right < contentXAdjustment) {
						// slide content left (not enough space to center)
						position.style.left = `${((contentRect.width - targetRect.width) * -1) + spaceAround.right}px`;
					}
				} else {
					if (spaceAround.left > contentXAdjustment && spaceAround.right > contentXAdjustment) {
						// center with target
						position.style.right = `${contentXAdjustment * -1}px`;
					} else if (spaceAround.left < contentXAdjustment) {
						// slide content right (not enough space to center)
						position.style.right = `${((contentRect.width - targetRect.width) * -1) + spaceAround.left}px`;
					} else if (spaceAround.right < contentXAdjustment) {
						// slide content left (not enough space to center)
						position.style.right = `${(spaceAround.right) * -1}px`;
					}
				}
			} else {
				// content narrower than target, so slide in
				if (!this.__isRTL) {
					position.style.left = `${contentXAdjustment * -1}px`;
				} else {
					position.style.right = `${contentXAdjustment * -1}px`;
				}
			}

			if (!this.noAutoFit && maxHeight && maxHeight > 0) {
				content.style.maxHeight = `${maxHeight}px`;
				this.__toggleOverflowY(contentRect.height > maxHeight);
			}

			this.dispatchEvent(new CustomEvent('d2l-dropdown-position', { bubbles: true, composed: true }));
		};

		/* don't let dropdown content horizontally overflow viewport */
		widthContainer.style.width = '';
		content.style.width = '';

		let width = window.innerWidth - 40;
		if (width > content.scrollWidth) {
			width = content.scrollWidth;
		}

		/* add 2 to width since scrollWidth does not include border */
		widthContainer.style.width = `${width + 20}px`;
		/* set width of content too so IE will render scroll inside border */
		content.style.width = `${width + 18}px`;

		adjustPosition();
	}

	__toggleOverflowY(isOverflowing) {
		if (!this.__content || !this.__content.style || !this.__content.style.maxHeight) {
			return;
		}

		const maxHeight = parseInt(this.__content.style.maxHeight, 10);
		if (!maxHeight) {
			return;
		}

		if (isOverflowing || this.__content.scrollHeight > maxHeight) {
			this.__content.style.overflowY = 'auto';
		} else {
			/* needed for IE */
			this.__content.style.overflowY = 'hidden';
		}
	}

	__toggleScrollStyles() {
		const topCap = this.shadowRoot.querySelector('.d2l-dropdown-content-top');
		const bottomCap = this.shadowRoot.querySelector('.d2l-dropdown-content-bottom');
		if (this.__content.scrollTop === 0) {
			if (topCap.classList.contains('d2l-dropdown-content-top-scroll')) {
				topCap.classList.remove('d2l-dropdown-content-top-scroll');
			}
		} else {
			if (!topCap.classList.contains('d2l-dropdown-content-top-scroll')) {
				topCap.classList.add('d2l-dropdown-content-top-scroll');
			}
		}

		/* scrollHeight incorrect in IE by 4px second time opened */
		if (this.__content.scrollHeight - (this.__content.scrollTop + this.__content.clientHeight) < 5) {
			if (bottomCap.classList.contains('d2l-dropdown-content-bottom-scroll')) {
				bottomCap.classList.remove('d2l-dropdown-content-bottom-scroll');
			}
		} else {
			if (!bottomCap.classList.contains('d2l-dropdown-content-bottom-scroll')) {
				bottomCap.classList.add('d2l-dropdown-content-bottom-scroll');
			}
		}
	}
};
