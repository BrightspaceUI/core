import { css, html, LitElement } from 'lit-element/lit-element.js';

class IconSizeOverride extends LitElement {

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			::slotted(d2l-icon) {
				--d2l-icon-height: 100px;
				--d2l-icon-width: 100px;
			}
		`;
	}

	render() {
		return html`<slot></slot>`;
	}

}

customElements.define('d2l-icon-demo-size-override', IconSizeOverride);
