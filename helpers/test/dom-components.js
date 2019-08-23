import { css, html, LitElement } from 'lit-element/lit-element.js';

class DomTest extends LitElement {

	getContainer() {
		return this.shadowRoot.querySelector('#container');
	}

	render() {
		return html`<div id="container"><slot id="slot1"></slot></div>`;
	}

}
customElements.define('d2l-test-dom', DomTest);

class OffsetParentWrapper extends LitElement {

	static get properties() {
		return {
			wrapperId: { type: String, attribute: 'wrapper-id' }
		};
	}

	static get styles() {
		return css`
			#expected {
				position: relative;
			}
		`;
	}

	constructor() {
		super();
		this.wrapperId = 'notExpected';
	}

	render() {
		return html`<div id="${this.wrapperId}">
				<slot></slot>
			</div>
		`;
	}

}
window.customElements.define('d2l-test-offset-parent-wrapper', OffsetParentWrapper);
