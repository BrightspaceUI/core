import '../colors/colors.js';
import { css, html, LitElement } from 'lit';
import { bodySmallStyles } from '../typography/styles.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

/**
 * A component for a "summary item" child component that describes the content in a collapsible panel.
 */
class CollapsiblePanelSummaryItem extends SkeletonMixin(LitElement) {

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
		return [super.styles, bodySmallStyles, css`
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
		return html`<p class="d2l-body-small d2l-skeletize">${this.text}</p>`;
	}
}

customElements.define('d2l-collapsible-panel-summary-item', CollapsiblePanelSummaryItem);
