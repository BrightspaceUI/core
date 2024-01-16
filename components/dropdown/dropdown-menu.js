import { css, html, LitElement } from 'lit';
import { DropdownContentMixin } from './dropdown-content-mixin.js';
import { dropdownContentStyles } from './dropdown-content-styles.js';
import { ThemeMixin } from '../../mixins/theme/theme-mixin.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const dropdownDelay = 300;
/**
 * A container for a "d2l-menu". It provides additional support on top of "d2l-dropdown-content" for closing the menu when menu items are selected, resetting to the root of nested menus when reopening and automatic resizing when the menu resizes.
 * @slot - Anything inside of "d2l-dropdown-content" that isn't in the "header" or "footer" slots appears as regular content
 * @slot header - Sticky container at the top of the dropdown
 * @slot footer - Sticky container at the bottom of the dropdown
 * @fires d2l-dropdown-open - Dispatched when the dropdown is opened
 */
class DropdownMenu extends ThemeMixin(DropdownContentMixin(LitElement)) {

	static get properties() {
		return {
			_closeRadio: {
				type: Boolean,
				reflect: true,
				attribute: '_close-radio'
			},
		};
	}

	static get styles() {
		return [
			dropdownContentStyles,
			css`
				:host {
					--d2l-dropdown-close-animation-name: d2l-dropdown-close-animation;
				}

				:host([theme="dark"]) {
					--d2l-dropdown-close-animation-name: d2l-dropdown-close-animation-dark;
				}

				:host([_close-radio]) {
					animation: var(--d2l-dropdown-close-animation-name) ${dropdownDelay}ms ease-out;
					animation-delay: 50ms;
				}

				@media (prefers-reduced-motion: reduce) {
					:host([_close-radio]) {
						animation: none !important;
					}
				}
				@keyframes d2l-dropdown-close-animation {
					0% { opacity: 1; transform: translate(0, 0); }
					100% { opacity: 0; transform: translate(0, -10px); }
				}

				@keyframes d2l-dropdown-close-animation-dark {
					0% { opacity: 0.9; transform: translate(0, 0); }
					100% { opacity: 0; transform: translate(0, -10px); }
				}
			`
		];
	}

	constructor() {
		super();
		this.noAutoFocus = true;
		this.noPadding = true;
		this._closeRadio = false;
		this._initiallyOpenedSuppressFocus = false;
		this._maxHeightNonTray = this.maxHeight;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this.opened) this._initiallyOpenedSuppressFocus = true;

		this._maxHeightNonTray = this.maxHeight;
		if (this._useMobileStyling && this.mobileTray) {
			this.maxHeight = null;
		} else {
			this.maxHeight = this._maxHeightNonTray;
		}

		this.addEventListener('animationend', this._onAnimationEnd);
		this.addEventListener('d2l-dropdown-open', this._onOpen);
		this.addEventListener('d2l-dropdown-close', this._onClose);
		this.addEventListener('d2l-menu-resize', this._onMenuResize);
		this.addEventListener('d2l-menu-item-select', this._onSelect);
		this.addEventListener('d2l-selection-action-click', this._onSelect);
		this.addEventListener('d2l-menu-item-change', this._onChange);
		this.addEventListener('focus', this._onFocus);
	}

	render() {
		return html`
			${this._renderContent()}
			<div class="d2l-dropdown-content-pointer">
				<div></div>
			</div>
		`;
	}

	__getMenuElement() {
		if (!this.shadowRoot) return undefined;
		return this.shadowRoot.querySelector('.d2l-dropdown-content-slot')
			.assignedNodes().filter(node => node.hasAttribute
				&& (node.getAttribute('role') === 'menu' || node.getAttribute('role') === 'listbox'))[0];
	}

	_onAnimationEnd() {
		if (!this._closeRadio) return;
		this._closeRadio = false;
		this.close();
	}

	_onChange(e) {
		if (e.target.getAttribute('role') !== 'menuitemradio') {
			return;
		}

		if (reduceMotion) {
			// Don't trigger the animation but still wait before closing the dropdown
			setTimeout(() => {
				this.close();
			}, dropdownDelay);
		} else {
			this._closeRadio = true;
		}
	}

	_onClose(e) {

		if (e.target !== this) {
			return;
		}

		// reset to root view
		const menu = this.__getMenuElement();
		menu.show({ preventFocus: true });
	}

	_onFocus(e) {
		// ignore focus events originating from inside dropdown content,
		// such as the mobile tray close button, as to not move focus
		if (e.srcElement === this) return;
		this.__getMenuElement().focus();
	}

	_onMenuResize(e) {

		if (this._useMobileStyling && this.mobileTray) {
			this.maxHeight = null;
		} else {
			this.maxHeight = this._maxHeightNonTray;
		}

		this.__position(!this._initializingHeight, e.detail);
		this._initializingHeight = false;

		const menu = this.__getMenuElement();
		if (menu.getMenuType() === 'menu-radio') {
			const selected = menu.querySelector('[selected]');
			if (selected !== null) {
				setTimeout(() => selected.scrollIntoView({ block: 'nearest' }), 0);
			}
		}
	}

	_onOpen(e) {

		if (e.target !== this) {
			return;
		}
		this._initializingHeight = true;

		const menu = this.__getMenuElement();

		menu.resize();

		// If dropdown-menu is opened on first render, do not focus
		if (this._initiallyOpenedSuppressFocus) this._initiallyOpenedSuppressFocus = false;
		else menu.focus();
	}

	_onSelect(e) {
		if (['D2L-MENU-ITEM', 'D2L-MENU-ITEM-LINK', 'D2L-SELECTION-ACTION-MENU-ITEM'].indexOf(e.target.tagName) < 0) {
			return;
		}
		this.close();
	}

}
customElements.define('d2l-dropdown-menu', DropdownMenu);
