import '../components/colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element';

class TemplatePrimarySecondary extends LitElement {

	static get properties() {
		return {};
	}

	static get styles() {
		return css`
			.container {
				display: grid;
				grid-template-columns: 2fr auto 1fr;
				grid-template-rows: auto auto auto;
				grid-template-areas:
				"header header header"
				"primary divider secondary"
				"footer footer footer";
			}
			#header {
				grid-area: header;
			}
			#primary {
				grid-area: primary;
				min-width: 320px;
			}
			#secondary {
				grid-area: secondary;
				min-width: 320px;
			}
			#divider {
				grid-area: divider;
				background-color: var(--d2l-color-mica);
				width: 1px;
				height: 100%;
				margin: 0 20px;
			}
			#footer {
				grid-area: footer;
			}
		`;
	}

	render() {
		return html`
			<div class="container">
				<div id="header"><slot name="header"></slot></div>
				<div id="primary"><slot name="primary"></slot></div>
				<div id="divider"></div>
				<div id="secondary"><slot name="secondary"></slot></div>
				<div id="footer"><slot name="footer"></slot></div>
			</div>
		`;
	}

}

customElements.define('d2l-template-primary-secondary', TemplatePrimarySecondary);
