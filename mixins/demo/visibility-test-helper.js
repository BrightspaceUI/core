import { css, html, LitElement } from 'lit-element/lit-element.js';
import { VisibilityTest } from './visibility-test.js';

export class VisibilityTestHelper extends LitElement {

	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}

	render() {
		return html`<button @click='${this.addItem}'>Click to add element
		</button>`;
	}

	addItem() {
		const el = document.createElement('d2l-visibility-test');
		el.animate = 'show';
		this.parentElement.insertBefore(el, this.nextSibling);
	}
}

customElements.define('d2l-visibility-test-helper', VisibilityTestHelper);
