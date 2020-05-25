import { html, LitElement } from 'lit-element/lit-element.js';
import { DropdownContentMixin } from './dropdown-content-mixin.js';
import { dropdownContentStyles } from './dropdown-content-styles.js';

class DropdownMenu extends DropdownContentMixin(LitElement) {

	static get styles() {
		return dropdownContentStyles;
	}

	constructor() {
		super();
		this.noAutoFocus = true;
		this.noPadding = true;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('d2l-dropdown-open', this._onOpen);
		this.addEventListener('d2l-dropdown-close', this._onClose);
		this.addEventListener('d2l-menu-resize', this._onMenuResize);
		this.addEventListener('d2l-menu-item-select', this._onSelect);
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
		return this.shadowRoot.querySelector('.d2l-dropdown-content-slot')
			.assignedNodes().filter(node => node.hasAttribute
				&& (node.getAttribute('role') === 'menu' || node.getAttribute('role') === 'listbox'))[0];
	}

	_onChange(e) {
		if (e.target.getAttribute('role') !== 'menuitemradio') {
			return;
		}
		this.close();
	}

	_onClose(e) {

		if (e.target !== this) {
			return;
		}

		// reset to root view
		const menu = this.__getMenuElement();
		menu.show({ preventFocus: true });
	}

	_onFocus() {
		this.__getMenuElement().focus();
	}

	_onMenuResize(e) {
		this.__position(!this._initializingHeight, e.detail);
		this._initializingHeight = false;

		const menu = this.__getMenuElement();
		if (menu.getMenuType() === 'menu-radio') {
			const selected = menu.querySelector('[selected]');
			if (selected !== null) {
				setTimeout(() => selected.scrollIntoView({ block: 'nearest'}), 0);
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

		if (this.__applyFocus) {
			menu.focus();
		}
	}

	_onSelect(e) {
		if (e.target.tagName !== 'D2L-MENU-ITEM') {
			return;
		}
		this.close();
	}

}
customElements.define('d2l-dropdown-menu', DropdownMenu);
