import '../../components/button/button.js';
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
	}

	render() {
		// bind these helper functions to 'd2l-visibility-test' component if one already exists
		if (this.parentElement.querySelector('d2l-visibility-test')) {
			this.el = this.parentElement.querySelector('d2l-visibility-test');
			this.el.animate = 'show'; // el is already displayed on the page
		} else {
			this.el = document.createElement('d2l-visibility-test');
		}

		return html`
			<d2l-button @click='${this.showItem}'>Show element</d2l-button>
			<d2l-button @click='${this.hideItem}'>Hide element</d2l-button>
			<d2l-button @click='${this.removeItem}'>Remove element</d2l-button>
		`;
	}

	hideItem() {
		this.el.animate = 'hide';
	}

	removeItem() {
		this.el.animate = 'remove';
	}

	showItem() {
		this.el.animate = 'show';
		if (!document.body.contains(this.el)) {
			this.parentElement.appendChild(this.el);
		}
	}
}

customElements.define('d2l-visibility-test-helper', VisibilityTestHelper);
