import { offscreenStyles } from '../components/offscreen/offscreen-styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class AnnounceContainer extends LitElement {

	static get styles() {
		return [ offscreenStyles ];
	}

	constructor() {
		super();
		this._messages = [];
	}

	announce(text) {
		this._messages.push(text);
		this.requestUpdate();
	}

	render() {
		return html`<div aria-live="polite" class="d2l-offscreen">
			${this._messages.map(message => html`<div>${message}</div>`)}
		</div>`;
	}

}

customElements.define('d2l-announce-container', AnnounceContainer);

let container;

export function announce(text) {
	if (!text) return;
	if (!container) {
		container = document.createElement('d2l-announce-container');
		document.body.appendChild(container);
	}
	requestAnimationFrame(() => {
		container.announce(text);
	});
}
