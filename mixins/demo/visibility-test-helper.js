import './visibility-test.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

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
			<button @click='${this.showItem}'>Click to show element</button>
			<button @click='${this.hideItem}'>Click to hide element</button>
			<button @click='${this.removeItem}'>Click to remove element</button>
		`;
	}

	showItem() {
		this.el.animate = 'show';
		if (!document.body.contains(this.el)) {
			this.parentElement.appendChild(this.el);
		}
	}

	hideItem() {
		this.el.animate = 'hide';
	}

	removeItem() {
		this.el.animate = 'remove';
	}
}

customElements.define('d2l-visibility-test-helper', VisibilityTestHelper);
