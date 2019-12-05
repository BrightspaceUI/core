import '../../components/inputs/input-text.js';
import '../../components/button/button.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { announce } from '../announce.js';

class AnnounceTest extends LitElement {

	static get styles() {
		return css`
			:host {
				display: block;
				width: 400px;
			}
			d2l-input-text {
				margin-bottom: 10px;
			}
		`;
	}

	render() {
		return html`
			<d2l-input-text id="msg1" type="text" value="I like cookies but I also like donuts and many other really yummy things." aria-label="first message to announce"></d2l-input-text>
			<d2l-input-text id="msg2" type="text" value="I also like cake." aria-label="second message to announce"></d2l-input-text>
			<d2l-button @click=${this._handleAnnounce} type="button">Announce</d2l-button>`;
	}

	_handleAnnounce() {
		const value1 = this.shadowRoot.querySelector('#msg1').value;
		if (value1.length > 0) announce(value1);
		const value2 = this.shadowRoot.querySelector('#msg2').value;
		if (value2.length > 0) announce(value2);
	}

}

customElements.define('d2l-test-announce', AnnounceTest);
