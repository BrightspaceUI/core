import { html, LitElement } from 'lit';
import { PagePanelMixin, pagePanelStyles } from './page-panel-mixin.js';

/**
 * Component to be placed in the side-nav slot of d2l-page, providing a panel with optional header
 * @slot - The main content of the side-nav page panel
 * @slot header-start - Optional start content of the side-nav page header
 * @slot header-end - Optional end content of the side-nav page header
 */
class PageSideNav extends PagePanelMixin(LitElement) {

	static styles = [pagePanelStyles];

	render() {
		return this._renderPanel(html`<slot></slot>`);
	}
}

customElements.define('d2l-page-side-nav', PageSideNav);
