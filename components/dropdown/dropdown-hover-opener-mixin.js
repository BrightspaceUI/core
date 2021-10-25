
import { DropdownOpenerMixin } from './dropdown-opener-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';

const keyCodes = {
	DOWN: 40,
	ENTER: 13,
	ESCAPE: 27
};

/**
 * A an open-on-hover or click opener for dropdown content.
 * @slot - Dropdown content (e.g., "d2l-dropdown-content", "d2l-dropdown-menu" or "d2l-dropdown-tabs")
 */
export const DropdownHoverOpenerMixin = superclass => class extends DropdownOpenerMixin(superclass) {

	static get properties() {
		return {
			_isHovering: { type: Boolean },
			_isOpen: { type: Boolean },
			_isOpenedViaClick: { type: Boolean },
			_isFading: { type: Boolean }
		};
	}

	constructor() {
		super();

		this._dismissTimerId = getUniqueId();
		this._isOpen = false;
		this._isOpenedViaClick = false;
		this._isHovering = false;
		this._isFading = false;

		this.__onOpenerMouseEnter = this.__onOpenerMouseEnter.bind(this);
		this.__onOpenerMouseLeave = this.__onOpenerMouseLeave.bind(this);
		this.__onOpenerTouch = this.__onOpenerTouch.bind(this);
		this.__onOpenerKeyDown = this.__onOpenerKeyDown.bind(this);
		this.__onOpenerClick = this.__onOpenerClick.bind(this);
		this.__onDropdownOpened = this.__onDropdownOpened.bind(this);
		this.__onDropdownClosed = this.__onDropdownClosed.bind(this);
		this.__onDropdownMouseEnter = this.__onDropdownMouseEnter.bind(this);
		this.__onDropdownMouseLeave = this.__onDropdownMouseLeave.bind(this);
		this._onOutsideClick = this._onOutsideClick.bind(this);
		this._onKeyDown = this._onKeyDown.bind(this);
		this._contentElement = null;
	}

	connectedCallback() {
		super.connectedCallback();
		document.body.addEventListener('click', this._onOutsideClick);
		this.addEventListener('keydown', this._onKeyDown);

		requestAnimationFrame(() => {
			const opener = this.getOpenerElement();
			if (!opener) {
				return;
			}
			opener.addEventListener('mouseenter', this.__onOpenerMouseEnter, true);
			opener.addEventListener('mouseleave', this.__onOpenerMouseLeave, true);
			opener.addEventListener('touchstart', this.__onOpenerTouch, true);
			opener.addEventListener('keydown', this.__onOpenerKeyDown, true);
			opener.addEventListener('click', this.__onOpenerClick, true);
		});
	}

	async disconnectedCallback() {
		super.disconnectedCallback();
		document.body.removeEventListener('click', this._onOutsideClick);
		this.removeEventListener('keydown', this._onKeyDown);

		const opener = this.getOpenerElement();
		if (!opener) {
			return;
		}
		opener.removeEventListener('mouseenter', this.__onOpenerMouseEnter);
		opener.removeEventListener('mouseleave', this.__onOpenerMouseLeave);
		opener.removeEventListener('touchstart', this.__onOpenerTouch);
		opener.removeEventListener('keydown', this.__onOpenerKeyDown);
		opener.removeEventListener('click', this.__onOpenerClick);

		if (!this._contentElement) return;
		this._contentElement.removeEventListener('d2l-dropdown-open', this.__onDropdownOpened);
		this._contentElement.removeEventListener('d2l-dropdown-close', this.__onDropdownClosed);
		this._contentElement.removeEventListener('mouseenter', this.__onDropdownMouseEnter);
		this._contentElement.removeEventListener('mouseleave', this.__onDropdownMouseLeave);
	}

	async updated(changedProperties) {
		super.updated(changedProperties);
		if (!this._contentElement) {
			this._contentElement = this.__getContentElement();
			if (!this._contentElement) return;
			this._contentElement.addEventListener('d2l-dropdown-open', this.__onDropdownOpened, true);
			this._contentElement.addEventListener('d2l-dropdown-close', this.__onDropdownClosed, true);
			this._contentElement.addEventListener('mouseenter', this.__onDropdownMouseEnter, true);
			this._contentElement.addEventListener('mouseleave', this.__onDropdownMouseLeave, true);
		}
		if (!changedProperties.has('_isFading')) return;

		if (this._isFading) {
			this._contentElement.classList.add('d2l-dropdown-content-fading');
		} else {
			this._contentElement.classList.remove('d2l-dropdown-content-fading');
		}
	}

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

	async openDropdown(applyFocus) {
		this._isOpen = true;
		const dropdownContent = this.__getContentElement();
		if (!dropdownContent) return;
		await dropdownContent.open(applyFocus);
		await dropdownContent.updateComplete;
	}

	// overrides dropdownOpenerMixin to no-op - handle opening logic within this class
	async toggleOpen() {}

	__onDropdownClosed() {
		this._isOpen = false;
		this._isOpenedViaClick = false;
	}

	__onDropdownMouseEnter() {
		this._isOpen = true;
		this._isFading = false;
		this._closeTimerStop();
	}

	__onDropdownMouseLeave(e) {
		// if moving between content elements, do not fade
		if (e.toElement === this.__getContentElement()) return;
		this._closeTimerStart();
		if (!this._isOpenedViaClick) this._isOpen = false;
	}

	__onDropdownOpened() {
		this._isFading = false;
	}

	// overrides dropdownOpenerMixin to no-op - handle opening logic within this class
	__onMouseUp() {}

	__onOpenerClick(e) {
		//Prevents click from propagating to parent elements and triggering _onOutsideClick
		e?.stopPropagation();
		this._closeTimerStop();
		if (this._isOpen) {
			this.closeDropdown();
		} else {
			this._isOpenedViaClick = true;
			this.openDropdown(true);
		}
	}

	__onOpenerKeyDown(e) {
		if (e.keyCode !== keyCodes.ENTER && e.keyCode !== keyCodes.DOWN) return;
		this._closeTimerStop();
		e.preventDefault();
		this._isOpenedViaClick = true;
		this.openDropdown(true);
	}

	async __onOpenerMouseEnter() {
		// do not respond to hover events on mobile screens
		const dropdownContent = this.__getContentElement();
		if (dropdownContent._useMobileStyling) return;
		clearTimeout(this._dismissTimerId);
		if (!this._isOpen) await this.openDropdown(false);
		this._closeTimerStop();
		this._isHovering = true;
	}

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

	__onOpenerTouch(e) {
		//Prevents touch from triggering mouseover/hover behavior
		e.preventDefault();
		this._closeTimerStop();
		if (this._isOpen) this.closeDropdown();
		this._isOpenedViaClick = true;
		if (!this._isOpen) this.openDropdown(true);
	}

	_closeTimerStart() {
		if (this._isOpen) return;
		clearTimeout(this._setTimeoutId);
		this._isFading = true;
		this._setTimeoutId = setTimeout(() => {
			this.closeDropdown(false);
			this._isFading = false;
		}, 400);
	}

	_closeTimerStop() {
		clearTimeout(this._setTimeoutId);
		this._isFading = false;
	}

	_onKeyDown(e) {
		if (e.keyCode === keyCodes.ESCAPE && this._isOpen) {
			this.closeDropdown();
		}
	}

	_onOutsideClick(e) {
		if (!this._isOpen) return;
		const isOutsideClick = e.target !== this
			&& e.target !== this.getOpenerElement()
			&& !this.getOpenerElement().contains(e.target)
			&& !this.__getContentElement().contains(e.target);
		const isBackdropClick = (e.path || e.composedPath()).find(node => node.nodeName === 'D2L-BACKDROP');
		if (isBackdropClick || isOutsideClick) {
			this.closeDropdown();
		}
	}

};
