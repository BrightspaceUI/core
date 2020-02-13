import { html, LitElement } from 'lit-element/lit-element.js';
import { DropdownContentMixin } from './dropdown-content-mixin.js';
import { dropdownContentStyles } from './dropdown-content-styles.js';

class DropdownTabs extends DropdownContentMixin(LitElement) {

	static get styles() {
		return dropdownContentStyles;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('d2l-dropdown-open', this._onOpen);
		this.addEventListener('d2l-menu-resize', this._onMenuResize);
		this.addEventListener('d2l-tab-panel-selected', this._onTabSelected);
	}

	render() {
		return html`
			${this._renderContent()}
			<div class="d2l-dropdown-content-pointer">
				<div></div>
			</div>
		`;
	}

	_onMenuResize() {
		this.__position(false);
	}

	_onOpen(e) {

		if (e.target !== this) {
			return;
		}
		const tabs = this._getTabsElement();
		tabs.resize();
	}

	_onTabSelected() {
		this.__position(false);
	}

	_getTabsElement() {
		return this.shadowRoot.querySelector('slot')
			.assignedNodes()
			.find(node => node.hasAttribute && node.getAttribute('role') === 'tablist');
	}

}
customElements.define('d2l-dropdown-tabs', DropdownTabs);
