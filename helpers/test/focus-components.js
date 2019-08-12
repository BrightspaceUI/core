import { html, LitElement } from 'lit-element/lit-element.js';

class FocusTest extends LitElement {

	getContent() {
		return this.shadowRoot.querySelector('#content');
	}

	getShadow1() {
		return this.shadowRoot.querySelector('#shadow1');
	}

	getShadow2() {
		return this.shadowRoot.querySelector('#shadow2');
	}

	render() {
		return html`
			<div>
				<div><a id="shadow1" href="javascript:void(0);"></a></div>
				<div id="content"><slot></slot></div>
				<div><a id="shadow2" href="javascript:void(0);"></a></div>
			</div>
		`;
	}

}

customElements.define('d2l-test-focus', FocusTest);
