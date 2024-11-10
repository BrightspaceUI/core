import { html, LitElement } from 'lit';
import { TabPanelMixin } from './tab-panel-mixin.js';

/**
 * A component for tab panel content.
 * @slot - Default content in tab panel
 * @typedef {TabPanel} TabPanelExported
 */
class TabPanel extends TabPanelMixin(LitElement) {

	render() {
		return html`<slot></slot>`;
	}

}

customElements.define('d2l-tab-panel', TabPanel);
