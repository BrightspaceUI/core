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
	}

	render() {
		return html`
			${this._renderContent()}
			<div class="d2l-dropdown-content-pointer">
				<div></div>
			</div>
		`;
	}

	_onMenuResize(e) {
		this.__position(!this._initializingHeight, e.detail);
		this._initializingHeight = false;
	}

	_onClose(e) {

		if (e.target !== this) {
			return;
		}

		// reset to root view
		const menu = this.__getMenuElement();
		menu.show({ preventFocus: true });
	}

	_onOpen(e) {

		if (e.target !== this) {
			return;
		}
		this._initializingHeight = true;

		const menu = this.__getMenuElement();

		menu.resize();

		if (this.__applyFocus) {
			setTimeout(() => {
				menu.focus();
			}, 0);
		}
	}

	_onChange(e) {
		if (e.target.getAttribute('role') !== 'menuitemradio') {
			return;
		}
		this.close();
	}

	_onSelect(e) {
		if (e.target.tagName !== 'D2L-MENU-ITEM') {
			return;
		}
		this.close();
	}

	__getMenuElement() {
		return this.shadowRoot.querySelector('slot')
			.assignedNodes()
			.find(node => node.hasAttribute && node.getAttribute('role') === 'menu');
	}

}
customElements.define('d2l-dropdown-menu', DropdownMenu);
