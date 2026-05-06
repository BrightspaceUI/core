import { html, LitElement } from 'lit';
import { PagePanelMixin, pagePanelStyles } from './page-panel-mixin.js';

/**
 * Component to be placed in the supporting slot of d2l-page, providing a panel with optional header
 * @slot - The main content of the supporting page panel
 * @slot header-start - Optional start content of the supporting page header
 * @slot header-end - Optional end content of the supporting page header
 */
class PageSupporting extends PagePanelMixin(LitElement) {

	static styles = [pagePanelStyles];

	render() {
		return this._renderPanel(html`<slot></slot>`);
	}
}

customElements.define('d2l-page-supporting', PageSupporting);
