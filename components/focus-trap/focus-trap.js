import { css, html, LitElement } from 'lit-element/lit-element.js';
import { FocusTrapMixin } from './focus-trap-mixin.js';

class FocusTrap extends FocusTrapMixin(LitElement) {

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
		`;
	}

	render() {
		return this._renderFocusTrap(html`<slot></slot>`);
	}

}

customElements.define('d2l-focus-trap', FocusTrap);
