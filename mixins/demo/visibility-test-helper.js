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

	constructor() {
		super();
		this.el = document.createElement('d2l-visibility-test');
	}

	render() {
		return html`
			<h3>Helper</h3>
			<button @click='${this.addItem}'>Click to add element</button>
			<button @click='${this.hideItem}'>Click to hide element</button>
			<button @click='${this.removeItem}'>Click to remove element</button>
		`;
	}

	addItem() {
		this.el.animate = 'show';
		this.parentElement.appendChild(this.el, this.nextSibling);
	}

	hideItem() {
		this.el.animate = 'hide';
	}

	removeItem() {
		this.el.animate = 'remove';
	}
}

customElements.define('d2l-visibility-test-helper', VisibilityTestHelper);
