import { html, LitElement } from 'lit-element/lit-element.js';

class DomTest extends LitElement {

	getContainer() {
		return this.shadowRoot.querySelector('#container');
	}

	render() {
		return html`<div id="container"><slot id="slot1"></slot></div>`;
	}

}

customElements.define('d2l-dom-test', DomTest);
