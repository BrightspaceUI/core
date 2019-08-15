import './demo-snippet.js';
import './code-view.js';
import '../colors/colors.js';
import '../typography/typography.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { heading2Styles } from '../typography/styles.js';

document.body.classList.add('d2l-typography');

(async() => {
	const fontsPromise = document.fonts ? document.fonts.ready : Promise.resolve();
	await Promise.all([
		customElements.whenDefined('d2l-demo-page'),
		fontsPromise
	]);
	document.body.removeAttribute('unresolved');
})();

class DemoPage extends LitElement {

	static get properties() {
		return {
			pageTitle: { type: String, attribute: 'page-title' }
		};
	}

	static get styles() {
		return [ heading2Styles, css`
			:host {
				background-color: var(--d2l-color-sylvite);
				display: block;
				padding: 30px;
			}
			.d2l-heading-2 {
				margin-top: 0;
			}
			:host > div > ::slotted(h2),
			:host > div > ::slotted(h3) {
				font-size: 0.8rem;
				font-weight: 700;
				line-height: 1.2rem;
				margin: 1.5rem 0 1.5rem 0;
			}
			:host > div > ::slotted(d2l-code-view),
			:host > div > ::slotted(d2l-demo-snippet) {
				margin-bottom: 36px;
			}
		`];
	}

	connectedCallback() {
		super.connectedCallback();
		const title = document.createElement('title');
		title.textContent = this.pageTitle;
		document.head.insertBefore(title, document.head.firstChild);
	}

	render() {
		return html`
			<h1 class="d2l-heading-2">${this.pageTitle}</h1>
			<div><slot></slot></div>
		`;
	}

}

customElements.define('d2l-demo-page', DemoPage);
