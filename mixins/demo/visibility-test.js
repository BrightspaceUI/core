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
		return html`<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>`;
	}
}

customElements.define('d2l-visibility-test', VisibilityTest);
