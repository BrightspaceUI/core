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
			 * Optionally open dropdown on click or hover
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

		this.__onKeyPress = this.__onKeyPress.bind(this);
		this.__onMouseUp = this.__onMouseUp.bind(this);

		// hover option
		this._dismissTimerId = getUniqueId();
		this._isOpen = false;
		this._isOpenedViaClick = false;
		this._isHovering = false;
		this._isFading = false;

		this.__onOpenerMouseEnter = this.__onOpenerMouseEnter.bind(this);
		this.__onOpenerMouseLeave = this.__onOpenerMouseLeave.bind(this);
		this.__onOpenerTouch = this.__onOpenerTouch.bind(this);
		this.__onDropdownMouseEnter = this.__onDropdownMouseEnter.bind(this);
		this.__onDropdownMouseLeave = this.__onDropdownMouseLeave.bind(this);
		this._onOutsideClick = this._onOutsideClick.bind(this);
		this._contentRendered = null;
		this._openerRendered = null;
	}

	connectedCallback() {
		super.connectedCallback();

		requestAnimationFrame(() => {
			const opener = this.getOpenerElement();
			const content = this.__getContentElement();
			if (!opener) {
				return;
			}
			opener.setAttribute('aria-haspopup', 'true');
			opener.setAttribute('aria-expanded', (content && content.opened || false).toString());

			opener.addEventListener('keypress', this.__onKeyPress);
			opener.addEventListener('mouseup', this.__onMouseUp);
		});

		if (!this.openOnHover) return;
		document.body.addEventListener('mouseup', this._onOutsideClick);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		const opener = this.getOpenerElement();
		if (!opener) {
			return;
		}
		opener.removeEventListener('keypress', this.__onKeyPress);
		opener.removeEventListener('mouseup', this.__onMouseUp);
		if (this.openOnHover) {
			document.body.removeEventListener('mouseup', this._onOutsideClick);

			const opener = this.getOpenerElement();
			if (!opener) {
				return;
			}
			if (!this._openerRendered) return;

			opener.removeEventListener('mouseenter', this.__onOpenerMouseEnter);
			opener.removeEventListener('mouseleave', this.__onOpenerMouseLeave);
			opener.removeEventListener('touchstart', this.__onOpenerTouch);

			if (!this._contentRendered) return;
			this.__getContentElement().removeEventListener('mouseenter', this.__onDropdownMouseEnter);
			this.__getContentElement().removeEventListener('mouseleave', this.__onDropdownMouseLeave);
		}
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('d2l-dropdown-open', this.__onOpened);
		this.addEventListener('d2l-dropdown-close', this.__onClosed);
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (!this.openOnHover) return;
		if (!this._contentRendered && this.__getContentElement()) {
			this._contentRendered = this.__getContentElement();
			this.__getContentElement().addEventListener('mouseenter', this.__onDropdownMouseEnter, true);
			this.__getContentElement().addEventListener('mouseleave', this.__onDropdownMouseLeave, true);
		}
		if (!this._openerRendered && this.getOpenerElement()) {
			this._openerRendered = this.getOpenerElement();
			const opener = this.getOpenerElement();
			opener.addEventListener('mouseenter', this.__onOpenerMouseEnter, true);
			opener.addEventListener('mouseleave', this.__onOpenerMouseLeave, true);
			opener.addEventListener('touchstart', this.__onOpenerTouch, true);
		}
		if (!changedProperties.has('_isFading') || !this._contentRendered) return;

		if (this._isFading) {
			this.__getContentElement().classList.add('d2l-dropdown-content-fading');
		} else {
			this.__getContentElement().classList.remove('d2l-dropdown-content-fading');
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

	__onKeyPress(e) {
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

	__onMouseUp(e) {
		if (this.noAutoOpen) return;
		if (this.openOnHover) {
			// prevent propogation to window and triggering _onOutsideClick
			e?.stopPropagation();
			this._closeTimerStop();
			if (this._isOpen) {
				this.closeDropdown();
			} else {
				this._isOpenedViaClick = true;
				this.openDropdown(true);
			}
		} else this.toggleOpen(false);
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

	/* used by open-on-hover option */
	__onOpenerTouch(e) {
		//Prevents touch from triggering mouseover/hover behavior
		e.preventDefault();
		this._closeTimerStop();
		if (this._isOpen) this.closeDropdown();
		this._isOpenedViaClick = true;
		if (!this._isOpen) this.openDropdown(true);
	}

	/* used by open-on-hover option */
	_closeTimerStart() {
		if (this._isOpen) return;
		clearTimeout(this._setTimeoutId);
		this._isFading = true;
		this._setTimeoutId = setTimeout(() => {
			this.closeDropdown(false);
			this._isFading = false;
		}, 400);
	}

	/* used by open-on-hover option */
	_closeTimerStop() {
		clearTimeout(this._setTimeoutId);
		this._isFading = false;
	}

	/* used by open-on-hover option */
	_onOutsideClick(e) {
		if (!this._isOpen) return;
		const isWithinDropdown = isComposedAncestor(this.__getContentElement(), (e.path || e.composedPath())[0]);
		const isBackdropClick = isWithinDropdown
			&& this.__getContentElement()._useMobileStyling
			&& (e.path || e.composedPath()).find(node => node.nodeName === 'D2L-BACKDROP');
		if (!isWithinDropdown || isBackdropClick) {
			this.closeDropdown();
		}
	}
};
