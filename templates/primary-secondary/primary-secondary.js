import '../../components/colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element';

class TemplatePrimarySecondary extends LitElement {

	static get properties() {
		return {
			hideFooter: { type: Boolean }
		};
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
				grid-template-columns: minmax(320px, 2fr) 1px minmax(320px, 1fr);
				grid-template-rows: auto 1fr 78px;
				grid-template-areas:
				"header header header"
				"primary divider secondary"
				"footer footer footer";
				height: 100vh;
			}
			.d2l-template-primary-secondary-header {
				grid-area: header;
			}
			.d2l-template-primary-secondary-primary {
				grid-area: primary;
				overflow-y: auto;
			}
			.d2l-template-primary-secondary-divider {
				grid-area: divider;
				background-color: var(--d2l-color-mica);
				width: 1px;
			}
			.d2l-template-primary-secondary-secondary {
				grid-area: secondary;
				overflow-y: auto;
			}
			.d2l-template-primary-secondary-footer {
				grid-area: footer;
				box-shadow: 0 -2px 4px rgba(86, 90, 92, .2);
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
				<div class="d2l-template-primary-secondary-footer" ?hidden="${this.hideFooter}"><slot name="footer"></slot></div>
			</div>
		`;
	}

}

customElements.define('d2l-template-primary-secondary', TemplatePrimarySecondary);
