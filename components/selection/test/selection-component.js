import { css, html, LitElement } from 'lit';
import { SelectionMixin } from '../selection-mixin.js';

class TestSelection extends SelectionMixin(LitElement) {
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
customElements.define('d2l-test-selection', TestSelection);
