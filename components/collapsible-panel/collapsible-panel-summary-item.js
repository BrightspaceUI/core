import '../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';

/**
 * A component for a "summary item" child component that describes the content in a collapsible panel.
 */
class CollapsiblePanelSummaryItem extends LitElement {

	static get properties() {
		return {
			/**
			 * REQUIRED: Text that is displayed
			 * @type {string}
			 */
			text: { type: String },
		};
	}

	static get styles() {
		return [bodySmallStyles, css`
			:host {
				color: var(--d2l-color-galena);
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.d2l-body-small {
				line-height: 1.2rem;
			}
		`];
	}

	constructor() {
		super();
		this.text = '';
	}

	render() {
		return html`<p class="d2l-body-small">${this.text}</p>`;
	}
}

customElements.define('d2l-collapsible-panel-summary-item', CollapsiblePanelSummaryItem);
