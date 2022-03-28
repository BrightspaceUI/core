import { css, html, LitElement } from 'lit';
import { SelectionMixin } from '../selection-mixin.js';

class DemoSelection extends SelectionMixin(LitElement) {
	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}
	render() {
		return html`
			<slot></slot>
		`;
	}
}
customElements.define('d2l-demo-selection', DemoSelection);
