import { css, html, LitElement } from 'lit-element/lit-element.js';
import { DropdownContentMixin } from './dropdown-content-mixin.js';

/**
 * A container for a "d2l-tabs" component. It provides additional support on top of "d2l-dropdown-content" for automatic resizing when the tab changes.
 * @slot - Anything inside of "d2l-dropdown-content" that isn't in the "header" or "footer" slots appears as regular content
 * @slot header - Sticky container at the top of the dropdown
 * @slot footer - Sticky container at the bottom of the dropdown
 * @fires d2l-dropdown-open - Dispatched when the dropdown is opened
 * @fires d2l-dropdown-close - Dispatched when the dropdown is closed
 * @fires d2l-dropdown-position - Dispatched when the dropdown position finishes adjusting
 */
class DropdownTabs extends DropdownContentMixin(LitElement) {

	static get styles() {
		return css`
			::slotted(d2l-tabs) {
				margin-bottom: 0;
			}
		`;
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

	_getTabsElement() {
		return this.shadowRoot.querySelector('.d2l-dropdown-content-container > slot')
			.assignedNodes()
			.filter(node => node.hasAttribute && node.tagName === 'D2L-TABS')[0];
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

}
customElements.define('d2l-dropdown-tabs', DropdownTabs);
