import { css, LitElement } from 'lit';
import { DropdownContentMixin } from './dropdown-content-mixin.js';
import { dropdownContentStyles } from './dropdown-content-styles.js';
import { DropdownPopoverMixin } from './dropdown-popover-mixin.js';

const usePopoverMixin = window.D2L?.LP?.Web?.UI?.Flags.Flag('GAUD-7472-dropdown-popover', false);
if (usePopoverMixin) {

	/**
	 * A container for a "d2l-tabs" component. It provides additional support on top of "d2l-dropdown-content" for automatic resizing when the tab changes.
	 * @slot - Anything inside of "d2l-dropdown-content" that isn't in the "header" or "footer" slots appears as regular content
	 * @slot header - Sticky container at the top of the dropdown
	 * @slot footer - Sticky container at the bottom of the dropdown
	 * @fires d2l-dropdown-open - Dispatched when the dropdown is opened
	 */
	class DropdownTabs extends DropdownPopoverMixin(LitElement) {

		static get styles() {
			return [super.styles, css`
				::slotted(d2l-tabs) {
					margin-bottom: 0;
				}
			`];
		}

		firstUpdated(changedProperties) {
			super.firstUpdated(changedProperties);

			this.addEventListener('d2l-dropdown-open', this.#handleOpen);
			this.addEventListener('d2l-menu-resize', this.#handleMenuResize);
			this.addEventListener('d2l-tab-panel-selected', this.#handleTabSelected);
		}

		#initializingHeight;

		#handleMenuResize(e) {

			const tabs = this.shadowRoot?.querySelector('.dropdown-content > slot')
				.assignedNodes()
				.filter(node => node.hasAttribute && node.tagName === 'D2L-TABS')[0];

			if (!tabs) return;
			const tabListRect = tabs.getTabListRect();

			// need to include height of tablist, dropdown padding, tab margins
			const rect = {
				height: e.detail.height + tabListRect.height + 52,
				width: e.detail.width
			};
			this.position(rect, { updateLocation: this.#initializingHeight });
			this.#initializingHeight = false;
		}

		#handleOpen(e) {
			if (e.target !== this) return;
			this.#initializingHeight = true;
		}

		#handleTabSelected() {
			this.position();
		}

	}
	customElements.define('d2l-dropdown-tabs', DropdownTabs);

} else {

	/**
	 * A container for a "d2l-tabs" component. It provides additional support on top of "d2l-dropdown-content" for automatic resizing when the tab changes.
	 * @slot - Anything inside of "d2l-dropdown-content" that isn't in the "header" or "footer" slots appears as regular content
	 * @slot header - Sticky container at the top of the dropdown
	 * @slot footer - Sticky container at the bottom of the dropdown
	 * @fires d2l-dropdown-open - Dispatched when the dropdown is opened
	 */
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
			return this._renderContent();
		}

		_getTabsElement() {
			if (!this.shadowRoot) return undefined;
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
			this.__position(rect, { updateAboveBelow: this._initializingHeight });
			this._initializingHeight = false;
		}

		_onOpen(e) {
			if (e.target !== this) return;
			this._initializingHeight = true;
		}

		_onTabSelected() {
			this.__position();
		}

	}
	customElements.define('d2l-dropdown-tabs', DropdownTabs);

}
