import '../../components/button/button.js';
import './visibility-test.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

export class VisibilityTestHelper extends LitElement {
	static get properties() {
		return {
			mixinMargin: { type: String, attribute: 'mixin-margin' },
			mixinOpacity: { type: String, attribute: 'mixin-opacity' }
		};
	}

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
		if (this.mixinMargin) {
			this.el.style.display = 'grid';
			this.el.style.margin = this.mixinMargin;
		}
		if (this.mixinOpacity) {
			this.el.style.opacity = this.mixinOpacity;
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
