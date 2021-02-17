import { css, html, LitElement } from 'lit-element/lit-element.js';
import { VisibilityMixin } from '../visibility-mixin.js';

export class VisibilityTest extends VisibilityMixin(LitElement) {

	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}

	render() {
		return html`<div>Div
		</div>`;
	}
}

customElements.define('d2l-visibility-test', VisibilityTest);
