import { getUniqueId } from '../../helpers/uniqueId.js';
import { isComposedAncestor } from '../../helpers/dom.js';

export const DropdownOpenerMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * Disables the dropdown opener
			 * @type {boolean}
			 */
			disabled: {
				type: Boolean,
				reflect: true
			},

			/**
			 * @ignore
			 */
			dropdownOpener: {
				type: Boolean
			},

			/**
			 * Prevents the dropdown from opening automatically on or on key press
			 * @type {boolean}
			 */
			noAutoOpen: {
				type: Boolean,
				reflect: true,
				attribute: 'no-auto-open'
			},

			/**
			 * Optionally open dropdown on click or hover action
			 * @type {boolean}
			 */
			openOnHover: {
				type: Boolean,
				attribute: 'open-on-hover'
			},
			_isHovering: { type: Boolean },
			_isOpen: { type: Boolean },
			_isOpenedViaClick: { type: Boolean },
			_isFading: { type: Boolean }
		};
	}

	constructor() {
		super();
		this.dropdownOpener = true;
		this.noAutoOpen = false;
		this.openOnHover = false;
		this.disabled = false;

		// hover option
		this._dismissTimerId = getUniqueId();
		this._isOpen = false;
		this._isOpenedViaClick = false;
		this._isHovering = false;
		this._isFading = false;

		this.__onWholeKeypress = this.__onKeypress.bind(this);
		this.__onMouseUp = this.__onMouseUp.bind(this);
		this.__onMouseEnter = this.__onMouseEnter.bind(this);
		this.__onMouseLeave = this.__onMouseLeave.bind(this);
		this.__onTouchStart = this.__onTouchStart.bind(this);
		this._contentRendered = null;
		this._openerRendered = null;
	}

	connectedCallback() {
		super.connectedCallback();

		// listeners
		this.addEventListener('keypress', this.__onKeypress);
		this.addEventListener('mouseup', this.__onMouseUp);
		this.addEventListener('mouseenter', this.__onMouseEnter);
		this.addEventListener('mouseleave', this.__onMouseLeave);
		this.addEventListener('touchstart', this.__onTouchStart);

		if (this.openOnHover) {
			document.body.addEventListener('mouseup', this._onOutsideClick);
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		this.removeEventListener('keypress', this.__onKeypress);
		this.removeEventListener('mouseup', this.__onMouseUp);
		this.removeEventListener('mouseenter', this.__onMouseEnter);
		this.removeEventListener('mouseleave', this.__onMouseLeave);
		this.removeEventListener('touchstart', this.__onTouchStart);

		if (this.openOnHover) {
			document.body.removeEventListener('mouseup', this._onOutsideClick);
		}
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('d2l-dropdown-open', this.__onOpened);
		this.addEventListener('d2l-dropdown-close', this.__onClosed);

		const opener = this.getOpenerElement();
		const content = this.__getContentElement();
		if (!opener) {
			return;
		}
		opener.setAttribute('aria-haspopup', 'true');
		opener.setAttribute('aria-expanded', (content && content.opened || false).toString());
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (!this.openOnHover || !changedProperties.has('_isFading')) return;

		if (this._isFading) {
			this.__getContentElement()?.classList.add('d2l-dropdown-content-fading');
		} else {
			this.__getContentElement()?.classList.remove('d2l-dropdown-content-fading');
		}
	}

	/* used by open-on-hover option */
	async closeDropdown(fadeOut) {
		this._isOpen = false;
		this._isHovering = false;
		this._isOpenedViaClick = false;
		if (fadeOut) {
			this._closeTimerStart();
			return;
		}
		const dropdownContent = this.__getContentElement();
		await dropdownContent.close();
	}

	focus() {
		const opener = this.getOpenerElement();
		if (!opener) {
			return;
		}
		opener.focus();
	}

	getOpener() {
		return this;
	}

	getOpenerElement() {
		return this;
	}

	/* used by open-on-hover option */
	async openDropdown(applyFocus) {
		this._isOpen = true;
		const dropdownContent = this.__getContentElement();
		if (!dropdownContent) return;
		await dropdownContent.open(applyFocus);
		await dropdownContent.updateComplete;
	}

	toggleOpen(applyFocus) {
		if (this.disabled) {
			return;
		}

		const content = this.__getContentElement();
		if (!content) {
			return;
		}
		content.toggleOpen(applyFocus);
	}

	__getContentElement() {
		return this.shadowRoot.querySelector('slot:not([name])').assignedNodes()
			.filter(node => node.hasAttribute && node.hasAttribute('dropdown-content'))[0];
	}

	__onClosed() {
		const opener = this.getOpenerElement();
		if (!opener) {
			return;
		}
		opener.setAttribute('aria-expanded', 'false');
		opener.removeAttribute('active');
		this._isOpen = false;
		this._isOpenedViaClick = false;
	}

	/* used by open-on-hover option */
	__onDropdownMouseEnter() {
		this._isOpen = true;
		this._isFading = false;
		this._closeTimerStop();
	}

	/* used by open-on-hover option */
	__onDropdownMouseLeave(e) {
		if (this.__getContentElement() !== e.target) return;
		if (!this._isOpenedViaClick) this._isOpen = false;
		this._closeTimerStart();
	}

	__onKeypress(e) {
		if (isComposedAncestor(e.srcElement, this.getOpenerElement())) {
			this.__onOpenerKeyPress(e);
		}
	}

	__onMouseEnter(e) {
		if (!this.openOnHover) return;
		if (isComposedAncestor(e.srcElement, this.getOpenerElement())) {
			this.__onOpenerMouseEnter(e);
		} else if (isComposedAncestor(this.__getContentElement(), e.srcElement)) {
			this.__onDropdownMouseEnter(e);
		}
	}

	__onMouseLeave(e) {
		if (!this.openOnHover) return;
		if (isComposedAncestor(e.srcElement, this.getOpenerElement())) {
			this.__onOpenerMouseLeave(e);
		} else if (isComposedAncestor(this.__getContentElement(), e.srcElement)) {
			this.__onDropdownMouseLeave(e);
		}
	}

	__onMouseUp(e) {
		if (isComposedAncestor(e.srcElement, this.getOpenerElement())) {
			this.__onOpenerMouseUp(e);
		}
	}

	__onOpened() {
		const opener = this.getOpenerElement();
		if (!opener) {
			return;
		}
		opener.setAttribute('aria-expanded', 'true');
		opener.setAttribute('active', 'true');
		this._isFading = false;
	}

	__onOpenerKeyPress(e) {
		if (e.keyCode !== 13 && e.keyCode !== 32) return;
		if (this.noAutoOpen) return;
		if (!this.openOnHover) {
			this.toggleOpen(true);
		} else {
			this._closeTimerStop();
			e.preventDefault();
			this._isOpenedViaClick = true;
			this.openDropdown(true);
		}
	}

	/* used by open-on-hover option */
	async __onOpenerMouseEnter() {
		// do not respond to hover events on mobile screens
		const dropdownContent = this.__getContentElement();
		if (dropdownContent._useMobileStyling) return;
		clearTimeout(this._dismissTimerId);
		if (!this._isOpen) await this.openDropdown(false);
		this._closeTimerStop();
		this._isHovering = true;
	}

	/* used by open-on-hover option */
	async __onOpenerMouseLeave() {
		// do not respond to hover events on mobile screens
		const dropdownContent = this.__getContentElement();
		if (dropdownContent._useMobileStyling) return;
		this._isHovering = false;
		if (this._isOpenedViaClick) return;
		//Wait before closing so we don't lose hover when we jump from opener to card
		clearTimeout(this._dismissTimerId);
		await this.closeDropdown(true);
	}

	__onOpenerMouseUp(e) {
		if (this.noAutoOpen) return;
		if (this.openOnHover) {
			// prevent propogation to window and triggering _onOutsideClick
			e?.stopPropagation();
			this._closeTimerStop();
			if (this._isOpen && !this._isHovering) {
				this.closeDropdown();
			} else {
				this._isOpenedViaClick = true;
				this._isHovering = false;
				this.openDropdown(true);
			}
		} else this.toggleOpen(false);
	}

	/* used by open-on-hover option */
	__onOpenerTouch(e) {
		//Prevents touch from triggering mouseover/hover behavior
		e.preventDefault();
		this._closeTimerStop();
		if (this._isOpen) {
			this.closeDropdown();
		}
		else {
			this._isOpenedViaClick = true;
			this.openDropdown(true);
		}
	}

	__onTouchStart(e) {
		if (!this.openOnHover) return;
		if (isComposedAncestor(e.srcElement, this.getOpenerElement())) {
			this.__onOpenerTouch(e);
		}
	}

	/* used by open-on-hover option */
	_closeTimerStart() {
		if (this._isOpen) return;
		clearTimeout(this._setTimeoutId);
		this._isFading = true;
		this._setTimeoutId = setTimeout(() => {
			this.closeDropdown(false);
			this._isFading = false;
		// matches dropdownContentStyles CSS
		}, 700);
	}

	/* used by open-on-hover option */
	_closeTimerStop() {
		clearTimeout(this._setTimeoutId);
		this._isFading = false;
	}

	/* used by open-on-hover option */
	_onOutsideClick(e) {
		if (!this._isOpen) return;
		const isWithinDropdown = isComposedAncestor(this.__getContentElement(), e.composedPath()[0]);
		const isBackdropClick = isWithinDropdown
			&& this.__getContentElement()._useMobileStyling
			&& e.composedPath().find(node => node.nodeName === 'D2L-BACKDROP');
		if (!isWithinDropdown || isBackdropClick) {
			this.closeDropdown();
		}
	}
};
