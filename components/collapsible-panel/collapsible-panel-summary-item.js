import '../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';

// TODO: class comment
class CollapsiblePanelSummaryItem extends LitElement {

	static get properties() {
		return {
			text: { type: String },
		};
	}

	static get styles() {
		return [bodySmallStyles, css`
			:host {
				color: var(--d2l-color-galena);
				display: block;
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
