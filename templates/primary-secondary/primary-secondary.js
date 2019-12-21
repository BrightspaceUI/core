import '../../components/colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element';

class TemplatePrimarySecondary extends LitElement {

	static get properties() {
		return {};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
			.container {
				display: grid;
				grid-template-columns: 2fr auto 1fr;
				grid-template-rows: auto auto auto;
				grid-template-areas:
				"header header header"
				"primary divider secondary"
				"footer footer footer";
			}
			.d2l-template-primary-secondary-header {
				grid-area: header;
			}
			.d2l-template-primary-secondary-panels-wrapper {
			}
			.d2l-template-primary-secondary-primary {
				grid-area: primary;
				min-width: 320px;
				overflow-y: auto;
				height: calc(100vh - 100px); /** TEMPORARY **/
			}
			.d2l-template-primary-secondary-divider {
				grid-area: divider;
				background-color: var(--d2l-color-mica);
				width: 1px;
				height: 100%;
				margin: 0 20px;
			}
			.d2l-template-primary-secondary-secondary {
				grid-area: secondary;
				min-width: 320px;
				overflow-y: auto;
				height: calc(100vh - 100px); /** TEMPORARY **/
			}
			.d2l-template-primary-secondary-footer {
				grid-area: footer;
			}
		`;
	}

	render() {
		return html`
			<div class="container">
				<div class="d2l-template-primary-secondary-header"><slot name="header"></slot></div>
					<div class="d2l-template-primary-secondary-primary"><slot name="primary"></slot></div>
					<div class="d2l-template-primary-secondary-divider"></div>
					<div class="d2l-template-primary-secondary-secondary"><slot name="secondary"></slot></div>
				<div class="d2l-template-primary-secondary-footer"><slot name="footer"></slot></div>
			</div>
		`;
	}

}

customElements.define('d2l-template-primary-secondary', TemplatePrimarySecondary);
