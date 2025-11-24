import '../tabs/tabs.js';
import '../tabs/tab.js';
import '../tabs/tab-panel.js';
import './color-usage-viewer.js';
import './spacing-usage-viewer.js';
import { bodyStandardStyles, heading1Styles } from '../typography/styles.js';
import { css, html, LitElement } from 'lit';

/**
 * A component for viewing semantic design token usage across components.
 * Displays color and spacing viewers in separate tabs.
 */
class SemanticUsageViewer extends LitElement {

	static get properties() {
		return {
			/**
			 * The title to display at the top of the viewer
			 * @type {string}
			 */
			title: { type: String }
		};
	}

	static get styles() {
		return [ bodyStandardStyles, heading1Styles, css`
			:host {
				display: block;
				padding: 1rem;
			}

			.container {
				margin: 0 auto;
				max-width: 1200px;
			}

			h1 {
				margin: 0 0 1.5rem 0;
			}

			d2l-tabs {
				margin-bottom: 1.5rem;
			}

			.viewer-content {
				display: block;
			}
		` ];
	}

	constructor() {
		super();
		this.title = 'Semantic Usage Viewer';
	}

	render() {
		return html`
			<div class="container">
				<h1 class="d2l-heading-1">${this.title}</h1>
				
				<d2l-tabs>
					<d2l-tab id="colors" text="Colors" slot="tabs"></d2l-tab>
					<d2l-tab-panel labelled-by="colors" slot="panels">
						<d2l-color-usage-viewer show-container="false"></d2l-color-usage-viewer>
					</d2l-tab-panel>
					
					<d2l-tab id="spacing" text="Spacing" slot="tabs"></d2l-tab>
					<d2l-tab-panel labelled-by="spacing" slot="panels">
						<d2l-spacing-usage-viewer show-container="false"></d2l-spacing-usage-viewer>
					</d2l-tab-panel>
				</d2l-tabs>
			</div>
		`;
	}

}

customElements.define('d2l-semantic-usage-viewer', SemanticUsageViewer);
