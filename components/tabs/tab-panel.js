import { html, LitElement } from 'lit-element/lit-element.js';
import { TabPanelMixin } from './tab-panel-mixin.js';

/**
 * A component for tab panel content.
 * @slot - Default content in tab panel
 * @fires d2l-tab-panel-text-changed - Dispatched when the text attribute is changed
 * @fires d2l-tab-panel-selected - Dispatched when a tab is selected
 */
class TabPanel extends TabPanelMixin(LitElement) {

	render() {
		return html`<slot></slot>`;
	}

}

customElements.define('d2l-tab-panel', TabPanel);
