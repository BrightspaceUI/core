import './demo-snippet.js';
import './code-view.js';
import '../colors/colors.js';
import '../typography/typography.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

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
			title: { type: String, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}

	connectedCallback() {
		super.connectedCallback();
		const title = document.createElement('title');
		title.textContent = this.title;
		document.head.insertBefore(title, document.head.firstChild);
	}

	render() {
		return html`<slot></slot>`;
	}

}

customElements.define('d2l-demo-page', DemoPage);
