import '../../components/inputs/input-text.js';
import '../../components/button/button.js';
import { announce } from '../announce.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class AnnounceTest extends LitElement {

	static get styles() {
		return css`
			:host {
				display: block;
				width: 400px;
			}
			d2l-button {
				margin: 10px 10px 0 0;
			}
		`;
	}

	render() {
		return html`
			<d2l-input-text type="text" value="I like cookies." aria-label="message to announce"></d2l-input-text>
			<d2l-button @click=${this._handleAnnounce} type="button">Announce</d2l-button>`;
	}

	_handleAnnounce() {
		const value = this.shadowRoot.querySelector('d2l-input-text').value;
		announce(value);
	}

}

customElements.define('d2l-test-announce', AnnounceTest);
