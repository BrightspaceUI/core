import { css, html, LitElement } from 'lit-element/lit-element.js';

class IconSizeOverride extends LitElement {

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			.d2l-icon-size-override-container > ::slotted(d2l-icon) {
				height: 100px;
				width: 100px;
			}
		`;
	}

	render() {
		return html`<div class="d2l-icon-size-override-container"><slot></slot></div>`;
	}

}

customElements.define('d2l-icon-demo-size-override', IconSizeOverride);
