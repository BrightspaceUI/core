import { html, LitElement } from 'lit-element/lit-element.js';
import { TabPanelMixin } from './tab-panel-mixin.js';

/**
 * A component for tab panel content.
 * @slot - Default content in tab panel
 */
class TabPanel extends TabPanelMixin(LitElement) {

	render() {
		return html`<slot></slot>`;
	}

}

customElements.define('d2l-tab-panel', TabPanel);
