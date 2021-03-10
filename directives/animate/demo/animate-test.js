import '../../../components/button/button.js';
import '../../../components/inputs/input-checkbox.js';
import './animate-test-list.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { hide, show } from '../animate.js';

export class AnimateTest extends LitElement {

	static get properties() {
		return {
			_listVisibility: { type: Boolean, reflect: false },
			_renderCount: { type: Number, reflect: false }
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
		this._doAnimate = false;
		this._listVisibility = true;
		this._renderCount = 0;
	}

	render() {
		const animateAction = this._listVisibility ?
			show({ skip: !this._doAnimate }) :
			hide({ skip: !this._doAnimate });
		return html`
			<d2l-input-checkbox .checked="${this._listVisibility}" @change="${this._handleToggleList}">Show items</d2l-input-checkbox>
			<d2l-animate-test-list .animate="${animateAction}"></d2l-animate-test-list>
			<d2l-button @click="${this._handleAddItem}" ?disabled="${!this._listVisibility}">Add Item</d2l-button>
			<d2l-button @click="${this._handleReRender}">Re-render (${this._renderCount})</d2l-button>
		`;
	}

	_handleAddItem() {
		this.shadowRoot.querySelector('d2l-animate-test-list').addItem();
	}

	_handleReRender() {
		this._renderCount++;
	}

	_handleToggleList(e) {
		this._listVisibility = e.target.checked;
		this._doAnimate = true;
	}

}

customElements.define('d2l-animate-test', AnimateTest);
