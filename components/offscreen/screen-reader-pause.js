import { html, LitElement } from 'lit';
import { getSeparator } from '@brightspace-ui/intl/lib/list.js';
import { offscreenStyles } from './offscreen.js';

export class ScreenReaderPause extends LitElement {
	static get styles() {
		return offscreenStyles;
	}

	render() {
		return html`<span class="d2l-offscreen">${getSeparator({ nonBreaking: true })}</span>`;
	}
}

customElements.define('d2l-screen-reader-pause', ScreenReaderPause);
