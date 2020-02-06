import '../../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class LoadingSpinnerOverride extends LitElement {

	static get properties() {
		return {
			overrideColor: { type: Boolean, attribute: 'override-color' },
			overrideSize: { type: Boolean, attribute: 'override-size' }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			:host([override-color]) {
				--d2l-loading-spinner-color: var(--d2l-color-cinnabar);
			}
			:host([override-size]) {
				--d2l-loading-spinner-size: 100px;
			}
		`;
	}

	render() {
		return html`<d2l-loading-spinner></d2l-loading-spinner>`;
	}

}

customElements.define('d2l-loading-spinner-demo-override', LoadingSpinnerOverride);
