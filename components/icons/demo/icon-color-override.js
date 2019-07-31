import '../../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

class IconColorOverride extends LitElement {

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			::slotted(d2l-icon), ::slotted(d2l-icon-custom) {
				color: var(--d2l-color-celestine-minus-1);
			}
		`;
	}

	render() {
		return html`<slot></slot>`;
	}

}

customElements.define('d2l-icon-demo-color-override', IconColorOverride);
