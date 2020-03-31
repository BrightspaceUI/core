import { css, html, LitElement } from 'lit-element/lit-element.js';
import { DropdownContentMixin } from './dropdown-content-mixin.js';
import { dropdownContentStyles } from './dropdown-content-styles.js';

class DropdownTabs extends DropdownContentMixin(LitElement) {

	static get styles() {
		return [ dropdownContentStyles, css`
			::slotted(d2l-tabs) {
				margin-bottom: 0;
			}
		`];
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

	_onMenuResize(e) {
		const tabs = this._getTabsElement();
		const tabListRect = tabs.getTabListRect();
		// need to include height of tablist, dropdown padding, tab margins
		const rect = {
			height: e.detail.height + tabListRect.height + 52,
			width: e.detail.width
		};
		this.__position(!this._initializingHeight, rect);
		this._initializingHeight = false;
	}

	_onOpen(e) {
		if (e.target !== this) return;
		this._initializingHeight = true;
	}

	_onTabSelected() {
		this.__position(false);
	}

	_getTabsElement() {
		return this.shadowRoot.querySelector('.d2l-dropdown-content-container > slot')
			.assignedNodes()
			.filter(node => node.hasAttribute && node.tagName === 'D2L-TABS')[0];
	}

}
customElements.define('d2l-dropdown-tabs', DropdownTabs);
