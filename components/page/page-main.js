import { css, html, LitElement } from 'lit';
import { PagePanelMixin, pagePanelStyles } from './page-panel-mixin.js';

/**
 * Component to be placed in the main default slot of d2l-page, providing a panel with optional header
 * @slot - The main content of the main page panel
 * @slot header-start - Optional start content of the main page header
 * @slot header-end - Optional end content of the main page header
 */
class PageMain extends PagePanelMixin(LitElement) {

	static styles = [pagePanelStyles, css`
		.panel-header {
			top: var(--d2l-page-header-height, 0);
		}
		.panel {
			/* stylelint-disable-next-line length-zero-no-unit -- used in calc() by consumers */
			--d2l-page-sticky-top: var(--d2l-page-header-height, 0px);
		}
		.panel.header-sticky {
			--d2l-page-sticky-top: calc(var(--d2l-page-header-height, 0px) + var(--d2l-page-panel-header-height, 0px));
		}
	`];

	render() {
		return this._renderPanel(html`<slot></slot>`);
	}

}

customElements.define('d2l-page-main', PageMain);
